"use client";
import React, { useState } from "react";
import "./HealingDuration.css";
import { FaCheckCircle } from "react-icons/fa";

export default function HealingDuration() {
  const [activePlan, setActivePlan] = useState("Deep Transformation");
  const [loading, setLoading] = useState(false);

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

  // ✅ Payment Handler
  const handlePayment = async (plan) => {
    try {
      setLoading(true);

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // 🔹 Create Order
      const res = await fetch(
        "http://localhost:5002/api/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: plan.amount,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert("Order creation failed");
        return;
      }

      // 🔹 Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Manovaidya",
        description: plan.name,
        order_id: data.order.id,

        handler: async function (response) {
          // 🔹 Verify Payment
          const verifyRes = await fetch(
            "http://localhost:5002/api/razorpay/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("✅ Payment Successful");
          } else {
            alert("❌ Payment Verification Failed");
          }
        },

        prefill: {
          name: "Abhishek Kumar",
          email: "test@gmail.com",
          contact: "9999999999",
        },

        notes: {
          plan: plan.name,
        },

        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Plans Data (Clean & Dynamic)
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
    <section className="harb-duration-section">
      <h2 className="harb-duration-title">
        Choose Your Healing Duration
      </h2>

      <p className="harb-duration-subtitle">
        Every plan includes your kit + mind coach + guided practices.
      </p>

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
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handlePayment(plan);
              }}
              className={`harb-duration-btn ${
                activePlan === plan.name
                  ? "harb-duration-btn-active"
                  : ""
              }`}
            >
              {loading
                ? "Processing..."
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
  );
}