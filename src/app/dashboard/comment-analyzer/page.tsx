"use client";
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Play,
  X,
  Sparkles,
  MessageSquare,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { Space_Grotesk, Outfit } from "next/font/google";

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
  data?: any;
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
  | { type: "processing"; progress: number; stage: string; message: string }
  | { type: "completed"; result: AnalysisResult }
  | { type: "failed"; error: string; retryable: boolean };

// ========================================
// CONSTANTS
// ========================================

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";
const MAX_STORED_JOBS = 10;
const JOB_EXPIRY_HOURS = 24;
const POLLING_INTERVALS = [1000, 2000, 3000, 5000];

// Stage display mapping
const STAGE_LABELS: Record<string, string> = {
  queued: "Initializing Analysis",
  fetching_comments: "Fetching Comments",
  fetching_transcript: "Fetching Transcript",
  classifying_comments: "Analyzing Sentiment",
  analyzing_emotions: "Understanding Emotions",
  analyzing_loved: "Finding What Viewers Loved",
  analyzing_improvements: "Identifying Improvements",
  summarizing: "Generating Report",
  completed: "Complete",
};

// ========================================
// LOCAL STORAGE MANAGER
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
    localStorage.setItem(
      this.ACTIVE_KEY,
      JSON.stringify(jobs.slice(0, MAX_STORED_JOBS))
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
        JSON.stringify(completedJobs.slice(0, MAX_STORED_JOBS))
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
      (j) => j.jobId !== jobId
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

  cleanup() {
    const expiryTime = Date.now() - JOB_EXPIRY_HOURS * 60 * 60 * 1000;
    const activeJobs = this.getActiveJobs().filter(
      (j) => j.submittedAt > expiryTime
    );
    const completedJobs = this.getCompletedJobs().filter(
      (j) => j.submittedAt > expiryTime
    );
    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(activeJobs));
    localStorage.setItem(this.COMPLETED_KEY, JSON.stringify(completedJobs));
  }
}

const jobStorage = new JobStorageManager();

// ========================================
// MAIN COMPONENT
// ========================================

