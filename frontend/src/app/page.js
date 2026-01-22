import React from "react";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "../app/Component/Slider/page";
import Hero from "../app/Component/Hero/page";
import Newslater from "../app/Component/newslater/page"
import ProductSlider from "./Component/productSlider/page";
import CommunitySection from "./Component/CommunitySection/Page";
import ReviewSection from "./Pages/review/page";
import MindHealthSection from "./Component/MindHealthSection/Page";
const page = () => {
  return (
    <>
      <Slider />
      <Hero title="home" />
      <ProductSlider />
      <CommunitySection />
      <ReviewSection />
      <MindHealthSection />
      <Newslater />
    </>
  );
};

export default page;
