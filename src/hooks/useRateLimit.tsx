// src/hooks/useRateLimit.ts
import { useState, useEffect } from 'react';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: string | null;
  isLimited: boolean;
}

interface UseRateLimitReturn {
  rateLimitInfo: RateLimitInfo;
  updateRateLimit: (headers: Headers) => void;
  resetRateLimit: () => void;
  getTimeUntilReset: () => string;
  getPercentageUsed: () => number;
}

const STORAGE_KEY = 'vidspire_rate_limit';

export function useRateLimit(featureName: string): UseRateLimitReturn {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>(() => {
    if (typeof window === 'undefined') {
      return { limit: 2, remaining: 2, resetAt: null, isLimited: false };
    }
    
    const stored = localStorage.getItem(`${STORAGE_KEY}_${featureName}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.resetAt && new Date(parsed.resetAt) > new Date()) {
        return parsed;
      }
    }
    return { limit: 2, remaining: 2, resetAt: null, isLimited: false };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(
      `${STORAGE_KEY}_${featureName}`,
      JSON.stringify(rateLimitInfo)
    );
  }, [rateLimitInfo, featureName]);

  useEffect(() => {
    if (!rateLimitInfo.resetAt) return;

    const checkExpiry = () => {
      const resetTime = new Date(rateLimitInfo.resetAt!);
      const now = new Date();

      if (now >= resetTime) {
        setRateLimitInfo({
          limit: 2,
          remaining: 2,
          resetAt: null,
          isLimited: false,
        });
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60000);
    return () => clearInterval(interval);
  }, [rateLimitInfo.resetAt]);

  const updateRateLimit = (headers: Headers) => {
    const limit = parseInt(headers.get('X-RateLimit-Limit') || '2', 10);
    const remaining = parseInt(headers.get('X-RateLimit-Remaining') || '2', 10);
    const resetAt = headers.get('X-RateLimit-Reset');

    setRateLimitInfo({
      limit,
      remaining,
      resetAt,
      isLimited: remaining === 0,
    });
  };

  const resetRateLimit = () => {
    setRateLimitInfo({
      limit: 2,
      remaining: 2,
      resetAt: null,
      isLimited: false,
    });
  };

  const getTimeUntilReset = (): string => {
    if (!rateLimitInfo.resetAt) return '';

    const resetTime = new Date(rateLimitInfo.resetAt);
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();

    if (diff <= 0) return 'Soon';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getPercentageUsed = (): number => {
    const used = rateLimitInfo.limit - rateLimitInfo.remaining;
    return (used / rateLimitInfo.limit) * 100;
  };

  return {
    rateLimitInfo,
    updateRateLimit,
    resetRateLimit,
    getTimeUntilReset,
    getPercentageUsed,
  };
}