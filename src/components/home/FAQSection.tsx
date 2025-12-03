"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

// FAQ Data
interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "I have 0 subscribers. Will this work for me?",
    answer:
      "Yes. In fact, you need it more than big channels. You can't afford to waste 10 uploads guessing. Use our Viral Outlier Hunter to find the specific video format that is mathematically proven to work for small channels in your niche.",
  },
  {
    question: "Is this just another wrapper for ChatGPT?",
    answer:
      "No. ChatGPT guesses. We use live YouTube API data to analyze thousands of real comments, view counts, and retention graphs in real-time. We give you facts, not hallucinations.",
  },
  {
    question: "Is my channel data safe?",
    answer:
      "Absolutely. We use the official YouTube API and bank-grade encryption. We analyze public data (trends, competitor views) to give you an edge, while keeping your private revenue stats 100% confidential.",
  },
  {
    question: "Do I need any technical knowledge?",
    answer:
      "Nope. The platform is built for creators, not engineers. If you can upload a video to YouTube, you can use this — it’s that simple.",
  },
  {
    question: "Do I need to link my YouTube channel?",
    answer:
      "No. We believe in zero-risk intelligence. Vidly analyzes public data—competitor videos, comment sections, and global trends. You get all the insights without giving us (or anyone else) access to your private channel dashboard.",
  },
];

// Individual FAQ Accordion Item
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300 overflow-hidden",
        // LIGHT MODE: bg-white, border-gray-200
        // DARK MODE: bg-zinc-900/50, border-zinc-800
        "bg-white border-gray-200 dark:bg-zinc-900/50 dark:border-zinc-800",
        
        // Hover state
        "hover:border-[#d6211e]/50 dark:hover:border-[#d6211e]/50",
        
        // Active (open) state styles
        isOpen && "border-[#B02E2B] dark:border-[#B02E2B] bg-gray-50 dark:bg-zinc-900/80 shadow-[0_0_15px_rgba(214,33,30,0.1)]"
      )}
    >
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full p-5 text-left group"
      >
        <h3
          className={cn(
            "text-lg font-medium transition-colors",
            // Text Color Logic
            isOpen 
              ? "text-gray-900 dark:text-white" 
              : "text-gray-600 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-white"
          )}
        >
          {question}
        </h3>
        <ChevronDown
          className={cn(
            "w-5 h-5 transition-transform duration-300",
            isOpen 
              ? "transform rotate-180 text-[#d6211e]" 
              : "text-gray-400 dark:text-zinc-500 group-hover:text-[#d6211e]"
          )}
        />
      </button>

      {/* Smooth Expansion Animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-gray-600 dark:text-zinc-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main FAQ Section Component
const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const handleItemClick = (index: number): void => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    // Section Background: White (Light) -> Black (Dark)
    <section className=" py-20 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
      
      {/* Subtle Background Glow Effect */}
      {/* <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-[#d6211e] opacity-[0.05] dark:opacity-[0.08] blur-[150px] rounded-full pointer-events-none" /> */}

      <div className="container mx-auto px-3 md:px-12 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className={`inline-flex ${spaceGrotesk.className} items-center gap-2 px-3 py-1 rounded-full   text-[#B02E2B] text-sm font-medium mb-6 w-fit`}>
              <span>FAQ</span>
            </div>
            
            <h2 className={`text-4xl ${spaceGrotesk.className} md:text-5xl font-bold font-heading text-gray-900 dark:text-white tracking-tight mb-6 leading-tight`}>
             No Fluff. Just Strategy.
            </h2>
            
            <p className={`text-lg ${outfit.className}} text-gray-600 dark:text-zinc-400 mb-10`}>
              Everything you need to know before you stop guessing and start dominating.
            </p>
            
            {/* Glowing CTA Button */}
            <div>
              <a
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Gradient Background */}
                <span className={`absolute ${outfit.className} inset-0 w-full h-full bg-gradient-to-r from-[#B02E2B] via-[#B02E2B] to-[#B02E2B] group-hover:scale-105 transition-transform duration-300`}></span>
                {/* Button Text & Icon */}
                <span className="relative flex items-center gap-2">
                  Start for Free Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className={`lg:col-span-7 ${outfit.className} flex flex-col gap-4`}>
            {faqData.map((item, index) => (
              <FAQItemComponent
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => handleItemClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;