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
} from "lucide-react";

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
  optimalLength: string;
  hookStrategy: string;
  contentStructure: string;
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
  { name: string; icon: string; color: string }
> = {
  competition: { name: "Competition", icon: "🏆", color: "blue" },
  audience: { name: "Audience", icon: "👥", color: "purple" },
  trend: { name: "Trends", icon: "📈", color: "green" },
  strategy: { name: "Strategy", icon: "🎯", color: "orange" },
};

// ========================================
// MAIN COMPONENT
// ========================================

export default function VideoIdeaValidatorPage() {
  const [idea, setIdea] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [uiState, setUiState] = useState<UIState>({ type: "idle" });

  // ========================================
  // STREAMING HANDLER
  // ========================================

  const handleSubmit = async () => {
    if (!idea.trim() || !targetAudience.trim() || !goal.trim()) {
      setUiState({
        type: "failed",
        error: "Please fill in all fields",
        retryable: false,
      });
      return;
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
                setUiState({
                  type: "completed",
                  result: data.data.data,
                });
              } else {
                setUiState({
                  type: "failed",
                  error: data.data.error || "Validation failed",
                  retryable: true,
                });
              }
            }
          } catch (parseError) {
            console.error("Failed to parse stream message:", line, parseError);
          }
        }
      }
    } catch (err: any) {
      console.error("❌ Submission error:", err);
      setUiState({
        type: "failed",
        error: err.message || "An unexpected error occurred",
        retryable: true,
      });
    }
  };

  const handleReset = () => {
    setUiState({ type: "idle" });
    setIdea("");
    setTargetAudience("");
    setGoal("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-50 to-green-100 border-green-200";
    if (score >= 60) return "from-yellow-50 to-yellow-100 border-yellow-200";
    return "from-red-50 to-red-100 border-red-200";
  };

  const getAgentStatusColor = (status: "idle" | "running" | "completed") => {
    if (status === "completed")
      return "bg-green-100 border-green-300 text-green-700";
    if (status === "running")
      return "bg-blue-100 border-blue-300 text-blue-700 animate-pulse";
    return "bg-gray-100 border-gray-300 text-gray-500";
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case "success":
        return "✅";
      case "error":
        return "❌";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-purple-700">
            Video Idea Validator
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered analysis of your YouTube video concepts
          </p>
        </div>

        {/* Input Section */}
        {uiState.type !== "completed" && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Video Idea
                  </label>
                  <input
                    type="text"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="e.g., How to build a passive income stream with AI"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    disabled={uiState.type !== "idle"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Tech-savvy entrepreneurs aged 25-40"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    disabled={uiState.type !== "idle"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Goal
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Reach 100K views in first month"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    disabled={uiState.type !== "idle"}
                  />
                </div>

                {uiState.type === "idle" && (
                  <button
                    onClick={handleSubmit}
                    className="w-full px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md text-lg"
                  >
                    Validate Idea
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Processing State */}
        {uiState.type === "processing" && (
          <div className="space-y-6">
            {/* Progress Circle */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, #9333ea ${
                      uiState.progress * 3.6
                    }deg, #e9d5ff ${uiState.progress * 3.6}deg)`,
                    width: "160px",
                    height: "160px",
                  }}
                ></div>

                <div
                  className="relative bg-white rounded-full flex items-center justify-center shadow-lg"
                  style={{ width: "140px", height: "140px", margin: "10px" }}
                >
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-1 text-purple-600">
                      {uiState.progress}%
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Processing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(AGENT_LABELS).map(([key, config]) => {
                const status = uiState.agentStatuses[key as keyof AgentStatus];
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 transition-all ${getAgentStatusColor(
                      status
                    )}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{config.icon}</span>
                      {status === "running" && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {status === "completed" && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <p className="font-semibold text-sm">{config.name}</p>
                    <p className="text-xs capitalize mt-1">
                      {status === "idle" ? "Waiting" : status}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Live Logs */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                Live Progress
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uiState.logs.length === 0 ? (
                  <p className="text-gray-500 text-sm">Initializing...</p>
                ) : (
                  uiState.logs.slice(-20).map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-sm ${getLogColor(
                        log.level
                      )}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base">
                          {getLogIcon(log.level)}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{log.message}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Validation Failed
                </h2>
                <p className="text-red-700">{uiState.error}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {uiState.retryable && (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Retry
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Try Another Idea
              </button>
            </div>
          </div>
        )}

        {/* Results - Keep all your existing result rendering code */}
        {uiState.type === "completed" && uiState.result && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Validation Complete</span>
              </div>
              <button
                onClick={handleReset}
                className="ml-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Validate Another Idea
              </button>
            </div>

            {/* Score Card */}
            <div
              className={`bg-gradient-to-br ${getScoreGradient(
                uiState.result.score
              )} border-2 rounded-xl p-8 shadow-lg`}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Overall Potential Score
                </h2>
                <div
                  className={`text-7xl font-bold mb-4 ${getScoreColor(
                    uiState.result.score
                  )}`}
                >
                  {uiState.result.score}/100
                </div>
                <p className="text-gray-700 text-lg max-w-3xl mx-auto">
                  {uiState.result.verdict}
                </p>
              </div>
            </div>

            {/* Title Suggestions */}
            {uiState.result.titles.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Suggested Titles
                  </h2>
                </div>
                <div className="space-y-3">
                  {uiState.result.titles.map((title, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600"
                    >
                      <p className="text-gray-900 font-medium">{title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unique Angles */}
            {uiState.result.angles.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Unique Angles
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiState.result.angles.map((angle, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200"
                    >
                      <p className="text-gray-900">{angle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competition Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Competition Analysis
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Saturation</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        uiState.result.competitionAnalysis.competitionBreakdown
                          .saturationScore
                      }
                      %
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Entry Barrier</p>
                    <p className="text-lg font-bold text-gray-900">
                      {
                        uiState.result.competitionAnalysis.competitionBreakdown
                          .entryBarrier
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Big Creators</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        uiState.result.competitionAnalysis.competitionBreakdown
                          .bigCreators
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Market Gaps</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {uiState.result.competitionAnalysis.marketGaps.length}
                    </p>
                  </div>
                </div>

                {uiState.result.competitionAnalysis.marketGaps.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-900 mb-3">
                      Market Gaps:
                    </h3>
                    <ul className="space-y-2">
                      {uiState.result.competitionAnalysis.marketGaps.map(
                        (gap, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span className="text-gray-700">{gap}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Audience Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Audience Insights
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-red-600">⚠️</span> Pain Points
                  </h3>
                  <ul className="space-y-2">
                    {uiState.result.audienceAnalysis.audienceInsights.painPoints.map(
                      (point, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">
                          • {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-green-600">✨</span> Desires
                  </h3>
                  <ul className="space-y-2">
                    {uiState.result.audienceAnalysis.audienceInsights.desires.map(
                      (desire, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">
                          • {desire}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Relatability Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{
                        width: `${
                          uiState.result.audienceAnalysis.audienceInsights
                            .relatabilityScore * 10
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xl font-bold text-purple-600">
                    {
                      uiState.result.audienceAnalysis.audienceInsights
                        .relatabilityScore
                    }
                    /10
                  </span>
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Trend Analysis
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Trend Direction</p>
                  <p className="text-xl font-bold text-purple-600">
                    {uiState.result.trendAnalysis.youtubeMetrics.trendDirection}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Virality Potential
                  </p>
                  <p className="text-xl font-bold text-purple-600">
                    {
                      uiState.result.trendAnalysis.youtubeMetrics
                        .viralityPotential
                    }
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Search Volume</p>
                  <p className="text-xl font-bold text-purple-600">
                    {uiState.result.trendAnalysis.youtubeMetrics.searchVolume}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Best Timing:</h3>
                <p className="text-gray-700">
                  {uiState.result.trendAnalysis.bestTimingWindow}
                </p>
              </div>
            </div>
            {/* Improvements */}
            {uiState.result.improvements.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recommended Improvements
                  </h2>
                </div>
                <div className="space-y-3">
                  {uiState.result.improvements.map((improvement, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"
                    >
                      <p className="text-gray-900">{improvement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reference Videos */}
            {uiState.result.referenceVideos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Video className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Reference Videos
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiState.result.referenceVideos.map((video, idx) => (
                    <div
                      key={idx}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 flex-1 line-clamp-2">
                          {video.title}
                        </h3>
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </a>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Channel:</span>{" "}
                          {video.channel}
                        </p>
                        <p>
                          <span className="font-semibold">Views:</span>{" "}
                          {video.views}
                        </p>
                        <p>
                          <span className="font-semibold">Uploaded:</span>{" "}
                          {video.uploadDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Strategy Recommendations
                </h2>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Optimal Length
                    </h3>
                    <p className="text-gray-700">
                      {
                        uiState.result.strategyRecommendations.contentStrategy
                          .optimalLength
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Hook Strategy
                    </h3>
                    <p className="text-gray-700">
                      {
                        uiState.result.strategyRecommendations.contentStrategy
                          .hookStrategy
                      }
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Content Structure
                  </h3>
                  <p className="text-gray-700">
                    {
                      uiState.result.strategyRecommendations.contentStrategy
                        .contentStructure
                    }
                  </p>
                </div>

                {uiState.result.strategyRecommendations.contentStrategy
                  .uniqueAngles.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">
                      Unique Angles to Explore:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {uiState.result.strategyRecommendations.contentStrategy.uniqueAngles.map(
                        (angle, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200"
                          >
                            <p className="text-gray-900 text-sm">{angle}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {uiState.result.strategyRecommendations.titleFormulas.length >
                  0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">
                      Title Formulas:
                    </h3>
                    <div className="space-y-2">
                      {uiState.result.strategyRecommendations.titleFormulas.map(
                        (formula, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500"
                          >
                            <p className="text-gray-900 text-sm">{formula}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Thumbnail Guidance
                  </h3>
                  <p className="text-gray-700">
                    {uiState.result.strategyRecommendations.thumbnailGuidance}
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Series Potential
                  </h3>
                  <p className="text-gray-700">
                    {uiState.result.strategyRecommendations.seriesPotential}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {uiState.result.metadata && (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-4">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Processing Time: {uiState.result.metadata.processingTime}s
                  </span>
                  <span>•</span>
                  <span>
                    Generated:{" "}
                    {new Date(
                      uiState.result.metadata.timestamp
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


