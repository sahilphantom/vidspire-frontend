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
  Clock,
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
      ease: [0.23, 1, 0.32, 1] as const,
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
};

// ✅ SKELETON LOADER COMPONENT
const SkeletonCard = () => (
  <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg overflow-hidden animate-pulse">
    <div className="relative aspect-video bg-[#171717]" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-[#171717] rounded w-3/4" />
      <div className="h-3 bg-[#171717] rounded w-1/2" />
    </div>
  </div>
);

// Recent Analyses Component with Animations
function RecentAnalysesSection() {
  const [recentJobs, setRecentJobs] = useState<
    Array<{
      videoUrl: string;
      videoId: string;
      jobId: string;
      createdAt: number;
      status?: "pending" | "processing" | "completed" | "failed";
      isLoading?: boolean;
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
    const fetchStatuses = async () => {
      const promises = history.map(async (job) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/video/status/${job.jobId}`,
          );
          const data = await response.json();

          if (data.success) {
            return { jobId: job.jobId, status: data.status, isLoading: false };
          } else {
            return {
              jobId: job.jobId,
              status: "failed" as const,
              isLoading: false,
            };
          }
        } catch (error) {
          return {
            jobId: job.jobId,
            status: "failed" as const,
            isLoading: false,
          };
        }
      });

      const results = await Promise.all(promises);

      setRecentJobs((prev) =>
        prev.map((j) => {
          const result = results.find((r) => r.jobId === j.jobId);
          return result ? { ...j, ...result } : j;
        }),
      );

      setIsInitialLoading(false);
    };

    fetchStatuses();
  }, []);

  if (isInitialLoading) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-[#0A0A0A] to-[#0F0505] rounded-xl p-6 border border-[#1F1F1F]"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Analyses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </motion.div>
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
        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" />
          Checking...
        </Badge>
      );
    }

    switch (job.status) {
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1.5">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            Failed
          </Badge>
        );
    }
  };

  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gradient-to-br from-[#0A0A0A] to-[#0F0505] rounded-xl p-6 border border-[#1F1F1F]"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Analyses</h2>
        {recentJobs.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-[#B02E2B] hover:text-[#d6211e] transition-colors font-medium"
          >
            {showAll ? "Show Less" : `See All (${recentJobs.length})`}
          </button>
        )}
      </div>

      {recentJobs.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#0A0A0A] rounded-lg border border-dashed border-[#2A2A2A]">
          <Eye className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-400 mb-1">
            No Recent Analyses
          </h3>
          <p className="text-sm text-gray-500">
            Your analysis history will appear here once you start analyzing
            YouTube videos.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedJobs.map((job, index) => {
              const isCompleted = job.status === "completed" && !job.isLoading;

              const CardContent = (
                <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg overflow-hidden hover:border-[#B02E2B]/30 transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-[#171717] overflow-hidden group">
                    <img
                      src={getThumbnailUrl(job.videoId)}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='360' fill='%23171717'%3E%3Crect width='480' height='360' fill='%23171717'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%23525252'%3ENo Thumbnail%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {/* Status Badge Overlay */}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(job)}
                    </div>
                    {/* Completed Overlay Icon */}
                    {isCompleted && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="p-4 space-y-3">
                    {/* URL */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Video URL</p>
                      <p className="text-sm text-gray-300 truncate font-mono">
                        {job.videoUrl}
                      </p>
                    </div>

                    {/* Job ID and Time */}
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-gray-500">Job ID</p>
                        <p className="text-gray-400 font-mono">
                          {job.jobId.substring(0, 8)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500">Created</p>
                        <p className="text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(job.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );

              return isCompleted ? (
                <Link
                  key={job.jobId}
                  href={`/dashboard/comment-analyzer?jobId=${job.jobId}`}
                  className="block"
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
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="text-sm text-[#B02E2B] hover:text-[#d6211e] transition-colors font-medium"
              >
                Load More ({recentJobs.length - 6} more)
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
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

      <RecentAnalysesSection />

      {/* Coming Soon Section */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-gradient-to-br from-[#0A0A0A] to-[#0F0505] rounded-xl p-6 border border-[#1F1F1F]"
      >
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#B02E2B]" />
          Future Arsenal
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          We are building the ultimate unfair advantage. Stay tuned!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "Agent Ethan (AI Manager)",
            "Thumbnail Forensics",
            "Retention Spy",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#0A0A0A] border border-dashed border-[#2A2A2A] rounded-lg p-4 flex items-center justify-between"
            >
              <span className="text-gray-400 font-medium">{item}</span>
              <Badge className="bg-[#B02E2B]/10 text-[#B02E2B] border-[#B02E2B]/20">
                Soon
              </Badge>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
