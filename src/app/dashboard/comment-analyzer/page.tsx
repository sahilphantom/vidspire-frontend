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
  Sun
} from "lucide-react";
import { Space_Grotesk, Outfit } from "next/font/google";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { MultiStepLoader } from "@/components/ui/multi-step-loader"; // Import the loader

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
    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(jobs.slice(0, MAX_STORED_JOBS)));
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
      localStorage.setItem(this.COMPLETED_KEY, JSON.stringify(completedJobs.slice(0, MAX_STORED_JOBS)));
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
    const completedJobs = this.getCompletedJobs().filter((j) => j.jobId !== jobId);
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

  cleanup() {
    const expiryTime = Date.now() - JOB_EXPIRY_HOURS * 60 * 60 * 1000;
    const activeJobs = this.getActiveJobs().filter((j) => j.submittedAt > expiryTime);
    const completedJobs = this.getCompletedJobs().filter((j) => j.submittedAt > expiryTime);
    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(activeJobs));
    localStorage.setItem(this.COMPLETED_KEY, JSON.stringify(completedJobs));
  }
}

const jobStorage = new JobStorageManager();

// ========================================
// HELPERS
// ========================================

const ExpandableCard = ({ title, children, defaultOpen = false }: { title: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white/50 dark:bg-neutral-900/30 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">{title}</div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 pt-0 border-t border-neutral-200 dark:border-neutral-800/50">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg shadow-xl">
        <p className="font-bold text-neutral-900 dark:text-white mb-1">{data.name}</p>
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
  const [videoUrl, setVideoUrl] = useState("");
  const [uiState, setUiState] = useState<UIState>({ type: "idle" });
  const [pendingJobs, setPendingJobs] = useState<JobMetadata[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

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
      // REAL-TIME TEXT UPDATE FROM SOCKET
      setUiState({
        type: "processing",
        progress: event.percentage,
        message: event.message, // <--- Using message from backend
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
      const intervalIndex = Math.min(pollingAttemptRef.current, POLLING_INTERVALS.length - 1);
      const interval = POLLING_INTERVALS[intervalIndex];

      if (pollingAttemptRef.current < 120) {
        pollingIntervalRef.current = setTimeout(() => pollJobStatus(jobId), interval);
      } else {
        throw new Error("Timeout - please try again");
      }
    } catch (err: any) {
      setUiState({ type: "failed", error: err.message, retryable: true });
      jobStorage.moveToFailed(jobId, err.message);
      stopPolling();
    }
  };

  const handleSubmit = async () => {
    if (!videoUrl.trim()) {
      setUiState({ type: "failed", error: "Please enter a YouTube URL", retryable: false });
      return;
    }

    setUiState({ type: "processing", progress: 0, message: "Initializing Analysis..." });
    setPendingJobs([]);

    try {
      const response = await fetch(`${API_URL}/video/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to start analysis");
      }

      const { jobId, videoId } = data.data;
      currentJobIdRef.current = jobId;

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
    } catch (err: any) {
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
        return;
      }
      if (status.state === "completed" && status.returnvalue) {
        jobStorage.moveToCompleted(job.jobId, status.returnvalue);
        setUiState({ type: "completed", result: status.returnvalue });
      } else if (status.state === "failed") {
        jobStorage.moveToFailed(job.jobId, status.failedReason || "Failed");
        setUiState({ type: "failed", error: status.failedReason || "Job failed", retryable: true });
      } else {
        setUiState({ type: "processing", progress: status.progress || 0, message: "Resuming..." });
        connectToJob(job.jobId, job.videoId);
      }
    } catch (err: any) {
      setUiState({ type: "failed", error: err.message, retryable: true });
    }
  };

  const dismissJob = (jobId: string) => {
    jobStorage.removeJob(jobId);
    setPendingJobs((prev) => prev.filter((j) => j.jobId !== jobId));
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
      case "critical": return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20";
      case "moderate": return "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20";
      default: return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getSeverityBadge = (severity: string) => {
     switch(severity) {
        case "critical": return "bg-red-500 text-white";
        case "moderate": return "bg-orange-500 text-white";
        default: return "bg-blue-500 text-white";
     }
  }
  
  const prepareSentimentData = (summary: AnalysisResult['summary']) => [
    { name: 'Positive', value: summary.positive.count, color: '#22c55e', percent: summary.positive.percentage },
    { name: 'Neutral', value: summary.neutral.count, color: '#94a3b8', percent: summary.neutral.percentage }, 
    { name: 'Negative', value: summary.negative.count, color: '#ef4444', percent: summary.negative.percentage },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className={`min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#000000] text-neutral-900 dark:text-white p-4 sm:p-8 ${outfit.className}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <div className="flex flex-col items-start">
              <h1 className={`text-3xl sm:text-4xl font-bold flex items-center gap-3 ${spaceGrotesk.className}`}>
                <span className="bg-[#B02E2B]/10 p-2 rounded-lg"><Zap className="w-8 h-8 text-[#B02E2B]" /></span>
                Audience Mind-Reader
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-lg">
                AI-powered comment analysis & sentiment tracking.
              </p>
            </div>
            
          </div>

          {/* INPUT SECTION */}
          {uiState.type === "idle" && (
            <div className="w-full max-w-2xl mx-auto mt-20 text-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#B02E2B] to-[#902421] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                <div className="relative flex">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube Video URL..."
                    className="w-full pl-6 pr-32 py-5 bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#B02E2B] focus:border-[#B02E2B] outline-none transition-all text-lg shadow-xl"
                  />
                  <button
                    onClick={handleSubmit}
                    className="absolute right-2 top-2 bottom-2 px-8 bg-[#B02E2B] hover:bg-[#902421] text-white font-bold rounded-lg transition-all flex items-center gap-2"
                  >
                    Analyze <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-neutral-500 text-sm">Try: https://www.youtube.com/watch?v=...</p>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
              
              {/* KPIS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                      <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Total Comments</p>
                      <div className="flex items-end gap-2 mt-2">
                          <MessageSquare className="w-6 h-6 text-neutral-300 mb-1" />
                          <p className="text-4xl font-bold text-neutral-900 dark:text-white font-mono">{uiState.result.totalProcessed}</p>
                      </div>
                  </div>
                  <div className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                      <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Positive Sentiment</p>
                      <div className="flex items-end gap-2 mt-2">
                          <TrendingUp className="w-6 h-6 text-green-500 mb-1" />
                          <p className="text-4xl font-bold text-green-500">{uiState.result.summary.positive.percentage}%</p>
                      </div>
                  </div>
                  <div className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
                      <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Negative Sentiment</p>
                      <div className="flex items-end gap-2 mt-2">
                          <TrendingDown className="w-6 h-6 text-red-500 mb-1" />
                          <p className="text-4xl font-bold text-red-500">{uiState.result.summary.negative.percentage}%</p>
                      </div>
                  </div>
                  <div 
                      onClick={handleReset}
                      className="bg-gradient-to-br from-[#B02E2B] to-[#902421] rounded-xl p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:scale-[1.02] transition-transform shadow-lg shadow-red-900/20"
                  >
                      <Sparkles className="w-8 h-8 text-white mb-2" />
                      <span className="text-white font-bold text-lg">Analyze Another</span>
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
                                          {prepareSentimentData(uiState.result.summary).map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                      </Pie>
                                      <RechartsTooltip content={<CustomTooltip />} />
                                  </PieChart>
                              </ResponsiveContainer>
                              
                              {/* Center Text (Total Voices) */}
                              <div className="absolute z-0 inset-0 flex flex-col items-center justify-center pointer-events-none">
                                  <span className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tighter">{uiState.result.totalProcessed}</span>
                                  <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest mt-1">Voices</span>
                              </div>
                          </div>
                          
                          {/* Legend */}
                          <div className="grid grid-cols-3 gap-2 text-center mt-4">
                              <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded border border-green-200 dark:border-green-900/50">
                                  <p className="text-green-600 dark:text-green-500 font-bold">{uiState.result.summary.positive.count}</p>
                                  <p className="text-[10px] text-neutral-500">Positive</p>
                              </div>
                              <div className="bg-neutral-100 dark:bg-neutral-800/30 p-2 rounded border border-neutral-200 dark:border-neutral-800">
                                  <p className="text-neutral-700 dark:text-neutral-300 font-bold">{uiState.result.summary.neutral.count}</p>
                                  <p className="text-[10px] text-neutral-500">Neutral</p>
                              </div>
                              <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900/50">
                                  <p className="text-red-600 dark:text-red-500 font-bold">{uiState.result.summary.negative.count}</p>
                                  <p className="text-[10px] text-neutral-500">Negative</p>
                              </div>
                          </div>
                      </div>

                      {/* Emotions Bar Chart */}
                    <div className="bg-[#0f0f0f] border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Emotional Spectrum</h3>
                        <div className="space-y-5">
                            {uiState.result.emotions.slice(0, 6).map((emotion) => (
                                <div key={emotion.emotion} className="group">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-neutral-300 font-medium">{emotion.emotion}</span>
                                        <span className="text-neutral-500">{emotion.percentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#B02E2B] to-orange-500 rounded-full" 
                                            style={{ width: `${emotion.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 mt-1 opacity-100 transition-opacity">
                                        Triggered by: {emotion.triggers.slice(0, 2).join(", ")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                  {/* RIGHT COLUMN: INSIGHTS */}
                  <div className="lg:col-span-8 space-y-8">
                      
                      {/* IMPROVEMENTS */}
                      {uiState.result.improvements.length > 0 && (
                          <div className="space-y-4">
                              <div className="flex items-center gap-3 mb-2">
                                  <ShieldAlert className="w-6 h-6 text-red-500" />
                                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Retention Killers</h2>
                              </div>
                              
                              {uiState.result.improvements.map((item, idx) => (
                                  <div key={idx} className="bg-white dark:bg-[#0f0f0f] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-2">
                                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getSeverityBadge(item.severity)}`}>
                                                  {item.severity}
                                              </span>
                                              <span className="text-xs text-neutral-400">{item.mention_count} mentions</span>
                                          </div>
                                      </div>
                                      
                                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{item.issue}</h3>
                                      
                                      <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-3">
                                          <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                              <span className="text-[#B02E2B] font-bold">💡 Solution:</span> {item.suggestion}
                                          </p>
                                      </div>

                                      <ExpandableCard title={<span className="text-xs text-neutral-500 font-mono">VIEWER EVIDENCE ({item.example_comments.length})</span>}>
                                          <div className="space-y-3 mt-2">
                                              {item.example_comments.map((comment, cidx) => (
                                                  <div key={cidx} className="flex gap-3">
                                                      <div className="w-1 h-auto bg-red-500/30 rounded-full"></div>
                                                      <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">"{comment}"</p>
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
                              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Viral Triggers</h2>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                              {uiState.result.thingsLoved.map((item, idx) => (
                                  <div key={idx} className="bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:border-green-500/50 transition-colors relative overflow-hidden">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                                      <div className="flex items-center justify-between mb-3">
                                          <h3 className="text-lg font-bold text-neutral-900 dark:text-green-100">{item.aspect}</h3>
                                          <span className="text-xs font-mono text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                                              {item.mention_count} Mentions
                                          </span>
                                      </div>
                                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 leading-relaxed">
                                          {item.reason}
                                      </p>
                                      
                                      <ExpandableCard title={<span className="text-xs text-neutral-500 font-mono">READ PRAISE ({item.example_comments.length})</span>}>
                                          <div className="space-y-3 mt-2">
                                              {item.example_comments.map((comment, cidx) => (
                                                  <div key={cidx} className="flex gap-3">
                                                      <div className="w-1 h-auto bg-green-500/30 rounded-full"></div>
                                                      <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">"{comment}"</p>
                                                  </div>
                                              ))}
                                          </div>
                                      </ExpandableCard>
                                  </div>
                              ))}
                          </div>
                      </div>

                  </div>
              </div>

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}