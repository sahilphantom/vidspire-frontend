"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// FAQ Data
interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is VideSpire used for?",
    answer:
      "VideSpire is an AI-powered platform designed to help YouTube creators grow their channels. It analyzes comments, finds trending topics, validates video ideas, and provides deep channel analytics to help you make data-driven decisions.",
  },
  {
    question: "Can I upload as many contacts as I want?",
    answer:
      "While VideSpire focuses on YouTube channel growth and video analysis, our upcoming features may include tools for managing community interactions. Please check our pricing page for specific limits related to current features.",
  },
  {
    question: "What is a credit?",
    answer:
      "Credits are used to perform AI analyses on our platform, such as deep comment analysis or video idea validation. Different actions consume different amounts of credits. You can view your credit usage in your dashboard.",
  },
  {
    question: "Is my data secure with VideSpire?",
    answer:
      "Yes, we take data security very seriously. We use industry-standard encryption and security protocols to protect your account information and any data you analyze through our platform. We do not share your data with third parties.",
  },
  {
    question: "How do I start using VideSpire?",
    answer:
      "Getting started is easy! Simply sign up for a free account, connect your YouTube channel (optional, but recommended for personalized insights), and start exploring our features like the Topic Finder or Idea Validation tool.",
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
        isOpen && "border-[#d6211e] dark:border-[#d6211e] bg-gray-50 dark:bg-zinc-900/80 shadow-[0_0_15px_rgba(214,33,30,0.1)]"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d6211e]/10 border border-[#d6211e]/20 text-[#d6211e] text-sm font-medium mb-6 w-fit">
              <span>FAQ</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
              Get all your questions answered here
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-zinc-400 mb-10">
              Have a question about VideSpire? We're here to help. Check out the most frequently asked questions below.
            </p>
            
            {/* Glowing CTA Button */}
            <div>
              <a
                href="/signup"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Gradient Background */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#E55A52] via-[#d6211e] to-[#B02E2B] group-hover:scale-105 transition-transform duration-300"></span>
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
          <div className="lg:col-span-7 flex flex-col gap-4">
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