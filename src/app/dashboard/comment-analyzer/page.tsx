// src/app/dashboard/comment-analyzer/page.tsx - Updated
"use client";
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Play,
  X,
  Sparkles,
  MessageSquare,
  BarChart3,
  ShieldAlert,
  Heart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import { Space_Grotesk, Outfit } from "next/font/google";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { useSearchParams } from "next/navigation";
import { RateLimitIndicator } from "@/components/RateLimitIndicator";
import { ToastContainer } from "@/components/RateLimitToast";
import { analyzeSentiment, RateLimitError } from "@/lib/api";
import { useRateLimit } from "@/hooks/useRateLimit";
import { Toast, useToast } from "@/components/RateLimitToast";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

// ========================================
// TYPES
// ========================================

interface ProgressEvent {
  jobId: string;
  videoId: string;
  stage: string;
  message: string;
  percentage: number;
  timestamp: number;
}

interface ErrorEvent {
  jobId: string;
  error: string;
  timestamp: number;
}

export interface JobData {
  jobId: string;
  videoId: string;
}


interface AnalysisResult {
  jobId: string;
  videoId: string;
  status: string;
  summary: {
    positive: { count: number; percentage: number };
    negative: { count: number; percentage: number };
    neutral: { count: number; percentage: number };
  };
  thingsLoved: Array<{
    aspect: string;
    reason: string;
    mention_count: number;
    example_comments: string[];
  }>;
  improvements: Array<{
    issue: string;
    suggestion: string;
    severity: string;
    mention_count: number;
    example_comments: string[];
  }>;
  emotions: Array<{
    emotion: string;
    percentage: number;
    triggers: string[];
  }>;
  patterns: {
    positive_patterns: Array<{
      theme: string;
      mention_count: number;
      keywords: string[];
    }>;
    negative_patterns: Array<{
      theme: string;
      mention_count: number;
      keywords: string[];
    }>;
    neutral_patterns: Array<{
      theme: string;
      mention_count: number;
      keywords: string[];
    }>;
  };
  wantMore: {
    content_requests: Array<{
      request_type: string;
      count: number;
      examples: string[];
    }>;
    expansion_requests: Array<{
      timestamp_or_topic: string;
      count: number;
      examples: string[];
    }>;
    missing_topics: Array<{
      topic: string;
      question_count: number;
      examples: string[];
    }>;
  };
  totalProcessed: number;
  hasTranscript: boolean;
  processingTime: string;
}

interface JobMetadata {
  jobId: string;
  videoId: string;
  videoUrl: string;
  status: "active" | "completed" | "failed";
  submittedAt: number;
  lastUpdated: number;
  progress?: number;
  stage?: string;
  error?: string;
}

type UIState =
  | { type: "idle" }
  | { type: "processing"; progress: number; message: string }
  | { type: "completed"; result: AnalysisResult }
  | { type: "failed"; error: string; retryable: boolean };

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";
const MAX_STORED_JOBS = 10;
const JOB_EXPIRY_HOURS = 24;
const POLLING_INTERVALS = [1000, 2000, 3000, 5000];

// ========================================
// JOB STORAGE LOGIC
// ========================================

class JobStorageManager {
  private readonly ACTIVE_KEY = "yt_analyzer_active_jobs";
  private readonly COMPLETED_KEY = "yt_analyzer_completed_jobs";
  private readonly HISTORY_KEY = "yt_analyzer_history";

  getActiveJobs(): JobMetadata[] {
    try {
      const data = localStorage.getItem(this.ACTIVE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addActiveJob(job: JobMetadata) {
    const jobs = this.getActiveJobs();
    jobs.unshift(job);
    localStorage.setItem(
      this.ACTIVE_KEY,
      JSON.stringify(jobs.slice(0, MAX_STORED_JOBS)),
    );
  }

  updateActiveJob(jobId: string, updates: Partial<JobMetadata>) {
    const jobs = this.getActiveJobs();
    const index = jobs.findIndex((j) => j.jobId === jobId);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updates, lastUpdated: Date.now() };
      localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(jobs));
    }
  }

