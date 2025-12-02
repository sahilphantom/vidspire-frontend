"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, ShieldCheck, Layers, BarChart3, Search, CheckCircle2 } from "lucide-react";
import { Space_Grotesk, Outfit } from "next/font/google";



const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});


const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

// ==========================================
// 1. Mini UI Mockups (CSS Only)
// ==========================================

// Mockup for "Smart Strategy" (List view)
const StrategyMockup = () => (
  <div className="w-full h-40 bg-white dark:bg-black rounded-t-xl border border-gray-200 dark:border-zinc-800 border-b-0 overflow-hidden relative p-4">
    {/* Fake Header */}
    <div className="flex gap-1.5 mb-3">
      <div className="w-2 h-2 rounded-full bg-red-400/50" />
      <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
      <div className="w-2 h-2 rounded-full bg-green-400/50" />
    </div>
    {/* Fake Content Lines */}
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/20" />
        <div className="h-2 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gray-100 dark:bg-zinc-800" />
        <div className="h-2 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gray-100 dark:bg-zinc-800" />
        <div className="h-2 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
    {/* Floating Badge */}
    <div className="absolute bottom-4 right-4 bg-white dark:bg-zinc-800 shadow-lg border border-gray-100 dark:border-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
      <div className="w-2 h-2 bg-[#B02E2B] rounded-full animate-pulse" />
      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Trend Detected</span>
    </div>
  </div>
);

// Mockup for "Data Security" (Shield/Lock view)
const SecurityMockup = () => (
  <div className="w-full h-40 bg-white dark:bg-black rounded-t-xl border border-gray-200 dark:border-zinc-800 border-b-0 overflow-hidden relative flex items-center justify-center">
     {/* Grid Pattern Background */}
    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px]" />
    
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 flex items-center justify-center mb-3">
        <ShieldCheck className="w-6 h-6 text-[#B02E2B]" />
      </div>
      <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full">
        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
        <span className="text-[10px] font-bold text-green-700 dark:text-green-400">Encrypted</span>
      </div>
    </div>
  </div>
);

// Mockup for "Seamless Integration" (Graph/Chart view)
const IntegrationMockup = () => (
  <div className="w-full h-40 bg-white dark:bg-black rounded-t-xl border border-gray-200 dark:border-zinc-800 border-b-0 overflow-hidden relative p-4 flex flex-col justify-end">
    <div className="flex items-end justify-between gap-2 h-24">
      {/* Animated Bars */}
      {[40, 70, 50, 90, 65].map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className={cn(
            "w-full rounded-t-md opacity-80",
            i === 3 ? "bg-[#B02E2B]" : "bg-gray-200 dark:bg-zinc-800"
          )}
        />
      ))}
    </div>
    {/* Floating Tag */}
    <div className="absolute top-4 left-4 flex gap-2">
         <span className="h-1.5 w-12 bg-gray-200 dark:bg-zinc-700 rounded-full"/>
    </div>
  </div>
);

// ==========================================
// 2. Solution Card Component
// ==========================================

interface SolutionCardProps {
  title: string;
  description: string;
  mockup: React.ReactNode;
}

const SolutionCard = ({ title, description, mockup }: SolutionCardProps) => {
  return (
    <div className="flex flex-col bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-[#d6211e]/5 transition-all duration-300 group">
      <div className="p-8 pb-0 flex-1">
        <h3 className="text-lg font-bold text-[#B02E2B] mb-3 group-hover:text-[#B02E2B] transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm mb-8">
          {description}
        </p>
      </div>
      {/* Mockup Area at Bottom */}
      <div className="px-8 w-full mt-auto">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {mockup}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Main Solution Section
// ==========================================

const SolutionSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex ${spaceGrotesk.className} items-center gap-2 px-3 py-1 rounded-full bg-[#d6211e]/10 text-[#B02E2B] text-xs font-bold uppercase tracking-wider mb-4`}>
            Solution
          </div>
          <h2 className={`text-3xl ${spaceGrotesk.className} md:text-5xl font-bold text-gray-900 dark:text-white mb-6`}>
            Empower Your Channel with AI Workflows
          </h2>
          <p className={`text-gray-600 ${outfit.className} dark:text-zinc-400 text-lg leading-relaxed`}>
            Generic tools won't suffice. Our platform is purpose-built to provide
            exceptional AI-driven solutions for your unique growth needs.
          </p>
        </div>

        {/* Grid Layout */}
        <div className={`grid ${outfit.className} grid-cols-1 md:grid-cols-3 gap-8`}>
          
          <SolutionCard
            title="Smart Content Strategy"
            description="Our platform utilizes cutting-edge AI algorithms to analyze market gaps, telling you exactly what topics will perform before you film."
            mockup={<StrategyMockup />}
          />

          <SolutionCard
            title="Secure Data Handling"
            description="We prioritize your channel data security with state-of-the-art encryption, ensuring your exclusive insights and revenue stats remain confidential."
            mockup={<SecurityMockup />}
          />

          <SolutionCard
            title="Seamless Optimization"
            description="Easily integrate our AI solutions into your existing upload workflow. Validate titles, descriptions, and thumbnails in seconds."
            mockup={<IntegrationMockup />}
          />

        </div>
      </div>
    </section>
  );
};

export default SolutionSection;