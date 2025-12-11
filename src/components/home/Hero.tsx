"use client";
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap"; 
import HeroGeometric from "../HeroGeometry";
import { Space_Grotesk, Outfit } from "next/font/google";
import { HoverBorderGradient } from "../ui/hover-border-gradient";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

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
        autoAlpha: 0,
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
    <section ref={comp} className="relative w-full bg-transparent pt-32 overflow-hidden min-h-screen flex items-center flex-col">
      
      {/* Background Geometry */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <HeroGeometric />
      </div>

      <div className="max-w-6xl mx-auto px-6 bg-transparent text-center relative z-10 w-full">
        
        {/* Interactive Gradient Badge */}
        <div ref={badgeRef} className="mb-6 invisible flex justify-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            className="bg-white border-[#B02E2B] border-1 dark:bg-black text-black dark:text-white flex items-center space-x-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B02E2B] inline-block mr-2" />
            <span className={`text-xs font-medium ${outfit.className} `}>Announcement Introducing Vidly</span>
          </HoverBorderGradient>
        </div>

        {/* Main Headline */}
        <div ref={titleRef} className="invisible">
            <h1 className={`text-5xl md:text-7xl font-medium ${spaceGrotesk.className} font-heading tracking-tight leading-tight text-gray-900 dark:text-white`}>
           Your unfair advantage on YouTube, Creator-Grade
            <br />
            {" "}
            <span className="relative inline-block">
              {/* Main Text with Gradient */}
              <span className="relative z-10 bg-gradient-to-r from-[#E55A52] via-[#C83E3A] to-[#B02E2B] bg-clip-text text-transparent font-semibold text-6xl tracking-tight">
                Intelligence
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
        <p ref={subheadRef} className={`invisible mt-6 ${outfit.className} text-base md:text-lg text-gray-800 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed`}>
          Your audience is telling you exactly what they want to watch next. You just can't see it yet. Use AI to extract questions, demands, and hidden viral opportunities from the noise.
        </p>

        {/* CTA Button */}
        <div ref={ctaRef} className="invisible mt-10">
          <a
            href="/dashboard"
            rel="noopener noreferrer"
            className={`inline-block ${outfit.className} bg-gradient-to-r from-[#B02E2B] via-[#B02E2B] to-[#B02E2B] text-white px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(176,46,43,0.5)] hover:shadow-[0_0_25px_rgba(176,46,43,0.7)] transition-all`}
          >
            Start for free
          </a>
        </div>

      </div>

      {/* Advanced Dashboard Mockup Container - MOVED OUTSIDE MAX-W-6XL for Full Width Impact */}
      <div ref={dashRef} className="mt-20 invisible relative w-full max-w-[1400px] px-4 md:px-8 mx-auto perspective-1000 pb-20">
        
        {/* Main Container with Glassmorphism and Border */}
        <div className="relative rounded-xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] overflow-hidden">
          
          {/* Browser/App Window Header */}
          <div className="h-10 bg-white/80 dark:bg-neutral-900/80 border-b border-white/20 dark:border-white/10 flex items-center px-4 space-x-2 z-20 relative">
              {/* Window Controls */}
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              {/* Address Bar Mockup */}
              <div className="flex-1 flex justify-center px-4 md:px-20">
                <div className="w-full max-w-sm h-6 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center text-[10px] text-neutral-400 font-mono">
                    vidly.ai/dashboard
                </div>
              </div>
          </div>

          {/* Image Container - FULL HEIGHT */}
          <div className="relative w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden group">
              {/* UPDATED: 
                  - Removed aspect ratio 
                  - Changed object-cover to w-full h-auto 
                  - This ensures the FULL image is shown from top to bottom 
              */}
              <img 
                src="/assets/dashboard.png" 
                alt="Vidspire Dashboard" 
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.01]" 
              />
              
              {/* Optional: Glossy Overlay/Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>

        </div>
        
        {/* Glow behind the dashboard */}
        <div className="absolute top-10 left-10 right-10 bottom-0 bg-gradient-to-r from-[#B02E2B] to-[#B02E2B] rounded-xl blur-[100px] opacity-20 -z-10"></div>
      </div>
       
    </section>
  );
}