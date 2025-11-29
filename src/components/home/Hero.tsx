"use client";
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap"; // Ensure you have gsap installed
import HeroGeometric from "../HeroGeometry";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import ColorBends from "../color-bends";

export default function Hero() {
  const comp = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subheadRef = useRef(null);
  const ctaRef = useRef(null);
  const dashRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, {
        y: -20,
        autoAlpha: 0, // This removes the 'invisible' class automatically
        duration: 0.8,
      })
      .from(titleRef.current, {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
      }, "-=0.4")
      .from(subheadRef.current, {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
      }, "-=0.6")
      .from(ctaRef.current, {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
      }, "-=0.6")
      .from(dashRef.current, {
        y: 50,
        autoAlpha: 0,
        duration: 1,
      }, "-=0.6");

    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={comp} className="relative w-full bg-transparent pt-32 pb-16 overflow-hidden min-h-screen flex items-center">
      
      {/* Background Geometry */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
       {/* <ColorBends
  colors={["#d6211e"]}
   rotation={30}
  
/> */}

        <HeroGeometric />
      </div>

    <div className="max-w-6xl mx-auto px-6 text-center relative z-10 w-full">
        
        {/* Interactive Gradient Badge */}
        <div ref={badgeRef} className="mb-6 invisible flex justify-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            // Ensure badge text is dark compatible
            className="bg-white dark:bg-black text-black dark:text-white flex items-center space-x-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E55A52] inline-block mr-2" />
            <span className="text-xs font-medium">v2.0 - Updated integrations</span>
          </HoverBorderGradient>
        </div>

        {/* Main Headline */}
        <div ref={titleRef} className="invisible">
            {/* Added dark:text-white to h1 */}
            <h1 className="text-5xl md:text-7xl font-medium font-heading tracking-tight leading-tight text-gray-900 dark:text-white">
            Your ultimate solution 
            <br />
            {" "}
            <span className="relative inline-block">
  {/* Main Text with Gradient */}
  <span className="relative z-10 bg-gradient-to-r from-[#E55A52] via-[#C83E3A] to-[#B02E2B] bg-clip-text text-transparent font-semibold text-6xl tracking-tight">
    Advanced
  </span>
  
  {/* The Curved Underline (SVG) with Matching Gradient */}
  <svg 
    className="absolute -bottom-2 left-0 w-full h-4" 
    viewBox="0 0 200 15" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E55A52" />
        <stop offset="50%" stopColor="#C83E3A" />
        <stop offset="100%" stopColor="#B02E2B" />
      </linearGradient>
    </defs>
    
    <path 
      d="M2 12 Q 100 2 198 12" 
      stroke="url(#gradient-line)" 
      strokeWidth="4" 
      strokeLinecap="round"
    />
  </svg>
</span>
            </h1>
        </div>

        {/* Subheadline */}
        {/* Added dark:text-gray-300 */}
        <p ref={subheadRef} className="invisible mt-6 text-base md:text-lg text-gray-800 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Revolutionize product management. Boost productivity effortlessly.
          <br />
          Take control and elevate your workflow with us.
        </p>

        {/* CTA Button */}
        <div ref={ctaRef} className="invisible mt-10">
          <a
            href="/signup"
            className="inline-block bg-[#d6211e] text-white px-8 py-3 rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-red-500/20"
          >
            Start for free
          </a>
        </div>

        {/* Dashboard Preview */}
        <div ref={dashRef} className="invisible mt-20 rounded-lg border border-gray-200 bg-white shadow-2xl p-2">
          <img src="/assets/advanced.jpg" alt="Vidspire Dashboard" className="rounded w-full" />
        </div>
      </div>
    </section>
  );
}