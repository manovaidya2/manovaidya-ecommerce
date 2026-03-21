// routes/razorpay.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import HealingOrder from "../models/HealingOrder.js";
import User from "../models/User.js";
import ShortUniqueId from "short-unique-id";

const router = express.Router();

// Helper function to generate unique order ID
const generateOrderId = () => {
  const uid = new ShortUniqueId({ length: 10 });
  return `HEAL_${uid.rnd()}`;
};

// ✅ 1. Create Order - Enhanced user handling
router.post("/create-order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { 
      amount, 
      planDetails, 
      userId, 
      userDetails,
      shippingAddress,
      isGuest 
    } = req.body;

    console.log("Create Order Request:", { amount, planDetails, userId, userDetails, isGuest });

    // Validate required fields
    if (!amount || !planDetails) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount or planDetails"
      });
    }

    let userInfo = null;
    let actualUserId = null;
    
    // If userId is provided, fetch real user data from database
    if (userId) {
      try {
        const realUser = await User.findById(userId);
        if (realUser) {
          actualUserId = realUser._id;
          userInfo = {
            name: realUser.name,
            email: realUser.email,
            phone: realUser.phone || realUser.mobile || ''
          };
          console.log("Found real user in DB:", userInfo);
        } else {
          console.log("User not found with ID:", userId);
          // Use provided userDetails as fallback
          userInfo = userDetails;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        userInfo = userDetails;
      }
    } else {
      // Guest user - use provided details
      userInfo = userDetails;
      console.log("Guest user:", userInfo);
    }
    
    // Ensure userInfo exists
    if (!userInfo) {
      userInfo = {
        name: "Guest User",
        email: `guest_${Date.now()}@manovaidya.com`,
        phone: "Not provided"
      };
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planName: planDetails.planName,
        userEmail: userInfo.email,
        userId: actualUserId ? actualUserId.toString() : 'guest',
        isGuest: (!actualUserId).toString()
      }
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order.id);

    // Create healing order in database
    const healingOrderData = {
      user: actualUserId, // Will be null for guests, ObjectId for logged in users
      orderId: generateOrderId(),
      razorpayOrderId: order.id,
      planDetails: {
        planName: planDetails.planName,
        duration: planDetails.duration,
        amount: planDetails.amount,
        originalAmount: planDetails.originalAmount,
        savings: planDetails.savings,
        description: planDetails.description || '',
        features: planDetails.features || []
      },
      userDetails: {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || ''
      },
      shippingAddress: shippingAddress || {},
      paymentStatus: 'pending',
      isPaid: false,
      orderStatus: 'pending',
      isGuest: !actualUserId
    };

    console.log("Creating HealingOrder with data:", healingOrderData);

    const healingOrder = new HealingOrder(healingOrderData);
    await healingOrder.save();

    console.log("HealingOrder saved successfully:", healingOrder._id);
    console.log("User field value:", healingOrder.user);

    res.json({ 
      success: true, 
      order,
      healingOrderId: healingOrder._id 
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ✅ 2. Verify Payment and Update Order
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      healingOrderId,
      planDetails
    } = req.body;

    console.log("Verify Payment Request:", { razorpay_order_id, healingOrderId });

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      
      // Find and update the order
      let updatedOrder = null;
      
      // Try to find by healingOrderId first
      if (healingOrderId) {
        updatedOrder = await HealingOrder.findByIdAndUpdate(
          healingOrderId,
          {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentStatus: 'success',
            isPaid: true,
            paidAt: new Date(),
            orderStatus: 'processing'
          },
          { new: true }
        ).populate('user', 'name email phone');
        
        console.log("Order updated by ID:", updatedOrder);
      }
      
      // If not found by ID, try by razorpayOrderId
      if (!updatedOrder) {
        updatedOrder = await HealingOrder.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentStatus: 'success',
            isPaid: true,
            paidAt: new Date(),
            orderStatus: 'processing'
          },
          { new: true }
        ).populate('user', 'name email phone');
        
        console.log("Order updated by razorpay ID:", updatedOrder);
      }
      
      if (!updatedOrder) {
        console.log("Order not found for update");
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      return res.json({ 
        success: true, 
        message: "Payment verified and order updated successfully",
        order: updatedOrder
      });
      
    } else {
      // Update order as failed
      if (healingOrderId) {
        await HealingOrder.findByIdAndUpdate(
          healingOrderId,
          {
            paymentStatus: 'failed',
            orderStatus: 'cancelled'
          }
        );
      }
      
      return res.status(400).json({ 
        success: false, 
        message: "Invalid signature - payment verification failed" 
      });
    }

  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// ✅ 3. Get Orders by User ID (for logged in users)
router.get("/get-user-orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await HealingOrder.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');
    
    res.json({
      success: true,
      orders,
      count: orders.length
    });
    
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ 4. Get Orders by Email (for guests)
router.get("/get-orders-by-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    
    const orders = await HealingOrder.find({ "userDetails.email": email })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders,
      count: orders.length
    });
    
  } catch (error) {
    console.error("Get orders by email error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ 5. Get Single Order Details
router.get("/get-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await HealingOrder.findOne({ 
      $or: [
        { _id: orderId },
        { orderId: orderId }
      ]
    }).populate('user', 'name email phone');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ 6. Get All Orders (Admin)
router.get("/get-all-orders", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) {
      query.paymentStatus = status;
    }
    
    const orders = await HealingOrder.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'name email phone');
    
    const total = await HealingOrder.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ 7. Update Order Status (Admin)
router.put("/update-order-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    
    const order = await HealingOrder.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });
    
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;