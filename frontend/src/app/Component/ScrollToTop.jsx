"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // smooth hataana ho to remove kar sakte ho
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