export default function VideoAnalysisPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [uiState, setUiState] = useState<UIState>({ type: "idle" });
  const [pendingJobs, setPendingJobs] = useState<JobMetadata[]>([]);
  const [currentStatusMessage, setCurrentStatusMessage] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const currentJobIdRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingAttemptRef = useRef(0);

  // ========================================
  // INITIALIZATION
  // ========================================

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
    if (active.length > 0) {
      setPendingJobs(active);
    }
  };

  // ========================================
  // API & CONNECTION
  // ========================================

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
        stage: event.stage,
        message: event.message,
      });
      setCurrentStatusMessage(event.message);
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
          stage: "processing",
          message: `Processing... ${progress}%`,
        });
        setCurrentStatusMessage(`Processing... ${progress}%`);
        jobStorage.updateActiveJob(jobId, { progress });
      }

      pollingAttemptRef.current++;
      const intervalIndex = Math.min(
        pollingAttemptRef.current,
        POLLING_INTERVALS.length - 1
      );
      const interval = POLLING_INTERVALS[intervalIndex];

      if (pollingAttemptRef.current < 120) {
        pollingIntervalRef.current = setTimeout(
          () => pollJobStatus(jobId),
          interval
        );
      } else {
        throw new Error("Timeout - please try again");
      }
    } catch (err: any) {
      setUiState({ type: "failed", error: err.message, retryable: true });
      jobStorage.moveToFailed(jobId, err.message);
      stopPolling();
    }
  };

  // ========================================
  // HANDLERS
  // ========================================

  const handleSubmit = async () => {
    if (!videoUrl.trim()) {
      setUiState({
        type: "failed",
        error: "Please enter a YouTube URL",
        retryable: false,
      });
      return;
    }

    setUiState({
      type: "processing",
      progress: 0,
      stage: "queued",
      message: "Starting analysis...",
    });
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
        setUiState({
          type: "failed",
          error: "Job expired",
          retryable: false,
        });
        return;
      }

      if (status.state === "completed" && status.returnvalue) {
        jobStorage.moveToCompleted(job.jobId, status.returnvalue);
        setUiState({ type: "completed", result: status.returnvalue });
      } else if (status.state === "failed") {
        jobStorage.moveToFailed(job.jobId, status.failedReason || "Failed");
        setUiState({
          type: "failed",
          error: status.failedReason || "Job failed",
          retryable: true,
        });
      } else {
        setUiState({
          type: "processing",
          progress: status.progress || 0,
          stage: "resuming",
          message: "Reconnecting...",
        });
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
    setCurrentStatusMessage("");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-4 border-red-500 bg-red-50";
      case "moderate":
        return "border-l-4 border-orange-500 bg-orange-50";
      case "minor":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      default:
        return "border-l-4 border-gray-500 bg-gray-50";
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4 sm:p-8 ${outfit.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-3 ${spaceGrotesk.className}`} style={{ color: '#B02E2B' }}>
            YouTube Sentiment Analyzer
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time analysis of comments and emotions
          </p>
        </div>

        {/* Pending Jobs */}
        {pendingJobs.length > 0 && uiState.type === "idle" && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className={`font-bold text-amber-900 mb-3 text-lg ${spaceGrotesk.className}`}>
                  Resume Previous Analysis
                </h3>
                <div className="space-y-2">
                  {pendingJobs.slice(0, 3).map((job) => (
                    <div
                      key={job.jobId}
                      className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {job.videoUrl}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Started {new Date(job.submittedAt).toLocaleTimeString()}
                          {job.progress ? ` • ${job.progress}% complete` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => resumeJob(job)}
                          className="p-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#B02E2B' }}
                          title="Resume"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => dismissJob(job.jobId)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        {uiState.type !== "completed" && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <label className={`block text-sm font-semibold text-gray-700 mb-3 ${spaceGrotesk.className}`}>
                Enter YouTube Video URL
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && uiState.type === "idle" && handleSubmit()
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all"
                  style={{ focusRingColor: '#B02E2B' }}
                  disabled={uiState.type !== "idle"}
                />
                {uiState.type === "idle" && (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md"
                    style={{ backgroundColor: '#B02E2B' }}
                  >
                    Analyze
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Processing State - Circular Progress */}
        {uiState.type === "processing" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full animate-spin" style={{ 
                background: `conic-gradient(from 0deg, #B02E2B ${uiState.progress * 3.6}deg, transparent ${uiState.progress * 3.6}deg)`,
                width: '200px',
                height: '200px'
              }}></div>
              
              {/* Inner white circle */}
              <div className="relative bg-white rounded-full flex items-center justify-center shadow-2xl" style={{ width: '180px', height: '180px', margin: '10px' }}>
                <div className="text-center">
                  <p className={`text-4xl font-bold mb-1 ${spaceGrotesk.className}`} style={{ color: '#B02E2B' }}>
                    {uiState.progress}%
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {STAGE_LABELS[uiState.stage] || "Processing"}
                  </p>
                </div>
              </div>
            </div>

            {/* Animated status message */}
            <div className="mt-8 h-12 flex items-center">
              <p className="text-gray-600 text-center animate-pulse px-6 py-2 bg-gray-50 rounded-full">
                {currentStatusMessage || uiState.message}
              </p>
            </div>
          </div>
        )}

        {/* Failed State */}
        {uiState.type === "failed" && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-red-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className={`text-xl font-bold text-gray-900 mb-2 ${spaceGrotesk.className}`}>
                  Analysis Failed
                </h2>
                <p className="text-red-700">{uiState.error}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {uiState.retryable && (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#B02E2B' }}
                >
                  Retry
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Try Another Video
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {uiState.type === "completed" && uiState.result && (
          <div className="space-y-6 animate-fade-in">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Analysis Complete</span>
              </div>
              <button
                onClick={handleReset}
                className="ml-4 px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#B02E2B' }}
              >
                Analyze Another Video
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                  <h3 className={`font-bold text-green-900 text-lg ${spaceGrotesk.className}`}>Positive</h3>
                </div>
                <p className={`text-5xl font-bold text-green-700 mb-2 ${spaceGrotesk.className}`}>
                  {uiState.result.summary.positive.percentage}%
                </p>
                <p className="text-sm text-green-600">
                  {uiState.result.summary.positive.count} comments
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Minus className="w-7 h-7 text-gray-600" />
                  <h3 className={`font-bold text-gray-900 text-lg ${spaceGrotesk.className}`}>Neutral</h3>
                </div>
                <p className={`text-5xl font-bold text-gray-700 mb-2 ${spaceGrotesk.className}`}>
                  {uiState.result.summary.neutral.percentage}%
                </p>
                <p className="text-sm text-gray-600">
                  {uiState.result.summary.neutral.count} comments
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingDown className="w-7 h-7 text-red-600" />
                  <h3 className={`font-bold text-red-900 text-lg ${spaceGrotesk.className}`}>Negative</h3>
                </div>
                <p className={`text-5xl font-bold text-red-700 mb-2 ${spaceGrotesk.className}`}>
                  {uiState.result.summary.negative.percentage}%
                </p>
                <p className="text-sm text-red-600">
                  {uiState.result.summary.negative.count} comments
                </p>
              </div>
            </div>

            {/* Things Loved */}
            {uiState.result.thingsLoved.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6" style={{ color: '#B02E2B' }} />
                  <h2 className={`text-2xl font-bold text-gray-900 ${spaceGrotesk.className}`}>
                    What Viewers Loved
                  </h2>
                </div>
                <div className="space-y-4">
                  {uiState.result.thingsLoved.map((item, idx) => (
                    <div key={idx} className="border-l-4 bg-green-50 p-5 rounded-r-xl" style={{ borderColor: '#B02E2B' }}>
                      <h3 className={`font-bold text-gray-900 mb-2 text-lg ${spaceGrotesk.className}`}>
                        {item.aspect}
                      </h3>
                      <p className="text-gray-700 mb-3">{item.reason}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-3 py-1 bg-white rounded-full font-semibold" style={{ color: '#B02E2B' }}>
                          {item.mention_count} mentions
                        </span>
                        {item.example_comments.length > 0 && (
                          <details className="cursor-pointer">
                            <summary className="font-medium text-gray-600 hover:text-gray-800">
                              View examples
                            </summary>
                            <div className="mt-3 space-y-2 pl-4">
                              {item.example_comments.slice(0, 3).map((comment, cidx) => (
                                <p key={cidx} className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
                                  "{comment.substring(0, 120)}..."
                                </p>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emotions */}
            {uiState.result.emotions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6" style={{ color: '#B02E2B' }} />
                  <h2 className={`text-2xl font-bold text-gray-900 ${spaceGrotesk.className}`}>
                    Emotional Analysis
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiState.result.emotions.map((emotion, idx) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className={`font-bold text-gray-900 ${spaceGrotesk.className}`}>
                          {emotion.emotion}
                        </h3>
                        <span className="text-xl font-bold" style={{ color: '#B02E2B' }}>
                          {emotion.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${emotion.percentage}%`,
                            backgroundColor: '#B02E2B'
                          }}
                        />
                      </div>
                      <details className="text-sm">
                        <summary className="cursor-pointer font-semibold text-gray-600 hover:text-gray-800">
                          View triggers
                        </summary>
                        <ul className="mt-3 space-y-1 text-gray-600">
                          {emotion.triggers.map((trigger, tidx) => (
                            <li key={tidx} className="text-xs pl-3 border-l-2" style={{ borderColor: '#B02E2B' }}>
                              {trigger}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}
              {/* Improvements */}
            {uiState.result.improvements.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-6 h-6" style={{ color: '#B02E2B' }} />
                  <h2 className={`text-2xl font-bold text-gray-900 ${spaceGrotesk.className}`}>
                    Areas for Improvement
                  </h2>
                </div>
                <div className="space-y-4">
                  {uiState.result.improvements.map((item, idx) => (
                    <div key={idx} className={`p-5 rounded-xl ${getSeverityColor(item.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold text-gray-900 text-lg ${spaceGrotesk.className}`}>
                          {item.issue}
                        </h3>
                        <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-white">
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{item.suggestion}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold" style={{ color: '#B02E2B' }}>
                          {item.mention_count} mentions
                        </span>
                        {item.example_comments && item.example_comments.length > 0 && (
                          <details className="cursor-pointer">
                            <summary className="text-sm font-medium text-gray-600 hover:text-gray-800">
                              View examples
                            </summary>
                            <div className="mt-3 space-y-2 pl-4">
                              {item.example_comments.slice(0, 3).map((comment, cidx) => (
                                <p key={cidx} className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
                                  "{comment.substring(0, 120)}..."
                                </p>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
        ))}
                </div>
              </div>
            )}

            {/* Stats Footer */}
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-6 border-2" style={{ borderColor: '#B02E2B20' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Comments</p>
                  <p className={`text-3xl font-bold ${spaceGrotesk.className}`} style={{ color: '#B02E2B' }}>
                    {uiState.result.totalProcessed}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Processing Time</p>
                  <p className={`text-3xl font-bold ${spaceGrotesk.className}`} style={{ color: '#B02E2B' }}>
                    {uiState.result.processingTime}s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transcript</p>
                  <p className={`text-3xl font-bold ${spaceGrotesk.className}`} style={{ color: '#B02E2B' }}>
                    {uiState.result.hasTranscript ? "✓" : "✗"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job ID</p>
                  <p className="text-xs font-mono text-gray-700 mt-2 break-all">
                    {uiState.result.jobId.slice(0, 12)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}