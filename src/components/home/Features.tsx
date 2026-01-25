"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  MessageSquare,
  Search,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Lightbulb,
  LineChart,
  PieChart,
  Activity,
  Layers,
  Plus,
  Filter,      // New for Advanced Search
  Eye,         // New for Advanced Search
  AlertTriangle, // New for Risk Audit
  Cpu,         // New for Ethan/Future
  Sparkles     // New for Ethan/Future
} from "lucide-react";
import Image from "next/image";
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

// Reusable Card Component (Unchanged structure, updated for visuals)
interface FeatureCardProps {
  title: string;
  description: string;
  visual: React.ReactNode;
  className?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  visual,
  className,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={cn(
        "flex flex-col rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group",
        className
      )}
    >
      {/* Visual Area */}
      <div className="h-52 mb-8 relative flex items-center justify-center bg-gray-50 dark:bg-zinc-900/30 rounded-2xl overflow-hidden group-hover:bg-red-50/50 dark:group-hover:bg-red-900/10 transition-colors border border-gray-100 dark:border-zinc-800">
        {visual}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold text-[#B02E2B] mb-3 group-hover:text-[#d6211e] transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// ==========================================
// 1. Viral Gap Detector Visual (TopicFinderVisual)
// ==========================================
// Concept: Shows a "Demand" bar vs "Supply" bar gap.

const TopicFinderVisual: React.FC = () => {
  return (
    <div className="relative w-4/5 h-4/5 flex flex-col items-center justify-center p-4">
      {/* Search Input Fake */}
      <div className="w-full h-8 bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-md mb-4 flex items-center px-3 shadow-sm">
         <Search className="w-3 h-3 text-gray-400 mr-2" />
         <div className="h-2 w-24 bg-gray-100 dark:bg-zinc-800 rounded-sm" />
      </div>

      {/* Gap Visualizer */}
      <div className="w-full space-y-3">
         {/* Item 1: The Opportunity */}
         <div className="bg-white dark:bg-black p-3 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
             <div className="flex justify-between text-[10px] text-gray-500 mb-1.5 font-medium">
                 <span>"AI Productivity"</span>
                 <span className="text-[#B02E2B]">Viral Gap: High</span>
             </div>
             {/* Demand Bar (High) */}
             <div className="flex items-center gap-2 text-[8px] text-gray-400 mb-1">
                 <span className="w-8">Demand</span>
                 <div className="h-1.5 flex-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <motion.div 
                        className="h-full bg-green-500" 
                        initial={{ width: 0 }}
                        whileInView={{ width: "95%" }}
                        transition={{ duration: 1, delay: 0.2 }}
                     />
                 </div>
             </div>
             {/* Supply Bar (Low) */}
             <div className="flex items-center gap-2 text-[8px] text-gray-400">
                 <span className="w-8">Supply</span>
                 <div className="h-1.5 flex-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <motion.div 
                        className="h-full bg-[#B02E2B]" 
                        initial={{ width: 0 }}
                        whileInView={{ width: "15%" }}
                        transition={{ duration: 1, delay: 0.4 }}
                     />
                 </div>
             </div>
             {/* Highlight Badge */}
             <div className="absolute top-0 right-0 p-1">
                 <div className="w-1.5 h-1.5 bg-[#B02E2B] rounded-full animate-pulse" />
             </div>
         </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Advanced Viral Search Visual (AdvancedSearchVisual)
// ==========================================
// Concept: Shows sliders filtering for "Views > Subs" outlier logic.

const AdvancedSearchVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
       <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm p-4 relative z-10">
           {/* Header */}
           <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-white">
                   <Filter className="w-3 h-3 text-[#B02E2B]" />
                   Viral Filters
               </div>
           </div>
           
           {/* Sliders */}
           <div className="space-y-3">
               {/* Filter 1 */}
               <div className="space-y-1">
                   <div className="flex justify-between text-[9px] text-gray-500 uppercase tracking-wider font-semibold">
                       <span>Views Per Sub</span>
                       <span className="text-[#B02E2B]">High (&gt;10x)</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full relative">
                       <div className="absolute left-0 top-0 h-full w-[80%] bg-[#B02E2B] rounded-full opacity-20" />
                       <motion.div 
                          className="absolute h-2.5 w-2.5 bg-[#B02E2B] rounded-full top-1/2 -translate-y-1/2 shadow-sm"
                          initial={{ left: "10%" }}
                          whileInView={{ left: "80%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                       />
                   </div>
               </div>
               
               {/* Result Card Pop-up */}
               <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-3 bg-gray-50 dark:bg-zinc-900 rounded p-2 flex gap-2 items-center border border-gray-100 dark:border-zinc-800"
               >
                   <div className="w-6 h-6 bg-gray-200 dark:bg-zinc-700 rounded-full flex-shrink-0" />
                   <div className="flex-1 space-y-1">
                       <div className="h-1.5 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded-full" />
                       <div className="flex gap-1">
                           <div className="h-1 w-1/4 bg-green-500/50 rounded-full" /> 
                           <span className="text-[6px] text-green-600 font-bold">1.2M Views (2k Subs)</span>
                       </div>
                   </div>
               </motion.div>
           </div>
       </div>
    </div>
  );
};

// ==========================================
// 3. Pre-Production Risk Audit Visual (RiskAuditVisual)
// ==========================================
// Concept: Traffic Light System (Red/Green) scanning a script.

const RiskAuditVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
       {/* Scanner Container */}
       <div className="w-32 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-zinc-800 shadow-lg p-1 relative overflow-hidden">
           {/* Simulated Screen Content */}
           <div className="bg-gray-50 dark:bg-zinc-900 h-24 rounded-lg p-2 space-y-1.5 flex flex-col items-center justify-center relative">
                {/* Traffic Light Animation */}
                <div className="flex gap-2 mb-2">
                     <motion.div 
                        className="w-3 h-3 rounded-full bg-red-200 dark:bg-red-900/50"
                        animate={{ backgroundColor: ["#fecaca", "#ef4444", "#fecaca"] }} // Flash Red
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }} // Start flashing
                     />
                     <div className="w-3 h-3 rounded-full bg-yellow-200 dark:bg-yellow-900/20" />
                     <motion.div 
                        className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                        initial={{ opacity: 0.2 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 0.2 }} // Turn Green after scan
                     />
                </div>

                {/* Status Text */}
                <div className="text-center">
                    <motion.div 
                        className="text-[10px] text-gray-400 font-medium"
                        initial={{ opacity: 1, display: "block" }}
                        whileInView={{ opacity: 0, display: "none" }}
                        transition={{ delay: 1.8 }}
                    >
                        Scanning Risks...
                    </motion.div>
                    <motion.div 
                        className="text-xs font-bold text-green-600 dark:text-green-400 hidden"
                        initial={{ opacity: 0, display: "none" }}
                        whileInView={{ opacity: 1, display: "block" }}
                        transition={{ delay: 2 }}
                    >
                        GOAL: VIRAL
                    </motion.div>
                </div>
           </div>
           
           {/* Scanning Line */}
           <motion.div 
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B02E2B] to-transparent opacity-50"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
           />
       </div>
    </div>
  );
};

