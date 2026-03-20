import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import "./ChooseKit.css";

const ChooseKit = () => {
  return (
    <section className="kit-exp-section">
      <div className="kit-exp-container">
        
        <h2 className="kit-exp-title">
          Choose This Kit If You Experience
        </h2>

        <p className="kit-exp-subtitle">
          This program is specifically designed for people dealing with:
        </p>

        <div className="kit-exp-grid">
          
          <div className="kit-exp-item">
            <FiCheckCircle className="kit-exp-icon" />
            <span>Persistent anxiety</span>
          </div>

          <div className="kit-exp-item">
            <FiCheckCircle className="kit-exp-icon" />
            <span>Daily stress</span>
          </div>

          <div className="kit-exp-item">
            <FiCheckCircle className="kit-exp-icon" />
            <span>Mood swings</span>
          </div>

          <div className="kit-exp-item">
            <FiCheckCircle className="kit-exp-icon" />
            <span>Panic attacks</span>
          </div>

          <div className="kit-exp-item">
            <FiCheckCircle className="kit-exp-icon" />
            <span>Overthinking</span>
          </div>

          <div className="kit-exp-item">
            <FiCheckCircle className="kit-exp-icon" />
            <span>Restlessness</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ChooseKit;