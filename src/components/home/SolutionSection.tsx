"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  Search, 
  CheckCircle2, 
  ScanEye,      // New for Espionage
  BrainCircuit, // New for Audits
  Target,       // New for Blue Ocean
  TrendingUp,
  Lock
} from "lucide-react";
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
// 1. Mini UI Mockups (Visualizing the specific features)
// ==========================================

// Mockup for "Competitor Espionage" (X-Ray/Scan effect)
const EspionageMockup = () => (
  <div className="w-full h-40 bg-white dark:bg-black rounded-t-xl border border-gray-200 dark:border-zinc-800 border-b-0 overflow-hidden relative p-4 flex flex-col items-center justify-center">
    {/* Abstract Video Frame */}
    <div className="relative w-4/5 h-24 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden group">
        {/* Scanning Line Animation */}
        <motion.div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B02E2B] to-transparent opacity-50 z-20"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Fake Content Elements inside the video */}
        <div className="p-3 space-y-2 opacity-50">
            <div className="flex gap-2">
                <div className="h-2 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded-sm"/>
                <div className="h-2 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded-sm"/>
            </div>
             <div className="h-16 w-full bg-gray-100 dark:bg-zinc-800/50 rounded-md flex items-center justify-center relative">
                 <div className="absolute inset-0 border border-[#B02E2B]/20 rounded-md" />
                 <ScanEye className="w-5 h-5 text-[#B02E2B]/60" />
             </div>
        </div>

        {/* Pop-up Insights */}
        <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="absolute bottom-2 right-2 bg-[#B02E2B] text-white text-[8px] font-bold px-2 py-1 rounded shadow-lg z-30"
        >
            Hook Detected
        </motion.div>
    </div>
  </div>
);

// Mockup for "Pre-Production Audits" (Simulation/Score Card)
const AuditMockup = () => (
    <div className="w-full h-40 bg-white dark:bg-black rounded-t-xl border border-gray-200 dark:border-zinc-800 border-b-0 overflow-hidden relative p-4 flex items-center justify-center">
         <div className="relative z-10 w-full max-w-[220px] space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>AI Simulation</span>
                </div>
                <span className="text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600 px-1.5 py-0.5 rounded">Pass</span>
            </div>
            
            {/* The Bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                    <span>Viral Probability</span>
                    <span>94%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-orange-400 to-[#B02E2B]"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "94%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-2 gap-2">
                <div className="h-6 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded flex items-center px-2 gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <div className="h-1 w-8 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
                 <div className="h-6 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded flex items-center px-2 gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <div className="h-1 w-10 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
            </div>
         </div>
    </div>
);

// Mockup for "Blue Ocean Engine" (Visualizing Outliers)
const BlueOceanMockup = () => (
     <div className="w-full h-40 bg-white dark:bg-black rounded-t-xl border border-gray-200 dark:border-zinc-800 border-b-0 overflow-hidden relative p-4 flex flex-col justify-end">
        {/* Chart Container */}
        <div className="flex items-end justify-between gap-1.5 h-28 px-2">
             {/* The Crowd (Low Competition/Average Views) */}
             {[25, 35, 30, 20, 40].map((h, i) => (
                 <motion.div 
                    key={i}
                    className="w-full bg-gray-100 dark:bg-zinc-900 rounded-t-sm"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                 />
             ))}
             
             {/* The Outlier (High Views/Low Competition) */}
             <motion.div 
                className="w-full bg-[#B02E2B] rounded-t-md relative group shadow-[0_0_15px_rgba(176,46,43,0.3)]"
                initial={{ height: 0 }}
                whileInView={{ height: "85%" }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
             >
                {/* Floating Tooltip */}
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: -10 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] font-bold px-2 py-1 rounded whitespace-nowrap z-10"
                 >
                    Gap Found
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                 </motion.div>
             </motion.div>

             {/* More Crowd */}
             {[35, 25].map((h, i) => (
                 <motion.div 
                    key={`end-${i}`}
                    className="w-full bg-gray-100 dark:bg-zinc-900 rounded-t-sm"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.4, delay: 0.5 + (i * 0.05) }}
                 />
             ))}
        </div>
        
        {/* Axis Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100 dark:bg-zinc-800" />
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
          <div className={`inline-flex ${spaceGrotesk.className} items-center gap-2 px-3 py-1 rounded-full  text-[#B02E2B] text-xs font-bold uppercase tracking-wider mb-4`}>
            Solution
          </div>
          <h2 className={`text-3xl ${spaceGrotesk.className} md:text-5xl font-bold text-gray-900 dark:text-white mb-6`}>
           The Intelligence Agency for Your Channel
          </h2>
          <p className={`text-gray-600 ${outfit.className} dark:text-zinc-400 text-lg leading-relaxed`}>
           We don't just show you analytics. We spy on your competitors, audit your risks, and hand you a roadmap to domination.
          </p>
        </div>

        {/* Grid Layout */}
        <div className={`grid ${outfit.className} grid-cols-1 md:grid-cols-3 gap-8`}>
          
          <SolutionCard
            title="Competitor Espionage"
            description="Stop wondering why they went viral. We X-ray their top performing videos to show you exactly what topics, pacing, and hooks stolen the audience's attention—so you can take it back."
            mockup={<EspionageMockup />}
          />

          <SolutionCard
            title="Pre-Production Audits"
            description="Never waste time on a flop again. Our AI simulates how your video idea will perform against 10,000+ real viewer comments before you even write the script."
            mockup={<AuditMockup />}
          />

          <SolutionCard
            title={'The "Blue Ocean" Engine'}
            description='We identify the "Viral Outliers"—the specific video topics getting millions of views with low competition—so you can swoop in and own the keyword.'
            mockup={<BlueOceanMockup />}
          />

        </div>
      </div>
    </section>
  );
};

export default SolutionSection;