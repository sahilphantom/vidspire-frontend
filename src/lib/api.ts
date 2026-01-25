import { JobData } from "../app/dashboard/comment-analyzer/page";

// src/lib/api.ts - Updated version
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class RateLimitError extends Error {
  retryAfter: number;
  resetAt: string;
  limit: number;
  remaining: number;

  constructor(message: string, retryAfter: number, resetAt: string, limit: number, remaining: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    this.resetAt = resetAt;
    this.limit = limit;
    this.remaining = remaining;
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Global rate limit store for tracking headers
const rateLimitStore = new Map<string, Headers>();

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  featureName: string = 'default'
): Promise<{ data: T; headers: Headers }> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const responseData: ApiResponse<T> = await response.json();

    // Store rate limit headers
    if (response.headers.has('X-RateLimit-Remaining')) {
      rateLimitStore.set(featureName, response.headers);
    }

    // Handle rate limit (429)
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '0', 10);
      const resetAt = response.headers.get('X-RateLimit-Reset') || new Date().toISOString();
      const limit = parseInt(response.headers.get('X-RateLimit-Limit') || '2', 10);
      const remaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0', 10);
      
      throw new RateLimitError(
        responseData.message || 'Daily limit reached. Try again tomorrow!',
        retryAfter,
        resetAt,
        limit,
        remaining
      );
    }

    // Handle other errors
    if (!response.ok || !responseData.success) {
      throw new Error(responseData.message || responseData.error || 'Request failed');
    }

    return {
      data: responseData.data as T,
      headers: response.headers,
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred');
  }
}

// Helper to get rate limit headers for a feature
export function getRateLimitHeaders(featureName: string): Headers | null {
  return rateLimitStore.get(featureName) || null;
}

// ========================================
// VIDSPIRE API FUNCTIONS WITH RATE LIMIT FEATURE NAMES
// ========================================

// 1. Video Sentiment Analysis
export async function analyzeSentiment(videoUrl: string) {
  return apiRequest<JobData>('/api/video/analyze', {
    method: 'POST',
    body: JSON.stringify({ videoUrl }),
  }, 'video_analysis');
}

// 2. Idea Validation
export async function validateIdea(idea: string, targetAudience: string, goal: string) {
  return apiRequest('/api/validate-idea', {
    method: 'POST',
    body: JSON.stringify({ idea, targetAudience, goal }),
  }, 'idea_validation');
}

// 3. Advanced Topic Search
export async function searchTopicsAdvanced(
  query: string,
  options?: {
    contentType?: 'all' | 'longForm' | 'shorts';
    sort?: 'latest' | 'bestMatch' | 'mostViews' | 'topRated';
    viralScore?: number;
    minViews?: number;
    maxResults?: number;
  }
) {
  const params = new URLSearchParams({ query });
  
  if (options?.contentType) params.append('contentType', options.contentType);
  if (options?.sort) params.append('sort', options.sort);
  if (options?.viralScore) params.append('viralScore', options.viralScore.toString());
  if (options?.minViews) params.append('minViews', options.minViews.toString());
  if (options?.maxResults) params.append('maxResults', options.maxResults.toString());
  
  return apiRequest(`/api/topics/search-advanced?${params.toString()}`, {
    method: 'GET',
  }, 'viral_search');
}

// Status checks (not rate limited)
export async function getAnalysisStatus(jobId: string) {
  return apiRequest(`/api/video/status/${jobId}`, {
    method: 'GET',
  });
}

export async function getAnalysisData(jobId: string) {
  return apiRequest(`/api/video/${jobId}`, {
    method: 'GET',
  });
}