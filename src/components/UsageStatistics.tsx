"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  Zap,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: string | null;
  isLimited: boolean;
}

interface FeatureUsage {
  name: string;
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  usage: RateLimitInfo;
}

const FEATURE_CONFIGS = [
  {
    name: "sentiment-analysis",
    displayName: "Audience Mind-Reader",
    icon: MessageSquare,
    color: "#EF5350",
    gradientFrom: "#EF5350",
    gradientTo: "#B02E2B",
  },
  {
    name: "idea-validator",
    displayName: "Idea Validator",
    icon: CheckCircle,
    color: "#FF6B6B",
    gradientFrom: "#FF6B6B",
    gradientTo: "#EF5350",
  },
  {
    name: "topic-search",
    displayName: "Viral Search",
    icon: TrendingUp,
    color: "#C83E3A",
    gradientFrom: "#C83E3A",
    gradientTo: "#B02E2B",
  },
];

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

export function UsageStatistics() {
  const [features, setFeatures] = useState<FeatureUsage[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Load usage data from localStorage
  useEffect(() => {
    const loadUsageData = () => {
      const usageData = FEATURE_CONFIGS.map((config) => {
        const stored = localStorage.getItem(`vidspire_rate_limit_${config.name}`);
        let usage: RateLimitInfo = {
          limit: 2,
          remaining: 2,
          resetAt: null,
          isLimited: false,
        };

        if (stored) {
          const parsed = JSON.parse(stored);
          // Check if reset time has passed
          if (parsed.resetAt && new Date(parsed.resetAt) > new Date()) {
            usage = parsed;
          }
        }

        return {
          ...config,
          usage,
        };
      });

      setFeatures(usageData);
    };

    loadUsageData();

    // Update every second for live countdown
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      loadUsageData(); // Also reload data to catch any resets
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeUntilReset = (resetAt: string | null): string => {
    if (!resetAt) return "";

    const resetTime = new Date(resetAt).getTime();
    const now = currentTime;
    const diff = resetTime - now;

    if (diff <= 0) return "Resetting...";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getPercentageUsed = (usage: RateLimitInfo): number => {
    const used = usage.limit - usage.remaining;
    return (used / usage.limit) * 100;
  };

  const getStatusColor = (usage: RateLimitInfo) => {
    if (usage.isLimited) return "#EF5350";
    if (usage.remaining === 1) return "#FF6B6B";
    return "#10B981";
  };

  const getStatusText = (usage: RateLimitInfo) => {
    if (usage.isLimited) return "Limit Reached";
    if (usage.remaining === 1) return "Last Use Available";
    return `${usage.remaining} Uses Left`;
  };

  const getTotalUsed = () => {
    return features.reduce((acc, feature) => {
      return acc + (feature.usage.limit - feature.usage.remaining);
    }, 0);
  };

  const getTotalAvailable = () => {
    return features.reduce((acc, feature) => acc + feature.usage.limit, 0);
  };

  if (features.length === 0) return null;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#B02E2B]" />
            Daily Usage Overview
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track your feature usage and limits
          </p>
        </div>
        <Badge className="bg-[#B02E2B]/10 text-[#B02E2B] border border-[#B02E2B]/20 font-mono">
          {getTotalUsed()}/{getTotalAvailable()} Used Today
        </Badge>
      </div>

      {/* Usage Cards Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const percentageUsed = getPercentageUsed(feature.usage);
          const usedCount = feature.usage.limit - feature.usage.remaining;

          return (
            <motion.div
              key={feature.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-black border-neutral-800 overflow-hidden relative group">
                {/* Subtle glow effect */}
                <div
                  className="absolute inset-0 opacity-5 blur-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${feature.color}, transparent)`,
                  }}
                />

                <CardContent className="p-6 relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${feature.gradientFrom}20, ${feature.gradientTo}20)`,
                          border: `1px solid ${feature.color}30`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {feature.displayName}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {usedCount} / {feature.usage.limit} uses
                        </p>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: getStatusColor(feature.usage) }}
                    />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="relative w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageUsed}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full"
                        style={{
                          background: `linear-gradient(to right, ${feature.gradientFrom}, ${feature.gradientTo})`,
                          boxShadow: `0 0 10px ${feature.color}40`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Status Footer */}
                  {feature.usage.isLimited ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#EF5350]">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">
                          {getStatusText(feature.usage)}
                        </span>
                      </div>
                      
                      {/* Live Countdown Timer */}
                      <div className="bg-[#EF5350]/10 border border-[#EF5350]/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-[#EF5350]">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">Resets in:</span>
                          </div>
                          <span className="text-sm font-mono font-bold text-[#EF5350]">
                            {getTimeUntilReset(feature.usage.resetAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <div
                        className="flex items-center gap-2"
                        style={{ color: getStatusColor(feature.usage) }}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="font-bold">
                          {getStatusText(feature.usage)}
                        </span>
                      </div>
                      {feature.usage.resetAt && (
                        <span className="text-neutral-500 font-mono">
                          {getTimeUntilReset(feature.usage.resetAt)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Warning for last use */}
                  {feature.usage.remaining === 1 && !feature.usage.isLimited && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pt-3 border-t border-neutral-800"
                    >
                      <div className="flex items-start gap-2 text-xs text-[#FF6B6B]">
                        <span>💡</span>
                        <p>Last free use today!</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Status Banner */}
      {features.some((f) => f.usage.isLimited) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#EF5350]/10 to-[#B02E2B]/10 border border-[#EF5350]/20 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#EF5350]/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-[#EF5350]" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">
                Daily Limit Reached
              </h4>
              <p className="text-xs text-neutral-400">
                You've reached the daily limit on some features. They'll reset automatically
                when the countdown completes. Come back tomorrow for more analyses!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}