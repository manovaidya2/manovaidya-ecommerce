"use client"; // Important for Next.js 13+ app directory if using client-side interactions
import React from "react";
import "./MindHealthSection.css";

const Page = () => {
  return (
    <section className="mind-health-section">
      {/* Chronic/Severe Symptoms Box */}
      <div className="mind-health-box">
        <div className="mind-health-icon">✨</div>
        <h2>Chronic or Severe Symptoms?</h2>
        <p>
          For chronic conditions, severe symptoms, or multiple mental health
          concerns, consult our expert Ayurvedic practitioners for customized
          medicines.
        </p>
        <button className="mind-health-btn">Book Clinic Consultation</button>
      </div>

      {/* Journey Section */}
      <div className="mind-health-journey">
        <h2>Your journey from chaos to calm starts with your first kit</h2>
        <p>
          You've healed others with your patience — now it's time to heal
          yourself.
        </p>
        <div className="mind-health-journey-buttons">
          <button className="mind-health-btn-primary">
            Take the Mind Health Test
          </button>
          <button className="mind-health-btn-secondary">Buy Now</button>
        </div>
      </div>
    </section>
  );
};

export default Page;
