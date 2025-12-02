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

// Reusable Card Component
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
        "flex flex-col rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative",
        className
      )}
    >
      {/* Visual Area */}
      <div className="h-52 mb-8 relative flex items-center justify-center bg-gray-50 dark:bg-zinc-800/50 rounded-2xl overflow-hidden group-hover:bg-red-50/50 dark:group-hover:bg-red-900/10 transition-colors">
        {visual}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Custom Visual Components for each feature
const CommentAnalysisVisual: React.FC = () => (
  <div className="relative w-4/5 h-4/5 flex flex-col items-center justify-center">
    <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 relative z-10">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-[#B02E2B]" />
        </div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Video Comment Analysis
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Sentiment</span>
          <span className="text-xs font-bold text-[#B02E2B]">Mostly Positive</span>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-gradient-to-r from-[#E55A52] to-[#B02E2B] w-[70%]" />
          <div className="h-full bg-gray-300 dark:bg-zinc-600 w-[10%]" />
          <div className="h-full bg-gray-400 dark:bg-zinc-700 w-[20%]" />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>What they love</span>
          <span>What they hate</span>
        </div>
      </div>
    </div>
    {/* Decorative elements */}
    <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#d6211e]/10 rounded-full blur-xl" />
    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#B02E2B]/10 rounded-full blur-xl" />
  </div>
);

interface TopicItem {
  topic: string;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TopicFinderVisual: React.FC = () => {
  const topics: TopicItem[] = [
    { topic: "AI Productivity Tools", trend: "+240%", icon: TrendingUp },
    { topic: "YouTube Algorithm 2025", trend: "+180%", icon: Activity },
    { topic: "Faceless Channel Ideas", trend: "+120%", icon: Layers },
  ];

  return (
    <div className="relative w-4/5 h-4/5 flex flex-col items-center justify-center">
      <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 relative z-10">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <div className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 rounded-md text-sm text-gray-500 border border-transparent focus:border-[#d6211e]/50 transition-colors">
            Find viral topics...
          </div>
        </div>
        <div className="space-y-2">
          {topics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group/item"
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-400 group-hover/item:text-[#d6211e]" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {item.topic}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#d6211e]">{item.trend}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ChannelBreakdownVisual: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center p-6">
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-20 h-20 bg-gradient-to-br from-[#E55A52] to-[#B02E2B] rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 mb-4">
        <LineChart className="w-10 h-10 text-white" />
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <span className="text-xs text-gray-500 mb-1">Strengths</span>
          <BarChart3 className="w-6 h-6 text-green-500" />
        </div>
        <div className="flex flex-col items-center p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <span className="text-xs text-gray-500 mb-1">Weaknesses</span>
          <PieChart className="w-6 h-6 text-[#d6211e]" />
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,33,30,0.08)_0%,transparent_70%)]" />
  </div>
);

const IdeaValidationVisual: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center p-6">
    <div className="relative z-10 flex flex-col items-center w-full max-w-[200px]">
      <div className="w-full p-3 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-[#d6211e]" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            "My Video Idea..."
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4 w-full">
        <div className="flex-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50 flex flex-col items-center">
          <CheckCircle2 className="w-8 h-8 text-green-500 mb-1" />
          <span className="text-xs font-bold text-green-700 dark:text-green-400">
            Good Idea
          </span>
        </div>
        <div className="flex-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50 flex flex-col items-center opacity-50">
          <XCircle className="w-8 h-8 text-[#d6211e] mb-1" />
          <span className="text-xs font-bold text-[#d6211e] dark:text-red-400">
            Bad Idea
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ComingSoonVisual: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-zinc-700 group-hover:border-[#d6211e] dark:group-hover:border-[#d6211e] transition-colors">
      <Plus className="w-10 h-10 text-gray-400 group-hover:text-[#d6211e] transition-colors" />
    </div>
  </div>
);

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
          {/* Row 1: Two Large Cards (Top Left & Top Right) */}
          <FeatureCard
            title="AI Comment Analysis"
            visual={<Image src="/assets/ai-comment.png" alt="AI Comment Analysis" width={400} height={400} className="w-full h-full object-center object-contain p-2" />}
            description="Understand Your Audience Like Never Before
Your comments aren’t noise - they’re data gold.
Our AI breaks down every comment to reveal what viewers love, hate, share, and beg for next.
Spot emotions, trends, hidden pain points, and viral triggers instantly.
Turn casual viewers into superfans by giving them exactly what they want."
            className="lg:col-span-3"
            delay={0.1}
          />
          <FeatureCard
            title="Topic Finder"
            description="Discover High-Potential, Low-Competition Ideas
Never run out of viral topics again.
Analyze keywords, trends, search volume, and competition in seconds.
Find untapped opportunities before your competitors even see them."
            visual={<TopicFinderVisual />}
            className="lg:col-span-3"
            delay={0.2}
          />

          {/* Row 2: Three Smaller Cards (Bottom Row) */}
          <FeatureCard
            title="Channel Breakdown"
            description="Get an automated, consultant-grade audit of any channel. Understand strengths, weaknesses, and what content formats truly resonate in your niche."
            visual={<ChannelBreakdownVisual />}
            className="lg:col-span-2"
            delay={0.3}
          />
          <FeatureCard
            title="Idea Validation"
            description="Stop Wasting Time on Videos That Won’t Perform
Before scripting or recording, check if your video idea has real potential.
Our AI instantly tests:
Competition
Demand
Virality signs
Viewer interest
Ranking chances
Green light ideas that can grow your channel.
Red light the ones that would flop."
            visual={<IdeaValidationVisual />}
            className="lg:col-span-2"
            delay={0.4}
          />
          {/* Placeholder for 5th slot to maintain layout balance */}
          <FeatureCard
            title="More Tools Coming Soon"
            description="We’re building more creator-focused AI tools to help you grow faster, create smarter, and rank higher.
Stay tuned for powerful updates"
            visual={<ComingSoonVisual />}
            className="lg:col-span-2 group"
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;