  moveToCompleted(jobId: string, result?: AnalysisResult) {
    const activeJobs = this.getActiveJobs();
    const job = activeJobs.find((j) => j.jobId === jobId);
    if (job) {
      const completedJobs = this.getCompletedJobs();
      completedJobs.unshift({ ...job, status: "completed" as const, result });
      localStorage.setItem(
        this.COMPLETED_KEY,
        JSON.stringify(completedJobs.slice(0, MAX_STORED_JOBS)),
      );
      const remaining = activeJobs.filter((j) => j.jobId !== jobId);
      localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(remaining));
    }
  }

  moveToFailed(jobId: string, error: string) {
    const activeJobs = this.getActiveJobs();
    const job = activeJobs.find((j) => j.jobId === jobId);
    if (job) {
      this.updateActiveJob(jobId, { status: "failed", error });
    }
  }

  removeJob(jobId: string) {
    const activeJobs = this.getActiveJobs().filter((j) => j.jobId !== jobId);
    const completedJobs = this.getCompletedJobs().filter(
      (j) => j.jobId !== jobId,
    );
    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(activeJobs));
    localStorage.setItem(this.COMPLETED_KEY, JSON.stringify(completedJobs));
  }

  getCompletedJobs(): Array<JobMetadata & { result?: AnalysisResult }> {
    try {
      const data = localStorage.getItem(this.COMPLETED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getHistory(): Array<{
    videoUrl: string;
    videoId: string;
    jobId: string;
    createdAt: number;
  }> {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addToHistory(videoUrl: string, videoId: string, jobId: string) {
    const history = this.getHistory();
    const newEntry = {
      videoUrl,
      videoId,
      jobId,
      createdAt: Date.now(),
    };
    history.unshift(newEntry);
    // Keep only last 50 entries
    localStorage.setItem(
      this.HISTORY_KEY,
      JSON.stringify(history.slice(0, 50)),
    );
  }

  cleanup() {
    const expiryTime = Date.now() - JOB_EXPIRY_HOURS * 60 * 60 * 1000;
    const activeJobs = this.getActiveJobs().filter(
      (j) => j.submittedAt > expiryTime,
    );
    const completedJobs = this.getCompletedJobs().filter(
      (j) => j.submittedAt > expiryTime,
    );
    const history = this.getHistory().filter((h) => h.createdAt > expiryTime);

    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(activeJobs));
    localStorage.setItem(this.COMPLETED_KEY, JSON.stringify(completedJobs));
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }
}

const jobStorage = new JobStorageManager();

// ========================================
// HELPERS
// ========================================

const ExpandableCard = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white/50 dark:bg-neutral-900/30 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">{title}</div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-neutral-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 pt-0 border-t border-neutral-200 dark:border-neutral-800/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// ========================================
// WANT MORE COMPONENT
// ========================================

interface WantMoreProps {
  wantMore: {
    content_requests: Array<{
      request_type: string;
      count: number;
      examples: string[];
    }>;
    expansion_requests: Array<{
      timestamp_or_topic: string;
      count: number;
      examples: string[];
    }>;
    missing_topics: Array<{
      topic: string;
      question_count: number;
      examples: string[];
    }>;
  };
}

const WantMoreSection: React.FC<WantMoreProps> = ({ wantMore }) => {
  const totalRequests =
    wantMore.content_requests.length +
    wantMore.expansion_requests.length +
    wantMore.missing_topics.length;

  if (totalRequests === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <MessageSquare className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          What Viewers Want More
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Content Requests */}
        {wantMore.content_requests.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Content Requests
              </h3>
              <span className="text-xs text-neutral-500">
                ({wantMore.content_requests.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {wantMore.content_requests.map((request, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 relative overflow-hidden group hover:border-blue-500/50 transition-all"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />

                  <div className="pl-3">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight flex-1">
                        {request.request_type}
                      </h4>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-blue-900/20 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                        {request.count} requests
                      </span>
                    </div>

                    <ExpandableCard
                      title={
                        <span className="text-xs text-neutral-500 font-mono">
                          EXAMPLES ({request.examples.length})
                        </span>
                      }
                    >
                      <div className="space-y-2 mt-2">
                        {request.examples.map((example, eidx) => (
                          <div key={eidx} className="flex gap-2">
                            <div className="w-1 h-auto bg-blue-500/30 rounded-full flex-shrink-0 mt-1"></div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 italic">
                              "{example}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </ExpandableCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expansion Requests */}
        {wantMore.expansion_requests.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Topics to Expand
              </h3>
              <span className="text-xs text-neutral-500">
                ({wantMore.expansion_requests.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {wantMore.expansion_requests.map((request, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 relative overflow-hidden group hover:border-orange-500/50 transition-all"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />

                  <div className="pl-3">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight flex-1">
                        {request.timestamp_or_topic}
                      </h4>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-orange-900/20 text-orange-400 border border-orange-500/20 whitespace-nowrap">
                        {request.count} requests
                      </span>
                    </div>

                    <ExpandableCard
                      title={
                        <span className="text-xs text-neutral-500 font-mono">
                          EXAMPLES ({request.examples.length})
                        </span>
                      }
                    >
                      <div className="space-y-2 mt-2">
                        {request.examples.map((example, eidx) => (
                          <div key={eidx} className="flex gap-2">
                            <div className="w-1 h-auto bg-orange-500/30 rounded-full flex-shrink-0 mt-1"></div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 italic">
                              "{example}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </ExpandableCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Topics */}
        {wantMore.missing_topics.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Missing Topics
              </h3>
              <span className="text-xs text-neutral-500">
                ({wantMore.missing_topics.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {wantMore.missing_topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 relative overflow-hidden group hover:border-purple-500/50 transition-all"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />

                  <div className="pl-3">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight flex-1">
                        {topic.topic}
                      </h4>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-purple-900/20 text-purple-400 border border-purple-500/20 whitespace-nowrap">
                        {topic.question_count} questions
                      </span>
                    </div>

                    <ExpandableCard
                      title={
                        <span className="text-xs text-neutral-500 font-mono">
                          EXAMPLES ({topic.examples.length})
                        </span>
                      }
                    >
                      <div className="space-y-2 mt-2">
                        {topic.examples.map((example, eidx) => (
                          <div key={eidx} className="flex gap-2">
                            <div className="w-1 h-auto bg-purple-500/30 rounded-full flex-shrink-0 mt-1"></div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 italic">
                              "{example}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </ExpandableCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// PATTERNS COMPONENT (REDESIGNED)
// ========================================

interface PatternsProps {
  patterns: {
    positive_patterns: Array<{
      theme: string;
      mention_count: number;
      keywords: string[];
    }>;
    negative_patterns: Array<{
      theme: string;
      mention_count: number;
      keywords: string[];
    }>;
    neutral_patterns: Array<{
      theme: string;
      mention_count: number;
      keywords: string[];
    }>;
  };
}

const PatternsSection: React.FC<PatternsProps> = ({ patterns }) => {
  const [activeTab, setActiveTab] = useState<
    "positive" | "negative" | "neutral"
  >("positive");

  const getTabData = () => {
    switch (activeTab) {
      case "positive":
        return {
          data: patterns.positive_patterns,
          icon: "✨",
          gradient: "from-green-500/10 to-green-600/5",
          borderColor: "border-green-500/30",
          hoverBorder: "hover:border-green-500",
          accentColor: "bg-green-500",
        };
      case "negative":
        return {
          data: patterns.negative_patterns,
          icon: "⚠️",
          gradient: "from-red-500/10 to-red-600/5",
          borderColor: "border-red-500/30",
          hoverBorder: "hover:border-red-500",
          accentColor: "bg-red-500",
        };
      case "neutral":
        return {
          data: patterns.neutral_patterns,
          icon: "📊",
          gradient: "from-neutral-500/10 to-neutral-600/5",
          borderColor: "border-neutral-500/30",
          hoverBorder: "hover:border-neutral-500",
          accentColor: "bg-neutral-500",
        };
    }
  };

  const { data, icon, gradient, borderColor, hoverBorder, accentColor } =
    getTabData();

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#0f0f0f] border border-neutral-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#B02E2B]" />
          Comment Patterns
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab("positive")}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2
            ${
              activeTab === "positive"
                ? "bg-green-900/30 text-green-400 border border-green-500/30"
                : "bg-neutral-900 text-neutral-500 border border-neutral-800 hover:text-green-400 hover:border-green-500/20"
            }
          `}
        >
          ✨ Positive
          <span className="text-xs bg-green-500/20 px-1.5 py-0.5 rounded">
            {patterns.positive_patterns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("negative")}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2
            ${
              activeTab === "negative"
                ? "bg-red-900/30 text-red-400 border border-red-500/30"
                : "bg-neutral-900 text-neutral-500 border border-neutral-800 hover:text-red-400 hover:border-red-500/20"
            }
          `}
        >
          ⚠️ Negative
          <span className="text-xs bg-red-500/20 px-1.5 py-0.5 rounded">
            {patterns.negative_patterns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("neutral")}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2
            ${
              activeTab === "neutral"
                ? "bg-neutral-800 text-neutral-300 border border-neutral-600/30"
                : "bg-neutral-900 text-neutral-500 border border-neutral-800 hover:text-neutral-300 hover:border-neutral-600/20"
            }
          `}
        >
          📊 Neutral
          <span className="text-xs bg-neutral-600/20 px-1.5 py-0.5 rounded">
            {patterns.neutral_patterns.length}
          </span>
        </button>
      </div>

      {/* Pattern Cards - Scrollable on mobile, grid on desktop */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 pr-2">
        {data.map((pattern, idx) => (
          <div
            key={idx}
            className={`
              relative bg-gradient-to-br ${gradient} backdrop-blur-sm
              border ${borderColor} ${hoverBorder}
              rounded-lg p-4 transition-all duration-200
              hover:shadow-lg hover:shadow-[#B02E2B]/5
            `}
          >
            {/* Left accent line */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} rounded-l-lg`}
            />

            <div className="pl-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="text-sm font-bold text-white leading-tight flex-1">
                  <span className="mr-2">{icon}</span>
                  {pattern.theme}
                </h4>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-900/50 text-neutral-400 border border-neutral-700/50 whitespace-nowrap">
                  {pattern.mention_count}
                </span>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5">
                {pattern.keywords.slice(0, 8).map((keyword, kidx) => (
                  <span
                    key={kidx}
                    className="text-[11px] px-2 py-1 rounded bg-neutral-900/80 text-neutral-300 border border-neutral-700/50 font-mono hover:bg-neutral-800 transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
                {pattern.keywords.length > 8 && (
                  <span className="text-[11px] px-2 py-1 text-neutral-500 font-mono">
                    +{pattern.keywords.length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg shadow-xl">
        <p className="font-bold text-neutral-900 dark:text-white mb-1">
          {data.name}
        </p>
        <p className="text-sm font-mono" style={{ color: data.color }}>
          {data.value} comments ({data.percent}%)
        </p>
      </div>
    );
  }
  return null;
};

// ========================================
// MAIN COMPONENT
// ========================================

export default function VideoAnalysisPage() {
  const params = useSearchParams();
  const jobId = params.get("jobId");
  const [videoUrl, setVideoUrl] = useState("");
  const [uiState, setUiState] = useState<UIState>({ type: "idle" });
  const [pendingJobs, setPendingJobs] = useState<JobMetadata[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { rateLimitInfo, updateRateLimit } = useRateLimit("sentiment-analysis");
  const { showError, showWarning, showSuccess, toasts, removeToast } =
    useToast();

  const socketRef = useRef<Socket | null>(null);
  const currentJobIdRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingAttemptRef = useRef(0);

  // --- INITIALIZATION ---
  useEffect(() => {
    jobStorage.cleanup();
    checkForPendingJobs();
    return () => {
      disconnectSocket();
      stopPolling();
    };
  }, []);

  // Check for jobId in URL params and fetch existing analysis
  useEffect(() => {
    if (jobId) {
      fetchExistingJob(jobId);
    }
  }, [jobId]);

  const checkForPendingJobs = () => {
    const active = jobStorage.getActiveJobs();
    if (active.length > 0) setPendingJobs(active);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- API & SOCKET LOGIC ---
  const fetchJobStatus = async (jobId: string) => {
    const response = await fetch(`${API_URL}/video/status/${jobId}`);
    const data = await response.json();
    return data.success ? data.data : null;
  };

  const connectToJob = (jobId: string, videoId: string) => {
    disconnectSocket();

    const socket = io(SOCKET_URL, {
      query: { jobId },
      transports: ["websocket", "polling"],
      timeout: 5000,
      reconnection: false,
      path: "/socket.io",
    });

    socketRef.current = socket;
    let socketConnected = false;

    socket.on("connect", () => {
      socketConnected = true;
    });

    socket.on("progress", (event: ProgressEvent) => {
      setUiState({
        type: "processing",
        progress: event.percentage,
        message: event.message,
      });
      jobStorage.updateActiveJob(jobId, {
        progress: event.percentage,
        stage: event.stage,
      });
    });

    socket.on("error", (event: ErrorEvent) => {
      setUiState({ type: "failed", error: event.error, retryable: true });
      jobStorage.moveToFailed(jobId, event.error);
      socket.disconnect();
    });

    socket.on("completed", (data) => {
      setUiState({ type: "completed", result: data.result });
      jobStorage.moveToCompleted(jobId, data.result);
      socket.disconnect();
      showSuccess("Analysis completed successfully!");
    });

    socket.on("connect_error", () => {
      if (!socketConnected) {
        socket.disconnect();
        startPolling(jobId);
      }
    });

    setTimeout(() => {
      if (!socketConnected) {
        socket.disconnect();
        startPolling(jobId);
      }
    }, 3000);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const startPolling = (jobId: string) => {
    stopPolling();
    pollingAttemptRef.current = 0;
    pollJobStatus(jobId);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const status = await fetchJobStatus(jobId);
      if (!status) throw new Error("Job not found");

      if (status.state === "completed" && status.returnvalue) {
        setUiState({ type: "completed", result: status.returnvalue });
        jobStorage.moveToCompleted(jobId, status.returnvalue);
        stopPolling();
        showSuccess("Analysis completed successfully!");
        return;
      } else if (status.state === "failed") {
        throw new Error(status.failedReason || "Job failed");
      } else if (status.state === "active") {
        const progress = status.progress || 0;
        setUiState({
          type: "processing",
          progress,
          message: `Processing... ${progress}%`,
        });
        jobStorage.updateActiveJob(jobId, { progress });
      }

      pollingAttemptRef.current++;
      const intervalIndex = Math.min(
        pollingAttemptRef.current,
        POLLING_INTERVALS.length - 1,
      );
      const interval = POLLING_INTERVALS[intervalIndex];

      if (pollingAttemptRef.current < 120) {
        pollingIntervalRef.current = setTimeout(
          () => pollJobStatus(jobId),
          interval,
        );
      } else {
        throw new Error("Timeout - please try again");
      }
    } catch (err: any) {
      setUiState({ type: "failed", error: err.message, retryable: true });
      jobStorage.moveToFailed(jobId, err.message);
      stopPolling();
      showError(err.message);
    }
  };

  const fetchExistingJob = async (jobId: string) => {
    setUiState({
      type: "processing",
      progress: 50,
      message: "Loading analysis...",
    });

    try {
      const response = await fetch(`${API_URL}/video/${jobId}`);
      const data = await response.json();
      console.log(" full JSON data : ", JSON.stringify(data, null, 2));
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch job data");
      }

      const jobData = data.data;

      // Check if data has the complete analysis result (direct result format)
      if (jobData.status === "completed" && jobData.summary) {
        // This is the complete analysis result
        setUiState({ type: "completed", result: jobData });
        jobStorage.moveToCompleted(jobId, jobData);
        return;
      }

      // Otherwise check for job state format (from status endpoint)
      if (jobData.state === "completed" && jobData.returnvalue) {
        setUiState({ type: "completed", result: jobData.returnvalue });
        jobStorage.moveToCompleted(jobId, jobData.returnvalue);
      } else if (jobData.state === "failed") {
        throw new Error(jobData.failedReason || "Analysis failed");
      } else if (jobData.state === "active") {
        currentJobIdRef.current = jobId;

        const history = jobStorage.getHistory();
        const historyEntry = history.find((h) => h.jobId === jobId);
        const videoId = historyEntry?.videoId || jobData.videoId || "";

        if (historyEntry) {
          setVideoUrl(historyEntry.videoUrl);
        }

        setUiState({
          type: "processing",
          progress: jobData.progress || 0,
          message: "Resuming analysis...",
        });

        connectToJob(jobId, videoId);
      } else if (jobData.status === "failed") {
        // Handle failed status in direct format
        throw new Error(jobData.error || "Analysis failed");
      } else {
        // Unknown state
        throw new Error("Unknown job state");
      }
    } catch (err: any) {
      console.error("Error fetching job:", err);
      setUiState({
        type: "failed",
        error: err.message || "Failed to load analysis",
        retryable: false,
      });
      showError(err.message || "Failed to load analysis");
    }
  };

  const handleSubmit = async () => {
    if (!videoUrl.trim()) {
      setUiState({
        type: "failed",
        error: "Please enter a YouTube URL",
        retryable: false,
      });
      return;
    }

    // ✅ NEW: Check rate limit
    if (rateLimitInfo.isLimited) {
      showError("Daily limit reached! Come back tomorrow.");
      return;
    }

    if (rateLimitInfo.remaining === 1) {
      showWarning("This is your last free analysis today!");
    }

    setUiState({
      type: "processing",
      progress: 0,
      message: "Initializing Analysis...",
    });
    setPendingJobs([]);

    try {
      // ✅ NEW: Use API wrapper instead of fetch
      const { data, headers } = await analyzeSentiment(videoUrl);

      // ✅ NEW: Update rate limit from headers
      updateRateLimit(headers);

      const { jobId, videoId } = data;
      currentJobIdRef.current = jobId;
      jobStorage.addToHistory(videoUrl, videoId, jobId);
      jobStorage.addActiveJob({
        jobId,
        videoId,
        videoUrl,
        status: "active",
        submittedAt: Date.now(),
        lastUpdated: Date.now(),
        progress: 0,
      });

      connectToJob(jobId, videoId);
      showSuccess("Analysis started successfully!");
    } catch (err: any) {
      // ✅ NEW: Handle rate limit errors
      if (err instanceof RateLimitError) {
        updateRateLimit(
          new Headers({
            "X-RateLimit-Limit": err.limit.toString(),
            "X-RateLimit-Remaining": err.remaining.toString(),
            "X-RateLimit-Reset": err.resetAt,
          }),
        );
        showError(err.message);
      }
      setUiState({ type: "failed", error: err.message, retryable: true });
    }
  };

  const resumeJob = async (job: JobMetadata) => {
    currentJobIdRef.current = job.jobId;
    setVideoUrl(job.videoUrl);
    setPendingJobs([]);
    try {
      const status = await fetchJobStatus(job.jobId);
      if (!status) {
        jobStorage.removeJob(job.jobId);
        setUiState({ type: "failed", error: "Job expired", retryable: false });
        showError("Job expired");
        return;
      }
      if (status.state === "completed" && status.returnvalue) {
        jobStorage.moveToCompleted(job.jobId, status.returnvalue);
        setUiState({ type: "completed", result: status.returnvalue });
        showSuccess("Analysis loaded successfully!");
      } else if (status.state === "failed") {
        jobStorage.moveToFailed(job.jobId, status.failedReason || "Failed");
        setUiState({
          type: "failed",
          error: status.failedReason || "Job failed",
          retryable: true,
        });
        showError(status.failedReason || "Job failed");
      } else {
        setUiState({
          type: "processing",
          progress: status.progress || 0,
          message: "Resuming...",
        });
        connectToJob(job.jobId, job.videoId);
      }
    } catch (err: any) {
      setUiState({ type: "failed", error: err.message, retryable: true });
      showError(err.message);
    }
  };

  const dismissJob = (jobId: string) => {
    jobStorage.removeJob(jobId);
    setPendingJobs((prev) => prev.filter((j) => j.jobId !== jobId));
    showSuccess("Job dismissed");
  };

  const handleReset = () => {
    disconnectSocket();
    stopPolling();
    currentJobIdRef.current = null;
    setUiState({ type: "idle" });
    setVideoUrl("");
  };

  // --- UI Colors ---
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20";
      case "moderate":
        return "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white";
      case "moderate":
        return "bg-orange-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const prepareSentimentData = (summary: AnalysisResult["summary"]) => [
    {
      name: "Positive",
      value: summary.positive.count,
      color: "#22c55e",
      percent: summary.positive.percentage,
    },
    {
      name: "Neutral",
      value: summary.neutral.count,
      color: "#94a3b8",
      percent: summary.neutral.percentage,
    },
    {
      name: "Negative",
      value: summary.negative.count,
      color: "#ef4444",
      percent: summary.negative.percentage,
    },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <ToastContainer />
      <div
        className={`min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#000000] text-neutral-900 dark:text-white p-4 sm:p-8 ${outfit.className}`}
      >
        <div className="max-w-7xl mx-auto">
          {/* ✅ ADD TOAST CONTAINER */}
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
          {/* Rate Limit Indicator */}
          <RateLimitIndicator
            featureName="video_analysis"
            displayName="Video Analysis"
          />

          {/* TOP BAR */}
          <div className="flex justify-center items-center mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <div className="flex flex-col items-start ">
              <h1
                className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#B02E2B] via-[#C83E3A] to-[#B02E2B] bg-clip-text text-transparent flex items-center gap-3 ${spaceGrotesk.className}`}
              >
                <span className="bg-[#B02E2B]/10 p-2 rounded-lg">
                  <Zap className="w-8 h-8 text-[#B02E2B]" />
                </span>
                Audience Mind-Reader
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-lg max-w-2xl mx-auto">
                AI-powered comment analysis & sentiment tracking.
              </p>
            </div>
          </div>

          {/* ✅ ADD RATE LIMIT INDICATOR */}
          {uiState.type === "idle" && (
            <RateLimitIndicator
              featureName="sentiment-analysis"
              displayName="Sentiment Analysis"
            />
          )}

          {/* ✅ UPDATE INPUT SECTION - Add disabled state */}
          {uiState.type === "idle" && (
            <div className="w-full max-w-2xl mx-auto mt-8 text-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-[#B02E2B] to-[#902421] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                <div className="relative flex">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube Video URL..."
                    disabled={rateLimitInfo.isLimited}
                    className="w-full pl-6 pr-32 py-5 bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#B02E2B] focus:border-[#B02E2B] outline-none transition-all text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={rateLimitInfo.isLimited}
                    className={`absolute right-2 top-2 bottom-2 px-8 font-bold rounded-lg transition-all flex items-center gap-2 ${
                      rateLimitInfo.isLimited
                        ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                        : "bg-[#B02E2B] hover:bg-[#902421] text-white"
                    }`}
                  >
                    {rateLimitInfo.isLimited ? (
                      "Limit Reached"
                    ) : (
                      <>
                        Analyze <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-4 text-neutral-500 text-sm">
                Try: https://www.youtube.com/watch?v=...
              </p>
            </div>
          )}

          {/* MULTI STEP LOADER */}
          <MultiStepLoader
            loading={uiState.type === "processing"}
            progress={uiState.type === "processing" ? uiState.progress : 0}
            loadingText={uiState.type === "processing" ? uiState.message : ""}
          />

          {/* RESULTS DASHBOARD */}
          {uiState.type === "completed" && uiState.result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pb-20"
            >
              {/* KPIS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                  <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">
                    Total Comments
                  </p>
                  <div className="flex items-end gap-2 mt-2">
                    <MessageSquare className="w-6 h-6 text-neutral-300 mb-1" />
                    <p className="text-4xl font-bold text-neutral-900 dark:text-white font-mono">
                      {uiState.result.totalProcessed}
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                  <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">
                    Positive Sentiment
                  </p>
                  <div className="flex items-end gap-2 mt-2">
                    <TrendingUp className="w-6 h-6 text-green-500 mb-1" />
                    <p className="text-4xl font-bold text-green-500">
                      {uiState.result.summary.positive.percentage}%
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                  <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">
                    Negative Sentiment
                  </p>
                  <div className="flex items-end gap-2 mt-2">
                    <TrendingDown className="w-6 h-6 text-red-500 mb-1" />
                    <p className="text-4xl font-bold text-red-500">
                      {uiState.result.summary.negative.percentage}%
                    </p>
                  </div>
                </div>
                <div
                  onClick={handleReset}
                  className="bg-gradient-to-br from-[#B02E2B] to-[#902421] rounded-xl p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:scale-[1.02] transition-transform shadow-lg shadow-red-900/20"
                >
                  <Sparkles className="w-8 h-8 text-white mb-2" />
                  <span className="text-white font-bold text-lg">
                    Analyze Another
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: VISUALIZATIONS */}
                <div className="lg:col-span-4 space-y-8">
                  {/* SENTIMENT BREAKDOWN - DONUT CHART */}
                  <div className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 relative overflow-hidden shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                      Sentiment Breakdown
                    </h3>
                    <div className="h-64 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareSentimentData(uiState.result.summary)}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            startAngle={90}
                            endAngle={-270}
                          >
                            {prepareSentimentData(uiState.result.summary).map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ),
                            )}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Center Text (Total Voices) */}
                      <div className="absolute z-0 inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tighter">
                          {uiState.result.totalProcessed}
                        </span>
                        <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest mt-1">
                          Voices
                        </span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-2 text-center mt-4">
                      <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded border border-green-200 dark:border-green-900/50">
                        <p className="text-green-600 dark:text-green-500 font-bold">
                          {uiState.result.summary.positive.count}
                        </p>
                        <p className="text-[10px] text-neutral-500">Positive</p>
                      </div>
                      <div className="bg-neutral-100 dark:bg-neutral-800/30 p-2 rounded border border-neutral-200 dark:border-neutral-800">
                        <p className="text-neutral-700 dark:text-neutral-300 font-bold">
                          {uiState.result.summary.neutral.count}
                        </p>
                        <p className="text-[10px] text-neutral-500">Neutral</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900/50">
                        <p className="text-red-600 dark:text-red-500 font-bold">
                          {uiState.result.summary.negative.count}
                        </p>
                        <p className="text-[10px] text-neutral-500">Negative</p>
                      </div>
                    </div>
                  </div>

                  {/* Emotions Bar Chart */}
                  <div className="bg-[#0f0f0f] border border-neutral-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Emotional Spectrum
                    </h3>
                    <div className="space-y-5">
                      {uiState.result.emotions.slice(0, 6).map((emotion) => (
                        <div key={emotion.emotion} className="group">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-300 font-medium">
                              {emotion.emotion}
                            </span>
                            <span className="text-neutral-500">
                              {emotion.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#B02E2B] to-orange-500 rounded-full"
                              style={{ width: `${emotion.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-neutral-500 mt-1 opacity-100 transition-opacity">
                            Triggered by:{" "}
                            {emotion.triggers.slice(0, 2).join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {uiState.result.patterns && (
                    <PatternsSection patterns={uiState.result.patterns} />
                  )}
                </div>

                {/* RIGHT COLUMN: INSIGHTS */}
                <div className="lg:col-span-8 space-y-8">
                  {/* IMPROVEMENTS */}
                  {uiState.result.improvements.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                          Retention Killers
                        </h2>
                      </div>

                      {uiState.result.improvements.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-[#0f0f0f] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getSeverityBadge(item.severity)}`}
                              >
                                {item.severity}
                              </span>
                              <span className="text-xs text-neutral-400">
                                {item.mention_count} mentions
                              </span>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                            {item.issue}
                          </h3>

                          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-3">
                            <p className="text-sm text-neutral-600 dark:text-neutral-300">
                              <span className="text-[#B02E2B] font-bold">
                                💡 Solution:
                              </span>{" "}
                              {item.suggestion}
                            </p>
                          </div>

                          <ExpandableCard
                            title={
                              <span className="text-xs text-neutral-500 font-mono">
                                VIEWER EVIDENCE ({item.example_comments.length})
                              </span>
                            }
                          >
                            <div className="space-y-3 mt-2">
                              {item.example_comments.map((comment, cidx) => (
                                <div key={cidx} className="flex gap-3">
                                  <div className="w-1 h-auto bg-red-500/30 rounded-full"></div>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                                    "{comment}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </ExpandableCard>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VIRAL TRIGGERS */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Heart className="w-6 h-6 text-green-500" />
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Viral Triggers
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {uiState.result.thingsLoved.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:border-green-500/50 transition-colors relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-green-100">
                              {item.aspect}
                            </h3>
                            <span className="text-xs font-mono text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                              {item.mention_count} Mentions
                            </span>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 leading-relaxed">
                            {item.reason}
                          </p>

                          <ExpandableCard
                            title={
                              <span className="text-xs text-neutral-500 font-mono">
                                READ PRAISE ({item.example_comments.length})
                              </span>
                            }
                          >
                            <div className="space-y-3 mt-2">
                              {item.example_comments.map((comment, cidx) => (
                                <div key={cidx} className="flex gap-3">
                                  <div className="w-1 h-auto bg-green-500/30 rounded-full"></div>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                                    "{comment}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </ExpandableCard>
                        </div>
                      ))}
                    </div>
                  </div>

                  {uiState.result.wantMore && (
                    <WantMoreSection wantMore={uiState.result.wantMore} />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
