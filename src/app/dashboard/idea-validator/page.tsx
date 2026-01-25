"use client";
import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  Trophy,
  BarChart3,
  Clock,
  Video,
  ExternalLink,
  Loader2,
  Zap,
  Brain,
  Rocket,
  Star,
  Crown,
  TrendingDown,
  PlayCircle,
  Filter,
  PieChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Space_Grotesk, Outfit } from "next/font/google";
import { useRateLimit } from "@/hooks/useRateLimit";
import { RateLimitIndicator } from "@/components/RateLimitIndicator";
import { validateIdea, RateLimitError } from "@/lib/api";
import { Toast, useToast } from "@/components/RateLimitToast";


const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

// Multi-step loader component
const MultiStepLoader = ({
  loading,
  loadingText = "Initializing...",
  progress = 0,
  logs = []
}: {
  loading?: boolean;
  loadingText?: string;
  progress?: number;
  logs?: any[];
}) => {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full flex flex-col items-center justify-center py-20"
        >
          <div className="relative w-full max-w-2xl space-y-8 text-center">
            
            {/* Text Animation with Smooth Fade */}
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black border border-neutral-800 rounded-full mb-4 shadow-sm">
                  <Loader2 className="w-3 h-3 text-[#B02E2B] animate-spin" />
                  <span className="text-xs text-neutral-400 font-mono tracking-widest uppercase">
                     AI System Active
                  </span>
               </div>

               <AnimatePresence mode="wait">
                 <motion.h3 
                    key={loadingText}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1]
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: -20,
                      filter: "blur(10px)",
                      transition: {
                        duration: 0.3,
                        ease: [0.23, 1, 0.32, 1]
                      }
                    }}
                    className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-white to-neutral-400 leading-tight"
                 >
                   {loadingText}
                 </motion.h3>
               </AnimatePresence>
            </div>

            {/* Progress Bar with Enhanced Design */}
            <div className="w-full space-y-2 px-4">
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 h-2 bg-gradient-to-r from-[#E55A52]/20 via-[#C83E3A]/20 to-[#B02E2B]/20 rounded-full blur-sm"></div>
                
                {/* Progress track */}
                <div className="relative h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#E55A52] via-[#C83E3A] to-[#B02E2B] shadow-[0_0_15px_rgba(176,46,43,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                  />
                </div>
                
                {/* Progress indicators */}
                <div className="flex justify-between text-xs font-mono text-neutral-400 mt-2">
                  <span className="px-2 py-1 bg-black border border-neutral-800 rounded">
                    AI_PROCESS_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                  </span>
                  <span className="px-2 py-1 bg-black border border-neutral-800 rounded">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Live Streaming Logs */}
            <div className="bg-black/50 border border-neutral-800 rounded-2xl backdrop-blur-sm overflow-hidden">
              {/* Log Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#B02E2B] animate-pulse"></div>
                  <h4 className="text-sm font-medium text-white">Live Analysis Stream</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-mono">Real-time</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              </div>

              {/* Log Content */}
              <div className="max-h-64 overflow-y-auto font-mono">
                {logs.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center gap-2 text-neutral-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initializing analysis pipeline...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 p-4">
                    {logs.slice(-10).map((log, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-lg text-sm transition-all border-l-2 ${
                          log.level === "error" 
                            ? "bg-red-500/5 border-red-500 text-red-300" 
                            : log.level === "success"
                            ? "bg-green-500/5 border-green-500 text-green-300"
                            : log.level === "warning"
                            ? "bg-yellow-500/5 border-yellow-500 text-yellow-300"
                            : "bg-blue-500/5 border-blue-500 text-blue-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {log.level === "success" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : log.level === "error" ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : log.level === "warning" ? (
                              <span className="text-yellow-300">⚠</span>
                            ) : (
                              <span className="text-blue-300">ℹ</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{log.message}</p>
                            <p className="text-xs opacity-75 mt-1">
                              [{new Date(log.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                second: '2-digit' 
                              })}]
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// ========================================
// TYPES
// ========================================

interface StreamLog {
  type: "log";
  level: "info" | "success" | "error" | "warning";
  message: string;
  timestamp: string;
}

interface StreamAgentStatus {
  type: "agent_status";
  agent: string;
  status: "started" | "completed" | "error";
  data?: any;
  timestamp: string;
}

interface StreamProgress {
  type: "progress";
  current: number;
  total: number;
  percentage: number;
  message?: string;
  timestamp: string;
}

interface StreamFinal {
  type: "final";
  data: {
    success: boolean;
    data?: ValidationResult;
    error?: string;
  };
  timestamp: string;
}

type StreamMessage =
  | StreamLog
  | StreamAgentStatus
  | StreamProgress
  | StreamFinal;

interface ReferenceVideo {
  title: string;
  videoId: string;
  link: string;
  channel: string;
  views: string;
  uploadDate: string;
}

interface CompetitionBreakdown {
  bigCreators: number;
  mediumCreators: number;
  smallCreators: number;
  saturationScore: number;
  entryBarrier: string;
  dominantFormats: string[];
}

interface CompetitionAnalysis {
  competitionBreakdown: CompetitionBreakdown;
  marketGaps: string[];
  topCompetitors: string[];
  qualityBenchmark: string;
}

interface AudienceInsights {
  painPoints: string[];
  desires: string[];
  commonQuestions: string[];
  relatabilityScore: number;
}

interface AudienceAnalysis {
  audienceInsights: AudienceInsights;
  targetDemographics: string;
  viewerIntent: string;
  emotionalTriggers: string[];
}

interface YouTubeMetrics {
  searchVolume: string;
  trendDirection: string;
  seasonality: string;
  avgEngagementRate: string;
  viralityPotential: string;
}

interface TrendAnalysis {
  youtubeMetrics: YouTubeMetrics;
  trendingKeywords: string[];
  bestTimingWindow: string;
  futureOutlook: string;
}

interface ContentStrategy {
  optimalVideoLength: string;  // Changed from optimalLength
  hookStrategy: string;
  contentStructure: string | string[];  // API returns array, you have string
  uniqueAngles: string[];
}

interface StrategyRecommendations {
  contentStrategy: ContentStrategy;
  titleFormulas: string[];
  thumbnailGuidance: string;
  seriesPotential: string;
}

interface ValidationResult {
  verdict: string;
  score: number;
  competitionAnalysis: CompetitionAnalysis;
  audienceAnalysis: AudienceAnalysis;
  trendAnalysis: TrendAnalysis;
  strategyRecommendations: StrategyRecommendations;
  improvements: string[];
  titles: string[];
  angles: string[];
  referenceVideos: ReferenceVideo[];
  metadata?: {
    processingTime: string;
    timestamp: string;
  };
}

interface AgentStatus {
  competition: "idle" | "running" | "completed";
  audience: "idle" | "running" | "completed";
  trend: "idle" | "running" | "completed";
  strategy: "idle" | "running" | "completed";
}

type UIState =
  | { type: "idle" }
  | {
      type: "processing";
      progress: number;
      logs: StreamLog[];
      agentStatuses: AgentStatus;
    }
  | { type: "completed"; result: ValidationResult }
  | { type: "failed"; error: string; retryable: boolean };

// ========================================
// CONSTANTS
// ========================================

const API_URL = "http://localhost:5000/api";

const AGENT_LABELS: Record<
  keyof AgentStatus,
  { name: string; icon: React.ReactNode; color: string }
> = {
  competition: { 
    name: "Competition", 
    icon: <Crown className="w-5 h-5" />, 
    color: "#E55A52" 
  },
  audience: { 
    name: "Audience", 
    icon: <Users className="w-5 h-5" />, 
    color: "#C83E3A" 
  },
  trend: { 
    name: "Trends", 
    icon: <TrendingUp className="w-5 h-5" />, 
    color: "#B02E2B" 
  },
  strategy: { 
    name: "Strategy", 
    icon: <Target className="w-5 h-5" />, 
    color: "#E55A52" 
  },
};

// ========================================
// MAIN COMPONENT
// ========================================

export default function VideoIdeaValidatorPage() {
  const [idea, setIdea] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [uiState, setUiState] = useState<UIState>({ type: "idle" });
  
  // Rate limit hooks
  const { rateLimitInfo, updateRateLimit } = useRateLimit("idea-validator");
  const { showError, showWarning, showSuccess, toasts, removeToast } = useToast();

  // ========================================
  // STREAMING HANDLER
  // ========================================

 
 const handleSubmit = async () => {
  // Validate inputs
  if (!idea.trim() || !targetAudience.trim() || !goal.trim()) {
    setUiState({
      type: "failed",
      error: "Please fill in all fields",
      retryable: false,
    });
    showError("Please fill in all fields");
    return;
  }

  // ✅ NEW: Check rate limit BEFORE processing
  if (rateLimitInfo.isLimited) {
    showError("Daily limit reached! Come back tomorrow for more validations.");
    setUiState({
      type: "failed",
      error: "Daily limit reached. Please try again tomorrow.",
      retryable: false,
    });
    return;
  }

  // ✅ NEW: Warn user on last use
  if (rateLimitInfo.remaining === 1) {
    showWarning("This is your last free validation today. Make it count!");
  }

  setUiState({
    type: "processing",
    progress: 0,
    logs: [],
    agentStatuses: {
      competition: "idle",
      audience: "idle",
      trend: "idle",
      strategy: "idle",
    },
  });

  try {
    const response = await fetch(`${API_URL}/validate-idea`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, targetAudience, goal }),
    });

    // ✅ UPDATED: Handle 429 rate limit response
    if (response.status === 429) {
      const errorData = await response.json();
      
      // Update rate limit info from headers
      updateRateLimit(response.headers);
      
      throw new RateLimitError(
        errorData.message || "Daily limit reached. Try again tomorrow!",
        parseInt(response.headers.get('Retry-After') || '0', 10),
        response.headers.get('X-RateLimit-Reset') || new Date().toISOString(),
        parseInt(response.headers.get('X-RateLimit-Limit') || '2', 10),
        parseInt(response.headers.get('X-RateLimit-Remaining') || '0', 10)
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // ✅ NEW: Update rate limit info from successful response headers
    updateRateLimit(response.headers);

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data: StreamMessage = JSON.parse(line);

          // Update UI based on message type
          if (data.type === "log") {
            setUiState((prev) => {
              if (prev.type !== "processing") return prev;
              return {
                ...prev,
                logs: [...prev.logs, data],
              };
            });
          } else if (data.type === "agent_status") {
            setUiState((prev) => {
              if (prev.type !== "processing") return prev;
              const newStatuses = { ...prev.agentStatuses };
              const agent = data.agent as keyof AgentStatus;

              if (data.status === "started") {
                newStatuses[agent] = "running";
              } else if (data.status === "completed") {
                newStatuses[agent] = "completed";
              }

              return {
                ...prev,
                agentStatuses: newStatuses,
              };
            });
          } else if (data.type === "progress") {
            setUiState((prev) => {
              if (prev.type !== "processing") return prev;
              return {
                ...prev,
                progress: data.percentage,
              };
            });
          } else if (data.type === "final") {
            if (data.data.success && data.data.data) {
              // Directly use API data since interface now matches
              const result = {
                ...data.data.data,
                // Ensure all fields exist with defaults
                strategyRecommendations: {
                  ...data.data.data.strategyRecommendations,
                  contentStrategy: {
                    optimalVideoLength: data.data.data.strategyRecommendations?.contentStrategy?.optimalVideoLength || 
                                      "15-20 minutes",
                    hookStrategy: data.data.data.strategyRecommendations?.contentStrategy?.hookStrategy || 
                                 "Start with a compelling question",
                    contentStructure: data.data.data.strategyRecommendations?.contentStrategy?.contentStructure || 
                                    ["Introduction", "Main Content", "Conclusion"],
                    uniqueAngles: data.data.data.strategyRecommendations?.contentStrategy?.uniqueAngles || 
                                 ["Focus on practical applications"]
                  },
                  titleFormulas: data.data.data.strategyRecommendations?.titleFormulas || 
                                ["How to [Achieve Result] in [Timeframe]", "The Ultimate Guide to [Topic]"],
                  thumbnailGuidance: data.data.data.strategyRecommendations?.thumbnailGuidance || 
                                   "Use bold text, contrasting colors, and human faces",
                  seriesPotential: data.data.data.strategyRecommendations?.seriesPotential || 
                                 "High potential for a multi-part series"
                }
              };
              
              setUiState({
                type: "completed",
                result: result,
              });
              showSuccess("Idea validation completed successfully!");
            } else {
              setUiState({
                type: "failed",
                error: data.data.error || "Validation failed",
                retryable: true,
              });
              showError(data.data.error || "Validation failed");
            }
          }
        } catch (parseError) {
          console.error("Failed to parse stream message:", line, parseError);
        }
      }
    }
  } catch (err: any) {
    console.error("❌ Submission error:", err);
    
    // ✅ UPDATED: Better rate limit error handling
    if (err instanceof RateLimitError) {
      updateRateLimit(new Headers({
        'X-RateLimit-Limit': err.limit.toString(),
        'X-RateLimit-Remaining': err.remaining.toString(),
        'X-RateLimit-Reset': err.resetAt,
      }));
      
      setUiState({
        type: "failed",
        error: err.message,
        retryable: false,
      });
      showError(err.message);
    } else {
      setUiState({
        type: "failed",
        error: err.message || "An unexpected error occurred",
        retryable: true,
      });
      showError(err.message || "An unexpected error occurred");
    }
  }
};

  const handleReset = () => {
    setUiState({ type: "idle" });
    setIdea("");
    setTargetAudience("");
    setGoal("");
    showInfo("Reset form");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-50 to-green-100 border-green-200";
    if (score >= 60) return "from-yellow-50 to-yellow-100 border-yellow-200";
    return "from-red-50 to-red-100 border-red-200";
  };

  const getLoadingText = (progress: number) => {
    if (progress < 25) return "Initializing analysis engine...";
    if (progress < 50) return "Analyzing competition landscape...";
    if (progress < 75) return "Evaluating audience potential...";
    if (progress < 90) return "Generating strategic insights...";
    return "Finalizing results...";
  };

  const getAgentStatusColor = (status: "idle" | "running" | "completed") => {
    if (status === "completed")
      return "bg-green-100 border-green-300 text-green-700";
    if (status === "running")
      return "bg-[#E55A52]/10 border-[#E55A52] text-[#E55A52] animate-pulse";
    return "bg-gray-100 border-gray-300 text-gray-500";
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle2 className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case "success":
        return "text-green-700 bg-green-50 border-green-200";
      case "error":
        return "text-red-700 bg-red-50 border-red-200";
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      default:
        return "text-blue-700 bg-blue-50 border-blue-200";
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
     
      <div className="max-w-6xl mx-auto">
 {/* ✅  TOAST CONTAINER */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

       
        
        {/* Header with artistic elements */}
        <div className=" text-center mb-12 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
            <div className="w-32 h-32 bg-gradient-to-r from-[#E55A52] via-[#C83E3A] to-[#B02E2B] rounded-full blur-3xl opacity-20"></div>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-[#B02E2B]/10  rounded-xl">
              <Brain className="w-8 h-8 text-[#B02E2B]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#B02E2B] via-[#C83E3A] to-[#B02E2B] bg-clip-text text-transparent">
              Video Idea Validator
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AI-powered analysis of your YouTube video concepts with deep insights and strategic recommendations
          </p>
        </div>

        {/* ✅  RATE LIMIT INDICATOR */}
      {uiState.type === "idle" && (
        <RateLimitIndicator 
          featureName="idea-validator" 
          displayName="Idea Validation"
        />
      )}

        {/* Input Section */}
        {uiState.type !== "completed" && (
          <div className="mb-8">
            <div className="bg-black rounded-2xl shadow-2xl p-8 border border-neutral-800 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-[#E55A52]" />
                <h2 className="text-2xl font-bold text-white">Video Concept Details</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Video Idea
                  </label>
                  <input
                    type="text"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="e.g., How to build a passive income stream with AI"
                    className="w-full px-5 py-4 bg-[#0f0f0f] border-2 border-neutral-900 rounded-xl focus:border-[#E55A52] focus:ring-2 focus:ring-[#E55A52]/30 outline-none transition-all text-white placeholder-gray-500"
                    disabled={uiState.type !== "idle"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Tech-savvy entrepreneurs aged 25-40"
                    className="w-full px-5 py-4 bg-[#0f0f0f] border-2 border-neutral-900 rounded-xl focus:border-[#C83E3A] focus:ring-2 focus:ring-[#C83E3A]/30 outline-none transition-all text-white placeholder-gray-500"
                    disabled={uiState.type !== "idle"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Goal
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Reach 100K views in first month"
                    className="w-full px-5 py-4 bg-[#0f0f0f] border-2 border-neutral-900 rounded-xl focus:border-[#B02E2B] focus:ring-2 focus:ring-[#B02E2B]/30 outline-none transition-all text-white placeholder-gray-500"
                    disabled={uiState.type !== "idle"}
                  />
                </div>

              {uiState.type === "idle" && (
  <button
    onClick={handleSubmit}
    disabled={rateLimitInfo.isLimited}
    className={`w-full px-8 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 group transition-all shadow-lg ${
      rateLimitInfo.isLimited
        ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
        : 'bg-[#B02E2B] hover:opacity-90 text-white hover:shadow-xl hover:shadow-[#E55A52]/20'
    }`}
  >
    {rateLimitInfo.isLimited ? (
      <>Limit Reached</>
    ) : (
      <>
        <Rocket className="w-5 h-5 group-hover:animate-bounce" />
        Validate Idea
      </>
    )}
  </button>
)}
              </div>
            </div>
          </div>
        )}

    
        {/* Multi-Step Loader for Processing State */}
        {uiState.type === "processing" && (
          <div className="space-y-8">
            <MultiStepLoader 
              loading={true}
              loadingText={getLoadingText(uiState.progress)}
              progress={uiState.progress}
              logs={uiState.logs}
            />

           
          </div>
        )}

        {/* Failed State */}
        {uiState.type === "failed" && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 mb-8 border border-red-500/20">
            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-2xl">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">Validation Failed</h2>
                <p className="text-red-300 text-lg">{uiState.error}</p>
              </div>
            </div>
            <div className="flex gap-4">
                {uiState.retryable && (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-linear-to-r from-[#E55A52] to-[#C83E3A] text-white rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  Retry Analysis
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {uiState.type === "completed" && uiState.result && (
          <div className="space-y-8">
            {/* Success Header */}
           <div className="flex items-center justify-center gap-6 mb-8">
  {/* Status Badge */}
  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/10 to-green-600/5 text-green-400 rounded-full border border-green-500/20">
    <CheckCircle2 className="w-6 h-6" />
    <span className="font-bold">Analysis Complete</span>
    <Star className="w-5 h-5" />
  </div>

  {/* Action Button */}
  <button
    onClick={handleReset}
    className="px-8 py-3 bg-linear-to-r from-[#B02E2B] to-[#B02E2B] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-[#E55A52]/20"
  >
    Validate Another Idea
  </button>
</div>

           {/* Score Card - Artistic Design */}
<div className="relative overflow-hidden rounded-3xl shadow-2xl">
  {/* Background gradient with animated effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#B02E2B]/15 via-black/95 to-[#B02E2B]/10"></div>
  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-[#B02E2B]/25 to-transparent rounded-full blur-3xl opacity-60"></div>
  <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-[#B02E2B]/10 to-transparent rounded-full blur-3xl opacity-40"></div>
  
  {/* Subtle grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
  
  {/* Content */}
  <div className="relative p-8 border border-neutral-800/50 rounded-3xl backdrop-blur-md bg-gradient-to-b from-black/40 to-black/20">
    <div className="text-center">
      {/* Header with refined styling */}
      <div className="inline-flex items-center gap-4 mb-10 px-6 py-4 bg-gradient-to-r from-black/50 to-black/30 rounded-2xl border border-neutral-800/50">
        <div className="p-3 bg-gradient-to-br from-[#B02E2B]/20 to-[#B02E2B]/5 rounded-xl backdrop-blur-sm">
          <Trophy className="w-7 h-7 text-[#B02E2B]" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Overall Potential Score
        </h2>
      </div>
      
      {/* Score ring with enhanced design */}
      <div className="relative inline-block mb-10">
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full blur-xl opacity-50" 
            style={{ backgroundColor: getScoreColor(uiState.result.score) + '20' }}>
          </div>
          
          {/* Score ring */}
          <div
            className="rounded-full p-3"
            style={{
              background: `conic-gradient(from 0deg, 
                ${getScoreColor(uiState.result.score)} 0deg, 
                ${getScoreColor(uiState.result.score)}90 ${(uiState.result.score / 100) * 360}deg, 
                rgba(55, 65, 81, 0.3) ${(uiState.result.score / 100) * 360}deg)`,
              width: "260px",
              height: "260px",
            }}
          >
            {/* Inner circle with gradient */}
            <div className="rounded-full bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 flex items-center justify-center h-full shadow-2xl">
              <div className="text-center">
                <p 
                  className="text-7xl font-bold mb-3 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent"
                  style={{ 
                    textShadow: `0 0 30px ${getScoreColor(uiState.result.score)}40`,
                  }}
                >
                  {uiState.result.score}
                </p>
                <p className="text-2xl font-medium text-gray-400">out of 100</p>
                
                {/* Score label */}
                <div className="mt-4">
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ 
                      backgroundColor: getScoreColor(uiState.result.score) + '20',
                      color: getScoreColor(uiState.result.score)
                    }}
                  >
                    {uiState.result.score >= 80 ? 'Excellent' : 
                     uiState.result.score >= 60 ? 'Good' : 
                     uiState.result.score >= 40 ? 'Average' : 
                     'Needs Work'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
         </div>
      </div>
      
      {/* Verdict with elegant styling */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed px-6 py-8 bg-gradient-to-b from-black/30 to-transparent rounded-2xl">
          <span className="block mb-2 text-sm font-semibold text-gray-400 tracking-wider uppercase">
            AI Analysis Verdict
          </span>
          {uiState.result.verdict}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
      </div>
    </div>
  </div>
</div>

            {/* Title Suggestions */}
            {uiState.result.titles.length > 0 && (
              <div className="bg-black rounded-2xl shadow-2xl p-8 border border-neutral-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#B02E2B]/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-[#B02E2B]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Suggested Titles</h2>
                    <p className="text-gray-400">AI-generated titles optimized for click-through rates</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiState.result.titles.map((title, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-black rounded-xl border border-neutral-800 hover:border-[#E55A52] transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-[#E55A52]/20 to-[#C83E3A]/20 rounded-lg group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-5 h-5 text-[#E55A52]" />
                        </div>
                        <p className="text-white font-medium flex-1">{title}</p>
                        <span className="px-3 py-1 bg-black rounded-full text-xs text-gray-400">
                          #{idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unique Angles */}
            {uiState.result.angles.length > 0 && (
              <div className="bg-black rounded-2xl shadow-2xl p-8 border border-neutral-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#B02E2B]/10 rounded-xl">
                    <Target className="w-6 h-6 text-[#B02E2B]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Unique Angles</h2>
                    <p className="text-gray-400">Strategic approaches to differentiate your content</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiState.result.angles.map((angle, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-black rounded-xl border border-neutral-800 hover:border-[#C83E3A] transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl text-[#C83E3A] mt-1">•</span>
                        <p className="text-gray-200 flex-1">{angle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competition Analysis */}
            <div className="bg-black rounded-2xl shadow-2xl p-8 border border-neutral-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#B02E2B]/10 rounded-xl">
                  <PieChart className="w-6 h-6 text-[#B02E2B]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Competition Analysis</h2>
                  <p className="text-gray-400">Market landscape and competitive positioning</p>
                </div>
              </div>
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-black rounded-xl border border-neutral-800 text-center">
                    <p className="text-sm text-gray-400 mb-2">Saturation Score</p>
                    <p className="text-3xl font-bold text-[#E55A52]">
                      {uiState.result.competitionAnalysis.competitionBreakdown.saturationScore}%
                    </p>
                  </div>
                  <div className="p-5 bg-black rounded-xl border border-neutral-800 text-center">
                    <p className="text-sm text-gray-400 mb-2">Entry Barrier</p>
                    <p className="text-xl font-bold text-white">
                      {uiState.result.competitionAnalysis.competitionBreakdown.entryBarrier}
                    </p>
                  </div>
                  <div className="p-5 bg-black rounded-xl border border-neutral-800 text-center">
                    <p className="text-sm text-gray-400 mb-2">Big Creators</p>
                    <p className="text-3xl font-bold text-[#C83E3A]">
                      {uiState.result.competitionAnalysis.competitionBreakdown.bigCreators}
                    </p>
                  </div>
                  <div className="p-5 bg-black rounded-xl border border-gray-700 text-center">
                    <p className="text-sm text-gray-400 mb-2">Market Gaps</p>
                    <p className="text-3xl font-bold text-[#B02E2B]">
                      {uiState.result.competitionAnalysis.marketGaps.length}
                    </p>
                  </div>
                </div>

                {/* Market Gaps */}
                {uiState.result.competitionAnalysis.marketGaps.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#E55A52] rounded-full"></span>
                      Identified Market Gaps:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {uiState.result.competitionAnalysis.marketGaps.map(
                        (gap, idx) => (
                          <div key={idx} className="p-4 bg-black rounded-lg border border-neutral-800 hover:border-[#E55A52] transition-all">
                            <div className="flex items-start gap-3">
                              <span className="text-[#E55A52] mt-1">▸</span>
                              <span className="text-gray-300">{gap}</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audience Analysis */}
            <div className="bg-black rounded-2xl shadow-2xl p-8 border border-neutral-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#B02E2B]/10 rounded-xl">
                  <Users className="w-6 h-6 text-[#B02E2B]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Audience Insights</h2>
                  <p className="text-gray-400">Deep understanding of your target viewers</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-black rounded-xl border border-red-500/20">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                     
                      Pain Points
                    </h3>
                    <ul className="space-y-3">
                      {uiState.result.audienceAnalysis.audienceInsights.painPoints.map(
                        (point, idx) => (
                          <li key={idx} className="text-gray-300 flex items-start gap-3">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-xl border border-green-500/20">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-3">
                     
                      Desires
                    </h3>
                    <ul className="space-y-3">
                      {uiState.result.audienceAnalysis.audienceInsights.desires.map(
                        (desire, idx) => (
                          <li key={idx} className="text-gray-300 flex items-start gap-3">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{desire}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Relatability Score */}
                <div className="p-5 bg-black rounded-xl border border-neutral-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Relatability Score</p>
                      <p className="text-2xl font-bold text-white">
                        {uiState.result.audienceAnalysis.audienceInsights.relatabilityScore}/10
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Audience Connection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-black/20  rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#E55A52] to-[#C83E3A] h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${uiState.result.audienceAnalysis.audienceInsights.relatabilityScore * 10}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-black rounded-2xl shadow-2xl p-8 border border-neutral-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#B02E2B]/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-[#B02E2B]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Trend Analysis</h2>
                  <p className="text-gray-400">YouTube trends and timing insights</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-black rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-[#C83E3A]" />
                      <p className="text-sm text-gray-400">Trend Direction</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {uiState.result.trendAnalysis.youtubeMetrics.trendDirection}
                    </p>
                  </div>
                  <div className="p-5 bg-black rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-5 h-5 text-[#E55A52]" />
                      <p className="text-sm text-gray-400">Virality Potential</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {uiState.result.trendAnalysis.youtubeMetrics.viralityPotential}
                    </p>
                  </div>
                  <div className="p-5 bg-black rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Filter className="w-5 h-5 text-[#B02E2B]" />
                      <p className="text-sm text-gray-400">Search Volume</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {uiState.result.trendAnalysis.youtubeMetrics.searchVolume}
                    </p>
                  </div>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-xl border border-blue-500/20">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Best Timing Window
                  </h3>
                  <p className="text-gray-300">
                    {uiState.result.trendAnalysis.bestTimingWindow}
                  </p>
                </div>
              </div>
            </div>

            {/* Improvements */}
            {uiState.result.improvements.length > 0 && (
              <div className="bg-black shadow-2xl p-8 border border-neutral-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#B02E2B]/10 rounded-xl">
                    <Lightbulb className="w-6 h-6 text-[#B02E2B]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Recommended Improvements</h2>
                    <p className="text-gray-400">Actionable insights to enhance your video concept</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiState.result.improvements.map((improvement, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <span className="text-yellow-400 font-bold">{idx + 1}</span>
                        </div>
                        <p className="text-gray-300 flex-1">{improvement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reference Videos */}
            {uiState.result.referenceVideos.length > 0 && (
              <div className="bg-black rounded-2xl shadow-2xl p-8 border border-neutral-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#B02E2B]/10 rounded-xl">
                    <Video className="w-6 h-6 text-[#B02E2B]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Reference Videos</h2>
                    <p className="text-gray-400">Top-performing videos for inspiration</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiState.result.referenceVideos.map((video, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-black rounded-xl border border-neutral-800 hover:border-[#E55A52] transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-[#E55A52] transition-colors">
                            {video.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {video.views}
                            </span>
                            <span className="text-gray-400">
                              {video.uploadDate}
                            </span>
                          </div>
                        </div>
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 p-3 bg-black rounded-lg hover:bg-[#E55A52] transition-all group/link"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover/link:text-white transition-colors" />
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{video.channel}</span>
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                          Reference
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy Recommendations */}
            <div className="bg-black rounded-2xl shadow-2xl p-8 border border-neutral-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#B02E2B]/10 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-[#B02E2B]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Strategy Recommendations</h2>
                  <p className="text-gray-400">Complete execution strategy for success</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-black rounded-xl border border-neutral-800">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#E55A52]" />
                      Optimal Length
                    </h3>
                    <p className="text-gray-300">
                     {uiState.result?.strategyRecommendations?.contentStrategy?.optimalVideoLength || 
     "15-20 minutes"}
                    </p>
                  </div>
                  <div className="p-5 bg-black rounded-xl border border-neutral-800">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-3">
                      <Target className="w-5 h-5 text-[#C83E3A]" />
                      Hook Strategy
                    </h3>
                    <p className="text-gray-300">
                      {uiState.result.strategyRecommendations.contentStrategy.hookStrategy}
                    </p>
                  </div>
                </div>

               <div className="p-5 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-xl border border-purple-500/20">
  <h3 className="font-bold text-white mb-3 flex items-center gap-3">
    <Sparkles className="w-5 h-5 text-purple-400" />
    Content Structure
  </h3>
  <div className="text-gray-300">
    {Array.isArray(uiState.result?.strategyRecommendations?.contentStrategy?.contentStructure) ? (
      <ol className="space-y-2">
        {uiState.result.strategyRecommendations.contentStrategy.contentStructure.map((step, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-purple-400 mr-2 font-bold">{idx + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    ) : (
      <p>{uiState.result?.strategyRecommendations?.contentStrategy?.contentStructure || 
          "Introduction → Main Content → Examples → Conclusion"}</p>
    )}
  </div>
</div>

                {/* Unique Angles */}
                {uiState.result.strategyRecommendations.contentStrategy
                  .uniqueAngles.length > 0 && (
                  <div>
                    <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#B02E2B] rounded-full"></span>
                      Unique Angles to Explore:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {uiState.result.strategyRecommendations.contentStrategy.uniqueAngles.map(
                        (angle, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-black rounded-lg border border-neutral-800 hover:border-[#B02E2B] transition-all"
                          >
                            <p className="text-gray-300 text-sm flex items-start gap-3">
                              <span className="text-[#B02E2B] mt-1">▸</span>
                              <span>{angle}</span>
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Title Formulas */}
                {uiState.result.strategyRecommendations.titleFormulas.length >
                  0 && (
                  <div>
                    <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#C83E3A] rounded-full"></span>
                      Title Formulas:
                    </h3>
                    <div className="space-y-3">
                      {uiState.result.strategyRecommendations.titleFormulas.map(
                        (formula, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-gradient-to-r from-green-500/5 to-green-600/5 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all"
                          >
                            <p className="text-gray-300 text-sm">{formula}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 rounded-xl border border-yellow-500/20">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Thumbnail Guidance
                  </h3>
                  <p className="text-gray-300">
                    {uiState.result.strategyRecommendations.thumbnailGuidance}
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 rounded-xl border border-indigo-500/20">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    Series Potential
                  </h3>
                  <p className="text-gray-300">
                    {uiState.result.strategyRecommendations.seriesPotential}
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