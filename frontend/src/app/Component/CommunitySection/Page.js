"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./CommunitySection.css";
import bgImage from "../../Images/comunity.jpg";

const Page = () => {
  const features = [
    {
      title: "Weekly Check-ins",
      desc: "WhatsApp support from Mind Coaches",
    },
    {
      title: "Group Sessions",
      desc: "Monthly community meditation & sharing",
    },
    {
      title: "Doctor Access",
      desc: "Expert guidance when you need it",
    },
  ];

  return (
    <section
  className="community-section"
  style={{ backgroundImage: `url(${bgImage.src})` }}
>
  <div className="overlay">
    <div className="container">
      <h2 className="community-title">The Manovaidya Community</h2>
      <p className="community-subtitle">
        You're not alone — you'll be guided by our Mind Coaches, Doctors, and Community every week.
      </p>

      <div className="community-grid">
        {features.map((item, index) => (
          <div className="community-card" key={index}>
            <FaCheckCircle className="check-icon" />
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      <button className="join-btn">Join the Circle</button>
    </div>
  </div>
</section>

  );
};

export default Page;
