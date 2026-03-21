// components/HealingDuration.jsx
"use client";
import React, { useState, useEffect } from "react";
import "./HealingDuration.css";
import { FaCheckCircle } from "react-icons/fa";
import { postData } from "@/app/services/FetchNodeServices";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function HealingDuration() {
  const [activePlan, setActivePlan] = useState("Deep Transformation");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    gstNumber: ""
  });
  const router = useRouter();

  useEffect(() => {
    // Get user and token from localStorage
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("User_data");
    const parsedUser = userData ? JSON.parse(userData) : null;
    
    console.log("Token exists:", !!token);
    console.log("User data from localStorage:", parsedUser);
    
    if (parsedUser && parsedUser._id) {
      console.log("User ID:", parsedUser._id);
      console.log("User Name:", parsedUser.name);
      console.log("User Email:", parsedUser.email);
      
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || parsedUser.mobile || ""
      }));
    }
    
    setUserToken(token);
    setUser(parsedUser);
  }, []);

  // ✅ Load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // ✅ Check if user is logged in
  const checkAuthentication = () => {
    if (!userToken || !user || !user._id) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to continue with your healing journey",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#722f7f"
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Pages/Login");
        }
      });
      return false;
    }
    return true;
  };

  // ✅ Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      Swal.fire("Error", "Please enter your full name", "error");
      return false;
    }
    if (!formData.email.trim()) {
      Swal.fire("Error", "Please enter your email address", "error");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire("Error", "Please enter a valid email address", "error");
      return false;
    }
    if (!formData.phone.trim()) {
      Swal.fire("Error", "Please enter your phone number", "error");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      Swal.fire("Error", "Please enter a valid 10-digit phone number", "error");
      return false;
    }
    if (!formData.addressLine1.trim()) {
      Swal.fire("Error", "Please enter your address", "error");
      return false;
    }
    if (!formData.city.trim()) {
      Swal.fire("Error", "Please enter your city", "error");
      return false;
    }
    if (!formData.state.trim()) {
      Swal.fire("Error", "Please enter your state", "error");
      return false;
    }
    if (!formData.pinCode.trim()) {
      Swal.fire("Error", "Please enter your PIN code", "error");
      return false;
    }
    const pinRegex = /^[0-9]{6}$/;
    if (!pinRegex.test(formData.pinCode)) {
      Swal.fire("Error", "Please enter a valid 6-digit PIN code", "error");
      return false;
    }
    return true;
  };

  // ✅ Open checkout modal
  const openCheckoutModal = (plan) => {
    if (!checkAuthentication()) {
      return;
    }
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  // ✅ Close modal
  const closeModal = () => {
    setShowCheckoutModal(false);
    setSelectedPlan(null);
  };

  // ✅ Process payment after form submission
  const processPayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!selectedPlan) {
      Swal.fire("Error", "No plan selected", "error");
      return;
    }

    setLoading(true);
    closeModal();

    try {
      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        Swal.fire({
          title: "Error",
          text: "Payment system failed to load. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
        setLoading(false);
        return;
      }

      // Prepare plan details
      const planDetails = {
        planName: selectedPlan.name,
        duration: selectedPlan.duration,
        amount: selectedPlan.amount,
        originalAmount: selectedPlan.original,
        savings: selectedPlan.save,
        description: selectedPlan.desc,
        features: selectedPlan.features
      };

      // Get user details
      const userDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      // Prepare shipping address
      const shippingAddress = {
        fullName: formData.name,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        country: formData.country,
        phone: formData.phone,
        gstNumber: formData.gstNumber
      };

      console.log("Processing payment with:", {
        amount: selectedPlan.amount,
        planDetails,
        userId: user._id,
        userDetails,
        shippingAddress
      });

      // 🔹 Create Order
      const data = await postData("api/razorpay/create-order", {
        amount: selectedPlan.amount,
        planDetails: planDetails,
        userId: user._id,
        userDetails: userDetails,
        shippingAddress: shippingAddress,
        isGuest: false
      });

      console.log("Order creation response:", data);

      if (!data.success) {
        Swal.fire({
          title: "Error",
          text: data.message || "Order creation failed. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
        setLoading(false);
        return;
      }

      // 🔹 Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Manovaidya",
        description: selectedPlan.name,
        order_id: data.order.id,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        notes: {
          plan: selectedPlan.name,
          healingOrderId: data.healingOrderId,
          userId: user._id,
          userEmail: userDetails.email
        },
        theme: {
          color: "#722f7f",
        },
        handler: async function (response) {
          try {
            // 🔹 Verify Payment
            const verifyData = await postData("api/razorpay/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              healingOrderId: data.healingOrderId,
              planDetails: planDetails
            });

            console.log("Payment verification response:", verifyData);

            if (verifyData.success) {
              Swal.fire({
                title: "Payment Successful!",
                text: "Your order has been confirmed. You will receive a confirmation email shortly.",
                icon: "success",
                confirmButtonText: "View Order",
                confirmButtonColor: "#722f7f"
              }).then(() => {
                router.push(`/order-confirmation?orderId=${verifyData.order._id}`);
              });
            } else {
              Swal.fire({
                title: "Payment Verification Failed",
                text: "Please contact support with your order details.",
                icon: "error",
                confirmButtonText: "OK"
              });
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            Swal.fire({
              title: "Verification Error",
              text: "Payment verification failed. Please contact support.",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      // Handle payment failure
      paymentObject.on('payment.failed', function (response) {
        console.error("Payment failed:", response);
        Swal.fire({
          title: "Payment Failed",
          text: response.error.description || "Your payment could not be processed. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
      });
      
      paymentObject.open();

    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        title: "Payment Error",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Plans Data
  const plans = [
    {
      name: "Foundation Calm",
      duration: "1 Month",
      amount: 1680,
      original: 4200,
      save: 2520,
      desc: "Begin your healing gently",
      features: [
        "1-Month Kit Supply",
        "4 Coaching Sessions",
        "Orientation Call",
        "21-Day Journal",
        "Guided Practices",
      ],
    },
    {
      name: "Deep Transformation",
      duration: "3 Months",
      amount: 5040,
      original: 12600,
      save: 7560,
      desc: "Most chosen by our community",
      popular: true,
      features: [
        "3-Month Kit Supply",
        "12 Weekly Sessions",
        "Priority Coach Support",
        "Progress Tracking",
        "Full Practice Library",
      ],
    },
    {
      name: "Intensive Recovery",
      duration: "6 Months",
      amount: 9072,
      original: 25200,
      save: 16128,
      desc: "Maximum support & best value",
      features: [
        "6-Month Kit Supply",
        "24+ Weekly Sessions",
        "1-on-1 Priority Sessions",
        "Advanced Protocols",
        "Bonus Content Library",
      ],
    },
  ];

  return (
    <>
      <section className="harb-duration-section">
        <h2 className="harb-duration-title">
          Choose Your Healing Duration
        </h2>

        <p className="harb-duration-subtitle">
          Every plan includes your kit + mind coach + guided practices.
        </p>

        {!userToken || !user ? (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '10px', fontSize: '16px' }}>
              <strong>🔐 Login Required</strong>
            </p>
            <p style={{ marginBottom: '15px', color: '#856404' }}>
              Please login to continue with your healing journey and track your orders.
            </p>
            <button
              onClick={() => router.push("/Pages/Login")}
              style={{
                backgroundColor: '#722f7f',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Login Now
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>
              👋 Welcome back, <strong>{user.name}</strong>! You're logged in and ready to purchase.
            </p>
          </div>
        )}

        <div className="harb-duration-cards">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`harb-duration-card ${
                activePlan === plan.name ? "harb-duration-active" : ""
              }`}
              onClick={() => setActivePlan(plan.name)}
            >
              {plan.popular && (
                <span className="harb-duration-badge">Most Popular</span>
              )}

              <h3>{plan.name}</h3>
              <span className="harb-duration-month">{plan.duration}</span>

              <p className="harb-duration-price">
                ₹{plan.amount} <span>₹{plan.original}</span>
              </p>

              <p className="harb-duration-save">Save ₹{plan.save}</p>

              <p className="harb-duration-desc">{plan.desc}</p>

              <ul>
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <button
                disabled={loading || !userToken || !user}
                onClick={(e) => {
                  e.stopPropagation();
                  openCheckoutModal(plan);
                }}
                className={`harb-duration-btn ${
                  activePlan === plan.name
                    ? "harb-duration-btn-active"
                    : ""
                }`}
              >
                {loading
                  ? "Processing..."
                  : !userToken || !user
                  ? "Login to Pay"
                  : activePlan === plan.name
                  ? "Pay Now"
                  : "Select Plan"}
              </button>
            </div>
          ))}
        </div>

        <div className="harb-duration-footer">
          <span><FaCheckCircle /> Money-Back Guarantee</span>
          <span><FaCheckCircle /> Free Shipping</span>
          <span><FaCheckCircle /> Personalized to You</span>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay" onClick={closeModal}>
          <div className="checkout-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-modal-header">
              <h2>Complete Your Order</h2>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>

            <div className="checkout-modal-body">
              <div className="checkout-sections">
                {/* Contact Section */}
                <div className="checkout-section">
                  <h3>Contact</h3>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="form-control"
                      disabled={!!user?.email}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Delivery Section */}
                <div className="checkout-section">
                  <h3>Delivery</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Address line 1"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Address line 2 (optional)"
                      className="form-control"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        placeholder="PIN code"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* GST Section */}
                <div className="checkout-section">
                  <h3>Tax Information (Optional)</h3>
                  <div className="form-group">
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      placeholder="GST Number (if applicable)"
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="checkout-section">
                  <h3>Payment</h3>
                  <div className="payment-methods">
                    <div className="payment-method-card">
                      <div className="payment-method-icon">
                        <i className="bi bi-credit-card"></i>
                      </div>
                      <div className="payment-method-details">
                        <strong>CashFree Payment</strong>
                        <small>UPI, Cards, Wallets, NetBanking</small>
                      </div>
                    </div>
                    
                    <div className="payment-icons">
                      <i className="bi bi-credit-card"></i>
                      <i className="bi bi-wallet2"></i>
                      <i className="bi bi-bank"></i>
                      <span>Visa</span>
                      <span>MasterCard</span>
                    </div>
                    
                    <div className="secure-payment-note">
                      <i className="bi bi-lock-fill"></i>
                      <span>All transactions are secure and encrypted</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="checkout-section order-summary">
                  <h3>Order Summary</h3>
                  <div className="order-summary-item">
                    <span>{selectedPlan?.name} - {selectedPlan?.duration}</span>
                    <span>₹{selectedPlan?.amount}</span>
                  </div>
                  <div className="order-summary-item">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="order-summary-total">
                    <strong>Total</strong>
                    <strong>₹{selectedPlan?.amount}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="checkout-modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={processPayment}
                disabled={loading}
              >
                {loading ? "Processing..." : `Pay ₹${selectedPlan?.amount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .checkout-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow-y: auto;
          padding: 20px;
        }

        .checkout-modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .checkout-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }

        .checkout-modal-header h2 {
          margin: 0;
          font-size: 24px;
          color: #722f7f;
        }

        .close-modal-btn {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #666;
          transition: color 0.3s;
        }

        .close-modal-btn:hover {
          color: #722f7f;
        }

        .checkout-modal-body {
          padding: 24px;
        }

        .checkout-sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .checkout-section {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 20px;
        }

        .checkout-section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          color: #333;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-control {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .form-control:focus {
          outline: none;
          border-color: #722f7f;
        }

        .payment-methods {
          background: #f9f9f9;
          padding: 16px;
          border-radius: 8px;
        }

        .payment-method-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .payment-method-icon {
          font-size: 24px;
          color: #722f7f;
        }

        .payment-method-details {
          flex: 1;
        }

        .payment-method-details strong {
          display: block;
          margin-bottom: 4px;
        }

        .payment-method-details small {
          color: #666;
          font-size: 12px;
        }

        .payment-icons {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          border-top: 1px solid #e5e7eb;
          margin-top: 12px;
        }

        .payment-icons i, .payment-icons span {
          font-size: 20px;
          color: #666;
        }

        .secure-payment-note {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #666;
        }

        .secure-payment-note i {
          color: #10b981;
        }

        .order-summary {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 16px;
          margin-top: 8px;
        }

        .order-summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          color: #555;
        }

        .order-summary-total {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          margin-top: 8px;
          border-top: 2px solid #e5e7eb;
          font-size: 18px;
        }

        .checkout-modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          position: sticky;
          bottom: 0;
          background: white;
        }

        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #722f7f;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #5a2364;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #333;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .checkout-modal-content {
            max-width: 95%;
          }
        }
      `}</style>
    </>
  );
}