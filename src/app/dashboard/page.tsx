"use client";

import {
  MessageSquare,
  Search,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Brain,
  Zap,
  Eye,
  Sparkles,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Space_Grotesk, Outfit } from "next/font/google";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UsageStatistics } from "@/src/components/UsageStatistics";
import { WelcomeHero } from "@/src/components/WelcomeHero";

// ✅ ANIMATION VARIANTS
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// ✅ SKELETON LOADER COMPONENT
const SkeletonCard = () => (
  <div className="rounded-xl border overflow-hidden bg-[#0a0a0a] border-neutral-800 animate-pulse">
    <div className="relative w-full aspect-video bg-neutral-900" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-neutral-800 rounded w-3/4" />
      <div className="h-3 bg-neutral-800 rounded w-1/2" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-8 bg-neutral-800 rounded" />
        <div className="h-8 bg-neutral-800 rounded" />
      </div>
    </div>
  </div>
);

// Recent Analyses Component with Animations
function RecentAnalysesSection() {
  const [recentJobs, setRecentJobs] = useState<
    Array<{
      videoUrl: string,
      videoId: string,
      jobId: string,
      createdAt: number,
      status?: "pending" | "processing" | "completed" | "failed",
      isLoading?: boolean,
    }>
  >([]);
  const [showAll, setShowAll] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const getHistory = () => {
      try {
        const data = localStorage.getItem("yt_analyzer_history");
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    };

    const history: {
      videoUrl: string;
      videoId: string;
      jobId: string;
      createdAt: number;
    }[] = getHistory();
    
    if (history.length === 0) {
      setIsInitialLoading(false);
      return;
    }

    setRecentJobs(history.map((job) => ({ ...job, isLoading: true })));

    // Fetch status for each job
    Promise.all(
      history.map(async (job) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/video/status/${job.jobId}`,
          );
          const data = await response.json();

          return {
            ...job,
            status: data.success ? data.status : "failed",
            isLoading: false,
          };
        } catch (error) {
          return { ...job, status: "failed" as const, isLoading: false };
        }
      })
    ).then((updatedJobs) => {
      setRecentJobs(updatedJobs);
      setIsInitialLoading(false);
    });
  }, []);

  if (isInitialLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-300">
            Recent Analyses
          </h2>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (recentJobs.length === 0) return null;

  const displayedJobs = showAll ? recentJobs : recentJobs.slice(0, 6);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (job: (typeof recentJobs)[0]) => {
    if (job.isLoading) {
      return (
        <Badge className="bg-neutral-800 text-neutral-400 text-[10px] h-5 font-mono">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Checking...
        </Badge>
      );
    }

    switch (job.status) {
      case "completed":
        return (
          <Badge className="bg-green-900/30 text-green-400 border border-green-500/20 text-[10px] h-5 font-mono">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-900/30 text-yellow-400 border border-yellow-500/20 text-[10px] h-5 font-mono">
            Processing
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-900/30 text-red-400 border border-red-500/20 text-[10px] h-5 font-mono">
            Failed
          </Badge>
        );
    }
  };

  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-300">
          Recent Analyses
        </h2>
        {recentJobs.length > 6 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-[#B02E2B] hover:text-[#d6211e] transition-colors font-medium"
          >
            {showAll ? "Show Less" : `See All (${recentJobs.length})`}
          </motion.button>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {displayedJobs.map((job, index) => {
          const isCompleted = job.status === "completed" && !job.isLoading;
          const CardContent = (
            <motion.div
              variants={itemVariants}
              whileHover={isCompleted ? "hover" : "rest"}
              className={`
                group rounded-xl border overflow-hidden transition-all duration-200
                ${
                  isCompleted
                    ? "bg-[#0f0f0f] border-[#B02E2B]/30 hover:border-[#B02E2B] hover:shadow-lg hover:shadow-[#B02E2B]/10 cursor-pointer"
                    : "bg-[#0a0a0a] border-neutral-800 opacity-60 cursor-not-allowed"
                }
              `}
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
                <img
                  src={getThumbnailUrl(job.videoId)}
                  alt="Video thumbnail"
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isCompleted ? "group-hover:scale-105" : ""
                  }`}
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='360' fill='%23171717'%3E%3Crect width='480' height='360' fill='%23171717'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%23525252'%3ENo Thumbnail%3C/text%3E%3C/svg%3E";
                  }}
                />
                
                {/* Status Badge Overlay */}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(job)}
                </div>

               
                {/* Completed Overlay Icon */}
                {isCompleted && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-[#B02E2B] rounded-full p-3">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-4 space-y-3">
                {/* URL */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
                    Video URL
                  </p>
                  <p
                    className={`text-xs font-mono truncate ${
                      isCompleted
                        ? "text-neutral-300 group-hover:text-white"
                        : "text-neutral-600"
                    }`}
                  >
                    {job.videoUrl}
                  </p>
                </div>

                {/* Job ID and Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
                      Job ID
                    </p>
                    <p className="text-xs font-mono text-neutral-400 truncate">
                      {job.jobId.substring(0, 8)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
                      Created
                    </p>
                    <p className="text-xs font-mono text-neutral-400">
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );

          return isCompleted ? (
            <Link
              key={job.jobId}
              href={`/dashboard/comment-analyzer?jobId=${job.jobId}`}
            >
              {CardContent}
            </Link>
          ) : (
            <div key={job.jobId}>{CardContent}</div>
          );
        })}
      </div>

      {/* Show More Button (Mobile-friendly alternative) */}
      {recentJobs.length > 6 && !showAll && (
        <div className="mt-4 text-center lg:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(true)}
            className="text-sm text-[#B02E2B] hover:text-[#d6211e] transition-colors font-medium"
          >
            Load More ({recentJobs.length - 6} more)
          </motion.button>
        </div>
      )}
    </motion.section>
  );
}

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

const toolCards = [
  {
    title: "Audience Mind-Reader",
    description:
      "Extract hidden content demands and pain points from viewer comments.",
    icon: Brain,
    href: "/dashboard/comment-analyzer",
    darkClass:
      "bg-[#180505] border-[#B02E2B] hover:border-[#B02E2B]/50 text-red-100",
    iconColor: "text-[#B02E2B]",
  },
  {
    title: "Advanced Viral Search",
    description:
      "Filter by 'Views Per Subscriber' to find small channels pulling massive numbers.",
    icon: TrendingUp,
    href: "/dashboard/viral-search",
    darkClass:
      "bg-[#180505] border-[#B02E2B] hover:border-[#B02E2B]/50 text-red-100",
    iconColor: "text-[#B02E2B]",
  },
  {
    title: "Video Idea Validator",
    description:
      "Simulate your video's performance against historical data before you film.",
    icon: Zap,
    href: "/dashboard/idea-validator",
    darkClass:
      "bg-[#180505] border-[#B02E2B] hover:border-[#B02E2B]/50 text-red-100",
    iconColor: "text-[#B02E2B]",
  },
];

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`max-w-7xl ${outfit.className} space-y-10 mx-auto pb-10`}
    >
      {/* Quick Access Cards */}
      <section>
        <motion.h2
          variants={itemVariants}
          className="text-sm font-semibold text-neutral-300 mb-4"
        >

