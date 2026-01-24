// src/components/RateLimitIndicator.tsx
'use client';

import { useRateLimit } from '@/hooks/useRateLimit';
import { Zap, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RateLimitIndicatorProps {
  featureName: string;
  displayName?: string;
}

export function RateLimitIndicator({ featureName, displayName }: RateLimitIndicatorProps) {
  const { rateLimitInfo, getTimeUntilReset, getPercentageUsed } = useRateLimit(featureName);

  // Don't show if user hasn't made any requests yet
  if (!rateLimitInfo.resetAt && rateLimitInfo.remaining === rateLimitInfo.limit) {
    return null;
  }

  const percentageUsed = getPercentageUsed();
  const usedCount = rateLimitInfo.limit - rateLimitInfo.remaining;

  // Color logic matching your theme
  const getStatusColor = () => {
    if (rateLimitInfo.isLimited) return '#EF5350';
    if (rateLimitInfo.remaining === 1) return '#FF6B6B';
    return '#10B981';
  };

  const getBarColor = () => {
    if (rateLimitInfo.isLimited) return 'from-[#EF5350] to-[#B02E2B]';
    if (rateLimitInfo.remaining === 1) return 'from-[#FF6B6B] to-[#EF5350]';
    return 'from-[#10B981] to-[#059669]';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full max-w-2xl mx-auto mb-8"
      >
        <div className="bg-black border border-[#1a1a1a] rounded-xl p-5 shadow-lg relative overflow-hidden">
          {/* Subtle glow effect */}
          <div 
            className="absolute inset-0 opacity-5 blur-2xl"
            style={{ background: `radial-gradient(circle at 50% 50%, ${getStatusColor()}, transparent)` }}
          />

          {/* Header */}
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: getStatusColor() }}
              />
              <div>
                <span className="text-sm font-bold text-white">
                  {displayName || 'Daily Usage'}
                </span>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {usedCount} of {rateLimitInfo.limit} uses today
                </p>
              </div>
            </div>
            
            {rateLimitInfo.isLimited && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EF5350]/10 border border-[#EF5350]/20 rounded-lg">
                <AlertCircle className="w-3 h-3 text-[#EF5350]" />
                <span className="text-xs font-mono text-[#EF5350]">LIMIT REACHED</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden mb-4 border border-[#1a1a1a]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentageUsed}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getBarColor()} shadow-lg`}
              style={{ 
                boxShadow: `0 0 10px ${getStatusColor()}40`
              }}
            />
          </div>

          {/* Status Footer */}
          <div className="relative flex items-center justify-between text-xs">
            {rateLimitInfo.isLimited ? (
              <>
                <div className="flex items-center gap-2 text-[#EF5350]">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Come back tomorrow for more!</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">Resets in {getTimeUntilReset()}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-green-400">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">
                    {rateLimitInfo.remaining} {rateLimitInfo.remaining === 1 ? 'use' : 'uses'} remaining
                  </span>
                </div>
                {rateLimitInfo.resetAt && (
                  <span className="text-neutral-500 font-mono">
                    Resets in {getTimeUntilReset()}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Warning for last use */}
          {rateLimitInfo.remaining === 1 && !rateLimitInfo.isLimited && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-[#1a1a1a]"
            >
              <div className="flex items-start gap-2 text-xs text-[#FF6B6B]">
                <span>💡</span>
                <p>This is your last free use today. Make it count!</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}