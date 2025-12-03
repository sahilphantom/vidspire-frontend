"use client";
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap"; // Ensure you have gsap installed
import HeroGeometric from "../HeroGeometry";
import { Space_Grotesk, Outfit } from "next/font/google";
import { HoverBorderGradient } from "../ui/hover-border-gradient";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space", // This defines the CSS variable name
  display: "swap",
});

// 3. Configure Outfit
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit", // This defines the CSS variable name
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
    <section ref={comp} className="relative w-full bg-transparent pt-32  overflow-hidden min-h-screen flex items-center">
      
      {/* Background Geometry */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">

        <HeroGeometric />
      </div>

    <div className="max-w-6xl mx-auto px-6 bg-transparent text-center relative z-10 w-full">
        
        {/* Interactive Gradient Badge */}
        <div ref={badgeRef} className="mb-6 invisible flex justify-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            // Ensure badge text is dark compatible
            className="bg-white border-[#B02E2B] border-1 dark:bg-black text-black dark:text-white flex items-center space-x-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#B02E2B] inline-block mr-2" />
            <span className={`text-xs font-medium ${outfit.className} `}>Announcement Introducing Vidly</span>
          </HoverBorderGradient>
        </div>

        {/* Main Headline */}
        <div ref={titleRef} className="invisible">
            {/* Added dark:text-white to h1 */}
            <h1 className={`text-5xl  md:text-7xl font-medium ${spaceGrotesk.className}  font-heading tracking-tight leading-tight text-gray-900 dark:text-white`}>
           Your unfair advantage on YouTube, Creator-Grade

            <br />
            {" "}
            <span className="relative inline-block">
  {/* Main Text with Gradient */}
  <span className="relative z-10 bg-linear-to-r from-[#E55A52] via-[#C83E3A] to-[#B02E2B] bg-clip-text text-transparent font-semibold text-6xl tracking-tight">
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
        {/* Added dark:text-gray-300 */}
        <p ref={subheadRef} className={`invisible mt-6 ${outfit.className} text-base md:text-lg text-gray-800 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed`}>
        Your audience is telling you exactly what they want to watch next. You just can't see it yet. Use AI to extract questions, demands, and hidden viral opportunities from the noise.
          <br />
          {/* Analyze audience sentiment, validate video ideas, and understand your viewers like never before — instantly. */}

        </p>

        {/* CTA Button */}
        <div ref={ctaRef} className="invisible mt-10">
          <a
            href="/signup"
            className={`inline-block ${outfit.className}  bg-linear-to-r from-[#B02E2B] via-[#B02E2B] to-[#B02E2B] text-white px-8 py-3 rounded-full font-bold text-sm `}
          >
            Start for free
          </a>
        </div>

        {/* Dashboard Preview */}
        
          <img src="/assets/advanced1.jpg" alt="Vidspire Dashboard" className="rounded shadow-lg  w-full h-full mt-20 object-cover" />
       
      </div>
    </section>
  );
}