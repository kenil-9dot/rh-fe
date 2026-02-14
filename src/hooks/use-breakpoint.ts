"use client";

import { useState, useEffect } from "react";

/** Tailwind xl breakpoint in px */
const XL_BREAKPOINT = 1280;

/**
 * Returns true when viewport width is xl (>= 1280px) or larger.
 */
export function useIsXlScreen(): boolean {
  const [isXl, setIsXl] = useState(false);

  useEffect(() => {
    const check = () => setIsXl(typeof window !== "undefined" && window.innerWidth >= XL_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isXl;
}
