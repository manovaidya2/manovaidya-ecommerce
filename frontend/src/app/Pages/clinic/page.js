"use client";

import React, { useState } from "react";
import "./ConsultationSection.css";
import { FaCalendarAlt, FaVideo, FaAward, FaClock } from "react-icons/fa";
import Link from "next/link";
import { postData } from "@/app/services/FetchNodeServices";


const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form submission handler
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const data = {
    fullName: e.target.fullName.value,
    phoneNumber: e.target.phoneNumber.value,
    email: e.target.email.value,
    age: e.target.age.value,
    primaryConcern: e.target.primaryConcern.value,
    description: e.target.description.value,
  };

  try {
    const result = await postData("api/consultations/book", data);

    if (result?.success) {
      alert("Consultation booked successfully!");
      setShowModal(false);
      e.target.reset();
    } else {
      alert("Failed to book consultation");
    }
  } catch (err) {
    alert("Server error");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title1">Consult Our Ayurvedic Experts</h1>
          <p className="hero-subtitle">
            Get personalized guidance for chronic conditions, severe symptoms, or complex
            mental health concerns from certified Ayurvedic practitioners.
          </p>
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={() => setShowModal(true)}>
              Book Your Consultation
            </button>
            <Link href="/Pages/products">
              <button className="hero-btn secondary">View Product Kits</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="consultation-section">
        <div className="container">
          <h3 className="consultation-heading">When Should You Consult?</h3>
          <div className="consultation-cards">
            <div className="consultation-card">
              <h4>Consultation Recommended</h4>
              <ul>
                <li>Chronic mental health conditions (6+ months)</li>
                <li>Severe symptoms affecting daily life</li>
                <li>Multiple overlapping mental health concerns</li>
                <li>Previous treatments haven't worked</li>
                <li>Need personalized treatment plan</li>
              </ul>
            </div>
            <div className="consultation-card">
              <h4>Products Are Great For</h4>
              <ul>
                <li>Building mental resilience</li>
                <li>Managing daily stress</li>
                <li>Mild to moderate symptoms</li>
                <li>Improving sleep quality</li>
                <li>Enhancing mental clarity and focus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="howitworks-section">
        <div className="container">
          <h2 className="howitworks-title">How It Works</h2>
          <div className="howitworks-cards">
            <div className="howitworks-card">
              <div className="icon-circle"><FaCalendarAlt /></div>
              <h3>1. Book Appointment</h3>
              <p>Choose a convenient time slot for your consultation</p>
            </div>
            <div className="howitworks-card">
              <div className="icon-circle"><FaVideo /></div>
              <h3>2. Video Consultation</h3>
              <p>Meet with our expert practitioner online</p>
            </div>
            <div className="howitworks-card">
              <div className="icon-circle"><FaAward /></div>
              <h3>3. Get Treatment Plan</h3>
              <p>Receive personalized Ayurvedic treatment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Details */}
      <section className="cd-section">
        <div className="cd-card">
          <h2 className="cd-title">Consultation Details</h2>
          <div className="cd-item">
            <div className="cd-icon"><FaClock /></div>
            <div>
              <h3>Duration</h3>
              <p>45–60 minutes comprehensive consultation</p>
            </div>
          </div>
          <div className="cd-item">
            <div className="cd-icon"><FaVideo /></div>
            <div>
              <h3>Format</h3>
              <p>Secure video consultation from your home</p>
            </div>
          </div>
          <div className="cd-item">
            <div className="cd-icon"><FaAward /></div>
            <div>
              <h3>What You'll Receive</h3>
              <ul>
                <li>Detailed health assessment</li>
                <li>Personalized treatment plan</li>
                <li>Custom herbal formulations</li>
                <li>Lifestyle recommendations</li>
                <li>Follow-up support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-ready-section">
        <div className="cta-ready-box">
          <h2 className="cta-ready-title">Ready to Get Started?</h2>
          <p className="cta-ready-desc">
            Book your consultation now or explore our product kits
          </p>
          <div className="cta-ready-actions">
            <button className="cta-ready-btn primary" onClick={() => setShowModal(true)}>
              Book Consultation
            </button>
            <Link href="/Pages/products">
              <button className="cta-ready-btn secondary">View Product Kits</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Book Your Consultation</h2>

            <form className="consultation-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="fullName" required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phoneNumber" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" name="age" />
                </div>
                <div className="form-group">
                  <label>Primary Concern</label>
                  <select name="primaryConcern" required>
                    <option value="">Select</option>
                    <option>Anxiety</option>
                    <option>Stress</option>
                    <option>Depression</option>
                    <option>Sleep Issues</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Describe Your Issue</label>
                  <textarea rows="3" name="description"></textarea>
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Booking..." : "Submit & Book Consultation"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
