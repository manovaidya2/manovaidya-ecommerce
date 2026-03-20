"use client";
import React, { useState } from "react";
import "./Program.css";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
import {
  FaBrain,
  FaMoon,
  FaBolt,
  FaShieldAlt,
  FaStar,
  FaGift,
  FaRocket,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";
import { GiFlowerEmblem, GiMeditation, GiHealing } from "react-icons/gi";

import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { useRouter } from "next/navigation";

export default function Program() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    const data = await getData("api/products/all-product");
    if (data?.success) {
      setProducts(data.products.filter((p) => p.isActive));
    }
    setLoading(false);
  };

  // ✅ OPEN MODAL
  const openModal = async (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    await fetchProducts();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="harb-program-section">
        <p className="harb-program-tag">PROGRAMS</p>
        <h2 className="harb-program-title">Choose Your Healing Program</h2>
        <p className="harb-program-desc">
          You're not just buying a kit — you're entering a guided system designed for real transformation.
        </p>

        <div className="harb-program-cards">

          {/* CARD 1 - SAME */}
          <div className="harb-program-card">
            <div className="harb-program-card-top">
              <span className="harb-program-icon-box">
                <GiFlowerEmblem className="harb-program-icon" />
              </span>
              <span className="harb-program-badge">Begin Gently</span>
            </div>

            <h3 className="harb-program-card-title">Foundation Calm</h3>
            <p className="harb-program-card-sub">1 Month Program</p>

            <p className="harb-program-price">
              ₹2,550 <span>₹5,100</span>
            </p>

            <ul className="harb-program-list">
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> 1-Month Brain Nourishment Kit</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> 4 Mind Coaching Sessions</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Journal & Daily Practices</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Community Access</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Orientation Call</li>
            </ul>

            <button
              className="harb-program-btn harb-program-btn-primary"
              onClick={() => openModal("Foundation Calm")}
            >
              <FaHeart className="harb-program-btn-icon" /> Start This Plan
            </button>
          </div>

          {/* CARD 2 - SAME */}
          <div className="harb-program-card harb-program-card-active">
            <div className="harb-program-card-top">
              <span className="harb-program-icon-box harb-program-icon-purple">
                <FaRocket className="harb-program-icon" />
              </span>
              <span className="harb-program-badge harb-program-badge-purple">Most Popular</span>
            </div>

            <h3 className="harb-program-card-title">Deep Transformation</h3>
            <p className="harb-program-card-sub">3 Months Program</p>

            <p className="harb-program-price harb-program-price-main">
              ₹7,650 <span>₹15,300</span>
            </p>

            <ul className="harb-program-list">
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> 3-Month Brain Nourishment Kit</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> 12 Weekly Coaching Sessions</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Advanced Progress Tracking</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Priority Coach Support</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Journal & Guided Practices</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Community Access</li>
            </ul>

            <button
              className="harb-program-btn harb-program-btn-primary"
              onClick={() => openModal("Deep Transformation")}
            >
              <FaStar className="harb-program-btn-icon" /> Begin Deep Healing
            </button>
          </div>

          {/* CARD 3 - SAME */}
          <div className="harb-program-card">
            <div className="harb-program-card-top">
              <span className="harb-program-icon-box">
                <FaShieldAlt className="harb-program-icon" />
              </span>
              <span className="harb-program-badge">Best Value</span>
            </div>

            <h3 className="harb-program-card-title">Intensive Recovery</h3>
            <p className="harb-program-card-sub">6 Months Program</p>

            <p className="harb-program-price">
              ₹13,770 <span>₹30,600</span>
            </p>

            <ul className="harb-program-list">
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> 6-Month Brain Nourishment Kit</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Full Weekly Coaching Access</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Advanced Recovery Protocols</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> 1-on-1 Priority Sessions</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Journal, Practices & Tracking</li>
              <li><IoCheckmarkCircle className="harb-program-check-icon" /> Community + Bonus Content</li>
            </ul>

            <button
              className="harb-program-btn harb-program-btn-primary"
              onClick={() => openModal("Intensive Recovery")}
            >
              <FaGift className="harb-program-btn-icon" /> Start Intensive Program
            </button>
          </div>

        </div>

        <p className="harb-program-footer">
          <FaCheckCircle className="harb-program-footer-icon" /> Money-Back Guarantee •
          <FaCheckCircle className="harb-program-footer-icon" /> Free Shipping •
          <FaCheckCircle className="harb-program-footer-icon" /> Personalized to You
        </p>
      </section>

      {/* ✅ ONLY MODAL CHANGED */}
      {isModalOpen && (
        <div className="harb-program-overlay" onClick={closeModal}>
          <div className="harb-program-modal" onClick={(e) => e.stopPropagation()}>

            <div className="harb-program-modal-head">
              <h2>{selectedPlan}</h2>
              <IoClose className="harb-program-modal-close" onClick={closeModal} />
            </div>

            <p className="harb-program-modal-text">
              You selected <strong>{selectedPlan}</strong>. Choose your product:
            </p>

            <div className="harb-program-modal-list">
              {loading ? (
                <p style={{ textAlign: "center" }}>Loading...</p>
              ) : (
                products.map((item) => (
                  <div
                    key={item._id}
                    className="harb-program-modal-item"
                    onClick={() => router.push(`/Pages/products/${item._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="harb-program-modal-icon">
                      <img
                        src={`${serverURL}/uploads/products/${item.productImages[0]}`}
                        alt={item.productName}
                        style={{ width: 45, height: 45, borderRadius: "8px" }}
                      />
                    </div>

                    <div>
                      <h4>{item.productName}</h4>
                      <p>{item.productSubDescription?.slice(0, 60)}...</p>
                     
                    </div>

                    <span className="harb-program-modal-arrow">→</span>
                  </div>
                ))
              )}
            </div>

            <button className="harb-program-modal-btn" onClick={closeModal}>
              <GiHealing /> Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}