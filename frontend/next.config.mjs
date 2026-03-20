/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",

              // ✅ Razorpay scripts (ALL required)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com https://connect.facebook.net https://snap.licdn.com https://checkout.razorpay.com https://cdn.razorpay.com",

              // ✅ Styles
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",

              // ✅ Images
              "img-src 'self' data: https: blob:",

              // ✅ Fonts
              "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",

              // ✅ Razorpay APIs + tracking
              "connect-src 'self' https://api.manovaidya.com https://checkout.razorpay.com https://lumberjack.razorpay.com https://api.razorpay.com",

              // ✅ Razorpay popup (VERY IMPORTANT)
              "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://www.youtube.com https://www.googletagmanager.com",

              "object-src 'none'",
              "base-uri 'self'",

              // ✅ payment submit allow
              "form-action 'self' https://checkout.razorpay.com",

              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // ✅ Image optimization
  images: {
    domains: ["api.manovaidya.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.manovaidya.com",
      },
    ],
  },
};

export default nextConfig;