// ==========================================
// 4. Future Arsenal (Ethan) Visual (FutureArsenalVisual)
// ==========================================
// Concept: A futuristic "AI Core" or Agent interface.

const FutureArsenalVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* Central AI Node */}
        <div className="relative">
            {/* Pulsing Rings */}
            <motion.div 
                className="absolute inset-0 bg-[#B02E2B]/20 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center relative z-10 shadow-lg">
                <Cpu className="w-8 h-8 text-[#B02E2B]" />
                
                {/* Orbital Dot */}
                <motion.div 
                    className="absolute w-full h-full rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                >
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full absolute -top-1 left-1/2 -translate-x-1/2" />
                </motion.div>
            </div>
            
            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white dark:bg-black px-2 py-0.5 rounded border border-gray-100 dark:border-zinc-800">
                Agent Ethan
            </div>
        </div>
        
        {/* Floating Icons (Satellites) */}
        <motion.div 
            className="absolute top-4 right-10"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
             <Sparkles className="w-4 h-4 text-yellow-400 opacity-60" />
        </motion.div>
    </div>
  );
};

// ==========================================
// Main Component
// ==========================================

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-black transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex ${spaceGrotesk.className} items-center gap-2 px-3 py-1 rounded-full  text-[#d6211e] text-sm font-medium mb-4`}>
            FEATURES
          </div>
          <h2 className={`text-4xl  ${spaceGrotesk.className} md:text-5xl font-bold font-heading text-gray-900 dark:text-white tracking-tight mb-6`}>
            Powerful tools to <span className="bg-gradient-to-r  from-[#E55A52] to-[#B02E2B] bg-clip-text text-transparent">
               dominate your niche.
            </span>
          </h2>
          <p className={`text-lg  ${outfit.className} text-gray-600 dark:text-gray-400`}>
            Stop guessing. Start growing. Our AI-powered suite gives you the
            insights you need to create content that actually performs.
          </p>
        </div>

        {/* Grid Layout */}
        <div className={`grid grid-cols-1 ${outfit.className} md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8`}>
          {/* Row 1: Two Large Cards */}
          <FeatureCard
            title="Audience Mind-Reader"
            visual={<Image src="/assets/ai-comment.png" alt="AI Comment Analysis" width={400} height={400} className="w-full h-full object-center object-contain p-2" />}
            description="Stop reading comments one by one. Our AI mines thousands of viewer interactions to extract 'Missing Topics' (what they want you to make) and 'Pain Points' (why they clicked off). It turns your comment section into an unlimited video idea generator."
            className="lg:col-span-3"
            delay={0.1}
          />
          <FeatureCard
            title="The Viral Gap Detector"
            description={`Don't just find "keywords." Find Supply vs. Demand gaps. We identify high-volume search terms that have very few quality videos, handing you the easiest path to rank #1 on Search.`}
            visual={<TopicFinderVisual />}
            className="lg:col-span-3"
            delay={0.2}
          />

          {/* Row 2: Three Smaller Cards */}
          <FeatureCard
            title="Advanced Viral Search"
            description={`YouTube’s default search hides the gold. Use our exclusive filters like "Views Per Subscriber" to uncover small channels getting massive views. Find the exact video formats the algorithm is boosting right now and copy their success.`}
            visual={<AdvancedSearchVisual />}
            className="lg:col-span-2"
            delay={0.3}
          />
          <FeatureCard
            title="Pre-Production Risk Audit"
            description="Validate your video before you film. We test your idea against historical performance data and audience sentiment. Get a Green Light (High Viral Potential) or Red Light (Flop Warning) instantly."
            visual={<RiskAuditVisual />}
            className="lg:col-span-2"
            delay={0.4}
          />
          <FeatureCard
            title="Meet Ethan & The Future Arsenal"
            description={`We are building the ultimate unfair advantage. Coming soon: Deep Analysis, Shorts Analyzer, and introducing "Ethan"—your personal AI agent who autonomously manages your channel strategy 24/7.`}
            visual={<FutureArsenalVisual />}
            className="lg:col-span-2 group hover:border-[#B02E2B]/30"
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;