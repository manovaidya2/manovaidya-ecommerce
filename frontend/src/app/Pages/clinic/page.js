import React from "react";
import "./ConsultationSection.css";
import { FaCalendarAlt, FaVideo, FaAward } from "react-icons/fa";
import { FaClock} from "react-icons/fa";

const Page = () => {
  return (
    <>
      {/* Consultation Section */}
      <section className="consultation-section">
        <div className="container">
          <h2 className="consultation-title">Consult Our Ayurvedic Experts</h2>
          <p className="consultation-subtitle">
            Get personalized guidance for chronic conditions, severe symptoms, or complex
            mental health concerns from certified Ayurvedic practitioners.
          </p>
          <button className="consultation-btn">Book Your Consultation</button>

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

      {/* How It Works Section */}
      <section className="howitworks-section">
        <div className="container">
          <h2 className="howitworks-title">How It Works</h2>

          <div className="howitworks-cards">
            <div className="howitworks-card">
              <div className="icon-circle">
                <FaCalendarAlt className="howitworks-icon" />
              </div>
              <h3>1. Book Appointment</h3>
              <p>Choose a convenient time slot for your consultation</p>
            </div>

            <div className="howitworks-card">
              <div className="icon-circle">
                <FaVideo className="howitworks-icon" />
              </div>
              <h3>2. Video Consultation</h3>
              <p>Meet with our expert practitioner online</p>
            </div>

            <div className="howitworks-card">
              <div className="icon-circle">
                <FaAward className="howitworks-icon" />
              </div>
              <h3>3. Get Treatment Plan</h3>
              <p>Receive personalized Ayurvedic treatment</p>
            </div>
          </div>
        </div>
      </section>

     <section className="cd-section">
      <div className="cd-card">
        <h2 className="cd-title">Consultation Details</h2>

        <div className="cd-item">
          <div className="cd-icon">
            <FaClock />
          </div>
          <div>
            <h3>Duration</h3>
            <p>45-60 minutes comprehensive consultation</p>
          </div>
        </div>

        <div className="cd-item">
          <div className="cd-icon">
            <FaVideo />
          </div>
          <div>
            <h3>Format</h3>
            <p>Secure video consultation from the comfort of your home</p>
          </div>
        </div>

        <div className="cd-item">
          <div className="cd-icon">
            <FaAward />
          </div>
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
        <section className="cta-ready-section">
      <div className="cta-ready-box">
        <h2 className="cta-ready-title">Ready to Get Started?</h2>

        <p className="cta-ready-desc">
          Book your consultation now or explore our product kits for self-care
          solutions
        </p>

        <div className="cta-ready-actions">
          <button className="cta-ready-btn primary">
            Book Consultation
          </button>
          <button className="cta-ready-btn secondary">
            View Product Kits
          </button>
        </div>
      </div>
    </section>
    </>
  );
};

export default Page;
