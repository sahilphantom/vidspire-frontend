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
// Recent Analyses Component
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
    
    setRecentJobs(history.map((job) => ({ ...job, isLoading: true })));

    // Fetch status for each job
    history.forEach(async (job) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/video/status/${job.jobId}`,
        );
        const data = await response.json();

        if (data.success) {
          setRecentJobs((prev) =>
            prev.map((j) =>
              j.jobId === job.jobId
                ? { ...j, status: data.status, isLoading: false }
                : j,
            ),
          );
        } else {
          setRecentJobs((prev) =>
            prev.map((j) =>
              j.jobId === job.jobId
                ? { ...j, status: "failed", isLoading: false }
                : j,
            ),
          );
        }
      } catch (error) {
        setRecentJobs((prev) =>
          prev.map((j) =>
            j.jobId === job.jobId
              ? { ...j, status: "failed", isLoading: false }
              : j,
          ),
        );
      }
    });
  }, []);

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
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-300">
          Recent Analyses
        </h2>
        {recentJobs.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-[#B02E2B] hover:text-[#d6211e] transition-colors font-medium"
          >
            {showAll ? "Show Less" : `See All (${recentJobs.length})`}
          </button>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {displayedJobs.map((job) => {
          const isCompleted = job.status === "completed" && !job.isLoading;
          const CardContent = (
            <div
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
            </div>
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
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-[#B02E2B] hover:text-[#d6211e] transition-colors font-medium"
          >
            Load More ({recentJobs.length - 6} more)
          </button>
        </div>
      )}
    </section>
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
  // Removed Viral Gap Detector card as requested
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
    <div className={`max-w-7xl ${outfit.className} space-y-10 mx-auto pb-10`}>
      {/* Quick Access Cards */}
      <section>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">
          Quick Access
        </h2>
        {/* Updated grid to be responsive: 1 col on mobile, 3 on lg since we removed one card */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {toolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link href={tool.href} key={tool.title} className="block h-full">
                <Card
                  className={`bg-gradient-to-br ${tool.darkClass} border h-full cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
                >
                  <CardHeader>
                    <div className="flex items-center">
                      <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                    </div>
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
            );
          })}
        </div>
      </section>

      {/* Removed "Recent Analyses" Section as requested */}
      <RecentAnalysesSection />
    
      {/* Coming Soon Section */}
      <section>
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
                "Agent Ethan (AI Manager)",
                "Thumbnail Forensics",
                "Retention Spy",
              ].map((item, i) => (
                <div
                  key={i}
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
