"use client";
import React, { useEffect, useState } from "react";
import "./hero.css";
import Link from "next/link";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
// import Slider from "react-slick";
import { toast } from 'react-toastify';
import dynamic from "next/dynamic";
import { Autoplay } from 'swiper/modules';
// import 'swiper/css';



// ⚠️ Fix: Declare the HTML parser once (otherwise it may cause errors in render loop)
const htmlParser = new Parser();
// ✅ Dynamic Import for Swiper (Mobile Slider, SSR safe)
const Swiper = dynamic(
  () => import("swiper/react").then(mod => mod.Swiper),
  { ssr: false }
);
const SwiperSlide = dynamic(
  () => import("swiper/react").then(mod => mod.SwiperSlide),
  { ssr: false }
);

// ✅ Optional: Dynamic Import for react-slick Slider (Desktop Slider)
const Slider = dynamic(() => import("react-slick"), { ssr: false });
import 'swiper/css';

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

<section className="top-cards-section">
  <h2
    className="text-center"
    style={{
      fontWeight: '700',
      color: 'var(--purple)',
      marginBottom: '1rem',
      marginTop: '1.5rem',
    }}
  >
    {/* Explore Our Categories */}
  </h2>

  {/* Desktop View */}
  <div className="container d-none d-md-block">
    <div className="row justify-content-center">
      {/* Static Cards */}
      {[
        {
          href: "/Pages/consultationCustomizedSolution",
          img: "/Clinic Consulation (2).png",
          label: "CLINIC CONSULTATION",
        },
        {
          href: "/Pages/category_customer_review",
          img: "/Patient Review.png",
          label: "PATIENT STORIES & REVIEWS",
        },
      ].map((card, i) => (
        <div className="col-6 col-md-3 col-lg-2 text-center desktop-gap" key={i}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
            <Link href={card.href} style={{ textDecoration: 'none' }}>
              <img
                src={card.img}
                alt={card.label}
                className="img-fluid"
                style={{ borderRadius: '24px', width: '100%', height: 'auto', cursor: 'pointer' }}
              />
            </Link>
          </div>
          <p style={{ marginTop: '0.75rem', fontWeight: '600', color: '#000' }}>
            {card.label}
          </p>
        </div>
      ))}

      {/* Dynamic Cards */}
      {categories?.map((card, index) => (
        <div className="col-6 col-md-3 col-lg-2 text-center desktop-gap" key={index}>
          <Link href={`/Pages/product-tips/${card._id}`} style={{ textDecoration: 'none' }}>
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
              <img
                src={`${serverURL}/uploads/categorys/${card.image}`}
                alt={card.categoryName}
                className="img-fluid"
                style={{ borderRadius: '24px', width: '100%', height: 'auto', cursor: 'pointer' }}
              />
            </div>
            <p style={{ marginTop: '0.75rem', fontWeight: '600', color: '#000' }}>
              {card.categoryName}
            </p>
          </Link>
        </div>
      ))}
    </div>
  </div>

  {/* Mobile View */}
  <div className="d-block d-md-none" style={{ margin: '0 1rem' }}>
    <Swiper
      modules={[Autoplay]}
      spaceBetween={10}
      slidesPerView={3}
      loop={true}
      grabCursor={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
    >
      {/* Static Cards */}
      {[
        {
          href: "/Pages/consultationCustomizedSolution",
          img: "/Clinic Consulation (2).png",
          label: "CLINIC CONSULTATION",
        },
        {
          href: "/Pages/category_customer_review",
          img: "/Patient Review.png",
          label: "PATIENT STORIES & REVIEWS",
        },
      ].map((card, i) => (
        <SwiperSlide key={i}>
          <div className="text-center">
            <Link href={card.href} style={{ textDecoration: 'none' }}>
              <img
                src={card.img}
                className="img-fluid"
                style={{ borderRadius: '24px', cursor: 'pointer' }}
                alt={card.label}
              />
              <p style={{ marginTop: '0.75rem', fontWeight: '500', color: '#000' }}>
                {card.label}
              </p>
            </Link>
          </div>
        </SwiperSlide>
      ))}

      {/* Dynamic Cards */}
      {categories?.map((card, index) => (
        <SwiperSlide key={index}>
          <div className="text-center">
            <Link href={`/Pages/product-tips/${card._id}`} style={{ textDecoration: 'none' }}>
              <img
                src={`${serverURL}/uploads/categorys/${card.image}`}
                alt={card.categoryName}
                className="img-fluid"
                style={{ borderRadius: '24px', cursor: 'pointer' }}
              />
              <p style={{ marginTop: '0.75rem', fontWeight: '500', color: '#000' }}>
                {card.categoryName}
              </p>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>


      {/* Products Section */}
     <section className="ayurved-product">
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
                      </p>
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
</section>


      <Link href="/Pages/consultationCustomizedSolution" style={{ textDecoration: 'none' }}>
  <section className="product-overview-bg" style={{ cursor: 'pointer' }}>
    {/* You can add your background image through CSS using .product-overview-bg */}
  </section>
</Link>

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
