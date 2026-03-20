import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


// ✅ 1. Create Order
router.post("/create-order", async (req, res) => {
  try {

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });

  } catch (error) {
    console.log("ENV DEBUG:", process.env.RAZORPAY_KEY_ID); // 👈 debug
    res.status(500).json({ success: false, error: error.message });
  }
});
// ✅ 2. Verify Payment
router.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;