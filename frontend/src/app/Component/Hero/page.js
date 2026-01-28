"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import "./hero.css";
import Link from "next/link";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import Slider from "react-slick";
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { FiUsers, FiSmile, FiMoon, FiTrendingUp } from "react-icons/fi";
import {
  RiLeafLine,
  RiBookOpenLine,
  RiRouteLine,
  RiChatSmile2Line,
} from "react-icons/ri";
import img from "../../Images/kit.webp";



// ⚠️ Fix: Declare the HTML parser once (otherwise it may cause errors in render loop)
const htmlParser = new Parser();

const Page = ({ title }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [diseases, setDiseases] = useState([]);

  const fetchAllDisease = async () => {
    try {
      const response = await getData('api/subcategories/get-all-sub-diseases');
      if (response?.success === true) {
        // alert("fetchAllDisease")
        const activeDiseases = response?.subcategories?.filter(item => item?.isActive);
        setDiseases(activeDiseases);
      } else {
        // toast.error("Failed to load sub diseases server error");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching sub diseases");
    }
  };

  const fetchProduct = async () => {
    try {
      const data = await getData('api/products/all-product');
      if (data?.success === true) {
        // alert("fetchProduct")
        const activeProducts = data?.products?.filter(p => p?.wellnessKits === true);
        setProducts(activeProducts || []);
      } else {
        // toast.error("Failed to load products");
      }
    } catch (error) {
      console.error(error);
      // toast.error("An error occurred while fetching products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getData('api/categories/get-All-category');
      console.log("XXXXXXXXXXX:--X:--", response)
      if (response?.success === true) {
        // alert("fetchCategories")
        const activeCategories = response?.categories?.filter(c => c?.isActive);
        setCategories(activeCategories);
      } else {
        // toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error loading categories");
    }
  };

  useEffect(() => {
    fetchAllDisease();
    fetchCategories();
    fetchProduct();
  }, []);

  const CustomNextArrow = ({ onClick }) => (
    <div className="custom-slider-arrow custom-next-arrow" onClick={onClick}>
      <i className="bi bi-arrow-right"></i>
    </div>
  );

  const CustomPrevArrow = ({ onClick }) => (
    <div className="custom-slider-arrow custom-prev-arrow" onClick={onClick}>
      <i className="bi bi-arrow-left"></i>
    </div>
  );

  const settings = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      }
    ],
  };

