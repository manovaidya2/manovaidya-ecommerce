"use client";

import "./globals.css";
import Header from "../app/Component/header/page";
import Footer from "../app/Component/footer/page";
import Script from "next/script";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Aos from "aos";
import ReduxProvider from "./Component/reduxProvider/ReduxProvider";
import ScrollToTop from "./Component/ScrollToTop";

export default function RootLayout({ children }) {
  useEffect(() => {
    Aos.init({ duration: 400, once: false, easing: "ease-in-out" });
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ✅ SEO */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />

        {/* ✅ Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* ✅ Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />

        {/* ✅ Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
        />

        {/* ================= TRACKING SCRIPTS DISABLED ================= */}
        {/* SECURITY NOTE: Invalid tracking IDs have been removed to prevent VPS blocking */}
        {/* To enable tracking, replace with valid IDs from your accounts:
            - Google Tag Manager: Get ID from https://tagmanager.google.com
            - Facebook Pixel: Get ID from https://business.facebook.com/events_manager
            - LinkedIn Insight: Get ID from https://www.linkedin.com/campaignmanager
        */}
        
        {/* Uncomment and add valid GTM ID when ready
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','YOUR-GTM-ID-HERE');
          `}
        </Script>
        */}
      </head>

      <body>
        {/* GTM fallback - Disabled until valid ID is configured */}

        <ReduxProvider>
           <ScrollToTop />
          <Header />
          {children}
          <Footer />
        </ReduxProvider>

        {/* ✅ Bootstrap JS */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