<WelcomeHero />

          Quick Access
        </motion.h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {toolCards.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={tool.href} className="block h-full">
                  <Card
                    className={`bg-gradient-to-br ${tool.darkClass} border h-full cursor-pointer transition-all duration-200`}
                  >
                    <CardHeader>
                      <motion.div
                        className="flex items-center"
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                      </motion.div>
                      <CardTitle className="text-sm font-semibold text-white mt-2">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="mt-3 flex items-center text-xs text-neutral-500 group-hover:text-white transition-colors">
                        Open <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <UsageStatistics />

      {/* Recent Analyses */}
      <RecentAnalysesSection />
    
      {/* Coming Soon Section */}
      <motion.section variants={itemVariants}>
        <h2 className="text-sm font-bold text-neutral-200 mb-4">
          Future Arsenal
        </h2>
        <Card className="bg-[#080808] border-neutral-800">
          <CardContent className="p-6">
            <p className="text-sm mb-6 text-neutral-400">
              We are building the ultimate unfair advantage. Stay tuned!
            </p>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {[
                "Deep Analysis",
                "Shorts Analyzer",
                "Agent Ethan (AI Manager)",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="h-12 rounded-md border border-neutral-800 bg-[#0f0f0f] flex items-center px-4 justify-between opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-400">{item}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-neutral-800 text-neutral-500 text-[10px] h-5"
                  >
                    Soon
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}