const StatItem = ({ icon: Icon, value, label, suffix = "" }) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          animateCount();
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [started]);

  const animateCount = () => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * value);
      setCount(current);

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  return (
    <div className="stat-item" ref={ref}>
      <Icon className="stat-icon" />
      <h3>
        {count.toLocaleString()}
        {suffix}
      </h3>
      <p>{label}</p>
    </div>
  );
};
  return (
    <>
      {/* Sidebar Buttons */}
      <section className="sidebutton">
        <a href="/"><i className="bi bi-arrow-up-circle"></i></a>
      </section>

      <section className="sidewhatsapp">
        <a target="_blank" href="https://wa.me/+917823838638" rel="noopener noreferrer">
          <i className="bi bi-whatsapp"></i>
        </a>
      </section>
{/* 
      <section className="sidecall">
        <a href="tel:+917823838638">
          <i className="bi bi-telephone"></i>
        </a>
      </section> */}
{/* 
      <section className="sideInstagram">
        <a href="https://www.instagram.com/manovaidya/?next=%2F" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-instagram"></i>
        </a>
      </section> */}

      {/* Category Slider
      <section className="top-cards-slider">
        <h2 className="text-center" style={{ fontWeight: '700', color: 'var(--purple)', marginBottom: '1rem', marginTop: '1rem' }}>
          Explore Our Treatments by Health Condition
        </h2>
        <div className="container-fluid" style={{ overflow: 'hidden' }}>
          {categories?.length > 0 && <Slider {...settings}>
            {categories?.map((card, index) => (
              <div className="card-slide" key={index}>
                <Link className="text-decoration-none" href={`/Pages/product-tips/${card?._id}`}>
                  <div className="card-main">
                    <img
                      src={`${serverURL}/uploads/categorys/${card?.image}`}
                      alt={card?.categoryName}
                      className="card-image"
                      width={300}
                      height={200}
                    />
                    <p className="disease-responsive" style={{ color: 'black', fontWeight: '600' }}>{card?.categoryName}</p>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
          }

        </div>
      </section> */}
<section className="stats-section">
      <div className="stats-container">
        <StatItem
          icon={FiUsers}
          value={12000}
          suffix="+"
          label="Calm Builders"
        />

        <StatItem
          icon={FiSmile}
          value={95}
          suffix="%"
          label="Improved Calm"
        />

        <StatItem
          icon={FiMoon}
          value={80}
          suffix="%"
          label="Better Sleep in 21 Days"
        />

        <StatItem
          icon={FiTrendingUp}
          value={90}
          suffix="%"
          label="Emotionally Balanced"
        />
      </div>
    </section>
    <section className="guided-section">
      <div className="guided-overlay" />

      <div className="guided-container">
        {/* Badge */}
        <span className="guided-badge">The Manovaidya Experience</span>

        {/* Heading */}
        <h2 className="guided-title">
          A Guided Path to Lasting Mental Balance
        </h2>

        {/* Subtitle */}
        <p className="guided-subtitle">
          Every kit is more than medicines — it’s a 3-phase healing journey.
        </p>

        {/* Cards */}
        <div className="guided-cards">
          {/* Card 1 */}
          <div className="guided-card">
            <div className="step-circle purple">1</div>
            <h3>Reset</h3>
            <span className="days">Days 1–21</span>
            <p className="small">Cleanse, Calm, Observe</p>
            <p className="desc">
              Detox the body, calm the mind. Natural herbs work to reset your
              nervous system.
            </p>
          </div>

          {/* Card 2 (Highlighted) */}
          <div className="guided-card active">
            <div className="step-circle yellow">2</div>
            <h3>Rewire</h3>
            <span className="days">Days 22–45</span>
            <p className="small">Build Resilience</p>
            <p className="desc">
              Reprogram your stress & energy cycles. Adaptogens strengthen your
              mental foundation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="guided-card">
            <div className="step-circle purple">3</div>
            <h3>Reclaim</h3>
            <span className="days">Days 46–90</span>
            <p className="small">Thrive Freely</p>
            <p className="desc">
              Feel light, focused & emotionally stable. Experience lasting
              transformation.
            </p>
          </div>
        </div>

        {/* CTA */}
      <Link href="/Pages/products" className="guided-btn">
  Start Your 3-Phase Journey <span>→</span>
</Link>
      </div>
    </section>




      {/* Products Section */}
     {/* <section className="ayurved-product">
  <div className="container">
    <h2 className="text-center text-purple">Ayurvedic Wellness Tablet</h2>
    {products?.length > 0 && <div className="row custom-grid">
      {products?.map((kit, index) => (
        <div className="col-md-6 col-6 col-lg-4" key={index}>
          <Link className="pruduct-link-all" href={`/Pages/products/${kit?._id}`}>
            <div className="product-card">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <img
                    src={`${serverURL}/uploads/products/${kit?.productImages?.[0]}`}
                    alt={kit?.title}
                    className="card-img-top"
                    width={200}
                    height={200}
                    style={{ cursor: "pointer", borderRadius: '14px 14px 0px 0px' }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="product-card-details">
                    <h5>{kit?.productName}</h5>
                    <span className="descrip">
                      {kit?.productDescription ? htmlParser.parse(kit?.productDescription) : ""}
                    </span>
                    <div className="detail-sec">
                      <p className="off-price m-0">
                        {/* <b style={{ fontSize: "14px" }}>
                          {kit?.variant?.[0]?.discountPrice} % off
                        </b> */}
                      {/* </p>
                      <span className="final-price">
                        ₹ {kit?.variant?.[0]?.finalPrice}
                      </span>
                      <p className="del-mrp">
                        MRP: <del>₹ {kit?.variant?.[0]?.price}</del>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>}
  </div>
</section> */} 

 <section className="mindkit-section">
      <div className="mindkit-container">

        {/* Left */}
        <div className="mindkit-left">
          <h2>What’s Inside Your Mind Kit</h2>
          <p className="subtitle">
            Because healing your mind needs a system — not a single pill.
          </p>

          <div className="mindkit-image">
  <Image
    src={img}
    alt="Mind Kit"
 
    priority
  />
</div>

        </div>

        {/* Right */}
        <div className="mindkit-right">

        <div className="kit-card">
  <RiLeafLine className="kit-icon" />
  <div>
    <h4>Ayurvedic Medicines</h4>
    <p className="small">3-bottle synergy for mind + gut + energy</p>
    <p className="desc">Nourishes neurons & restores calm naturally</p>
  </div>
</div>

<div className="kit-card active">
  <RiBookOpenLine className="kit-icon" />
  <div>
    <h4>Mind Journal</h4>
    <p className="small">21-day reflection tool (printed + digital)</p>
    <p className="desc">Builds awareness & emotional regulation</p>
  </div>
</div>

<div className="kit-card">
  <RiRouteLine className="kit-icon" />
  <div>
    <h4>Lifestyle Map</h4>
    <p className="small">Yoga, diet & meditation QR plan</p>
    <p className="desc">Aligns body rhythm & mental flow</p>
  </div>
</div>

<div className="kit-card">
  <RiChatSmile2Line className="kit-icon" />
  <div>
    <h4>Mind Coach Support</h4>
    <p className="small">Orientation, tracker & coaching calls</p>
    <p className="desc">
      Guided sessions with expert Mind Coaches throughout your journey
    </p>
  </div>
</div>

        </div>
      </div>

    <div className="mindkit-btn-wrapper">
  <button className="mindkit-btn">See How It Works</button>
</div>

    </section>
      {/* <Link href="/Pages/consultationCustomizedSolution" style={{ textDecoration: 'none' }}>
  <section className="product-overview-bg" style={{ cursor: 'pointer' }}>
    {/* You can add your background image through CSS using .product-overview-bg */}
  {/* </section>
</Link> */} 

      {/* Diseases Section
      <section className="MentalHealthCards">
        <div className="container">
          <div className="row justify-content-center">
            {diseases?.length > 0 && diseases?.map((item, index) => (
              <div className="col-lg-2 col-md-4 col-6 health_cards_main" key={index}>
                <Link href={{ pathname: `/Pages/products`, query: { id: item?._id, title: 'subDiseas' } }}>
                  <div data-aos="zoom-in-down" className="Mental-card-main shadow-lg">
                    <img
                      src={`${serverURL}/uploads/subcategorys/${item?.image}`}
                      alt={item?.name}
                      className="health-card-image"
                      width={100}
                      height={100}
                    />
                    <div className="card-content">
                      <p>{item?.name}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </>
  );
};

export default Page;
