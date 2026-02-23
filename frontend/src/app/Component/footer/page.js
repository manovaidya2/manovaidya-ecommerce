"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Footer.css";
import Link from "next/link";
import logo from "../../Images/logo.png";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* Brand Section */}
           {/* Brand Section */}
<div className="col-md-4 mb-4 mb-md-0">
  <div className="footer-logo mb-3">
    <Image
      src={logo}
      alt="ManoVaidya Logo"
      width={160}
      height={60}
      priority
      style={{ height: "auto", width: "auto" }}
    />
  </div>

  <p className="footer-tagline">
    Natural Ayurvedic solutions for mental wellness and emotional balance.
  </p>

  <div className="contact-details mt-4">
    <p className="mb-2">
      <i className="bi bi-envelope-fill me-2"></i>
      manovaidya2@gmail.com
    </p>
    <p className="mb-0">
      <i className="bi bi-telephone-fill me-2"></i>
      +91 7823838638
    </p>
  </div>
              {/* Follow Us Section */}
              <h6 className="follow-title mt-4 mb-3">Follow Us</h6>
              <div className="social-icons d-flex gap-2">
                <a 
                  href="https://www.facebook.com/ManovaidyaDrAnkush/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a 
                  href="https://www.youtube.com/@Manovaidya_6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon youtube"
                >
                  <i className="bi bi-youtube"></i>
                </a>
                <a 
                  href="https://www.instagram.com/manovaidya/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>

            {/* Products Section */}
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 className="footer-title">Products</h5>
              <ul className="footer-links">
                <li>
                  <Link href="https://manovaidya.com/Pages/products/681b31b1499082ac943eadec">
                    <i className="bi bi-flower2 me-2"></i>
                    Stress & Anxiety Relief
                  </Link>
                </li>
                <li>
                  <Link href="https://manovaidya.com/Pages/products/681af884b851bfc60591b9dc">
                    <i className="bi bi-moon-stars me-2"></i>
                    Calm & Sleep Aid
                  </Link>
                </li>
                <li>
                  <Link href="https://manovaidya.com/Pages/products/681af7a3b851bfc60591b85f">
                    <i className="bi bi-heart me-2"></i>
                    Desire & Intimacy Enhancer
                  </Link>
                </li>
                <li>
                  <Link href="https://manovaidya.com/Pages/products/681af67cb851bfc60591b6ed">
                    <i className="bi bi-brain me-2"></i>
                    Focus & Brain Power Boost
                  </Link>
                </li>
                <li>
                  <Link href="https://manovaidya.com/Pages/products/681af67cb851bfc60591b6ed">
                    <i className="bi bi-shield-plus me-2"></i>
                    Complete Mental Care
                  </Link>
                </li>
              </ul>

              {/* Resources Section */}
              <h5 className="footer-title mt-4">Resources</h5>
              <ul className="footer-links">
                <li>
                  <Link href="/Pages/mind-health">
                    <i className="bi bi-clipboard2-pulse me-2"></i>
                    Take Assessment
                  </Link>
                </li>
                <li>
                  <Link href="/Pages/clinic">
                    <i className="bi bi-calendar-check me-2"></i>
                    Clinic Consultation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Policies Section */}
            <div className="col-md-4">
              <h5 className="footer-title">Contact</h5>
              <ul className="footer-links">
                <li>
                  <Link href="/contact">
                    <i className="bi bi-envelope me-2"></i>
                    manovaidya2@gmail.com
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <i className="bi bi-telephone me-2"></i>
                    +91 7823838638
                  </Link>
                </li>
              </ul>

              <h5 className="footer-title mt-4">Information</h5>
              <ul className="footer-links">
                <li>
                  <Link href="/Pages/contactUs">
                    <i className="bi bi-headset me-2"></i>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/Pages/blog">
                    <i className="bi bi-journal-text me-2"></i>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/Pages/terms-conditions">
                    <i className="bi bi-file-text me-2"></i>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/Pages/privacy-policy">
                    <i className="bi bi-shield-check me-2"></i>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/Pages/return-and-refund-policy">
                    <i className="bi bi-arrow-return-left me-2"></i>
                    Return/Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust Badges Section */}
          <div className="trust-section">
            <div className="row g-3">
              <div className="col-md-4 col-4">
                <div className="trust-badge">
                  <div className="trust-icon">
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                  <div className="trust-text">
                    <h6>Secure Payment</h6>
                    <p>100% secure transactions</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-4">
                <div className="trust-badge">
                  <div className="trust-icon">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="trust-text">
                    <h6>6L+ Happy Customers</h6>
                    <p>Trusted by thousands</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-4">
                <div className="trust-badge">
                  <div className="trust-icon">
                    <i className="bi bi-arrow-repeat"></i>
                  </div>
                  <div className="trust-text">
                    <h6>Easy Refund</h6>
                    <p>Hassle-free returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Copyright */}
      <div className="bottom-footer">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12 text-center">
              <p className="mb-0">
                © {new Date().getFullYear()} ManoVaidya. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;