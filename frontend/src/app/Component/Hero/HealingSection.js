import React from "react";
import { FaBrain } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoSparklesOutline } from "react-icons/io5";

import "./HealingSection.css";

const HealingSection = () => {
  return (
    <div className="healing-section-container">
      <p className="healing-section-label">THE HIDDEN GAP</p>

      <h1 className="healing-section-title">
        Why Most People Don't Heal Completely
      </h1>

      <p className="healing-section-subtitle">
        Healing one side without the other creates a cycle that never ends.
      </p>

      {/* Top Cards */}
      <div className="healing-cards-wrapper">
        <div className="healing-card1">
          <div className="healing-card1-header">
            <FaBrain className="healing-icon1 healing-icon-purple" />
            <div>
              <h3 className="healing-card1-title">Only Therapy (Mind)</h3>
              <p className="healing-card1-desc">
                You understand patterns, but biology isn't supported
              </p>
            </div>
          </div>
          <span className="healing-card1-error">
            ✕ Incomplete — you still feel stuck
          </span>
        </div>

        <div className="healing-card1">
          <div className="healing-card1-header">
            <HiOutlineChatBubbleLeftRight className="healing-icon1 healing-icon-green" />
            <div>
              <h3 className="healing-card1-title">
                Only Supplements (Body)
              </h3>
              <p className="healing-card1-desc">
                Energy improves, but behavior stays unchanged
              </p>
            </div>
          </div>
          <span className="healing-card1-error">
            ✕ Incomplete — you fall back again
          </span>
        </div>
      </div>

      {/* Solution Box */}
      <div className="healing-solution-box">
        <p className="healing-solution-title">
          <IoSparklesOutline className="sparkle-icon" />
          THE COMPLETE SOLUTION
          <IoSparklesOutline className="sparkle-icon" />
        </p>

        <div className="healing-solution-content">
          {/* Left */}
          <div className="healing-solution-col">
            <div className="healing-solution-header">
              <FaBrain className="healing-icon1 healing-icon-purple" />
              <h3 className="healing-solution-heading">
                🧠 Internal Healing
              </h3>
            </div>

            <ul className="healing-solution-list">
              <li>Brain nourishment with Ayurvedic formulations</li>
              <li>Gut–mind balance for neurochemical health</li>
              <li>Nervous system support & stress resilience</li>
            </ul>
          </div>

          {/* Right */}
          <div className="healing-solution-col">
            <div className="healing-solution-header">
              <HiOutlineChatBubbleLeftRight className="healing-icon1 healing-icon-green" />
              <h3 className="healing-solution-heading">
                💬 External Healing
              </h3>
            </div>

            <ul className="healing-solution-list">
              <li>Dedicated mind coach assigned to you</li>
              <li>Weekly CBT-based guided sessions</li>
              <li>Emotional & behavioral pattern transformation</li>
            </ul>
          </div>
        </div>

        <p className="healing-solution-quote">
          "True transformation happens when both are done together."
        </p>
      </div>
    </div>
  );
};

export default HealingSection;