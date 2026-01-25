"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Star, Send, Loader2, Smile, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Questions based on your requirements
const TOOLS = [
  "Audience Mind-Reader",
  "Advanced Viral Search",
  "Video Idea Validator",
  "General Feedback"
];

export function GlobalFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Form States
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTool, setSelectedTool] = useState(TOOLS[0]);
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");
  
  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-Trigger Logic: Check usage count on mount
  useEffect(() => {
    const usageCount = parseInt(localStorage.getItem("vidly_tool_usage") || "0");
    const hasGivenFeedback = localStorage.getItem("vidly_feedback_given");

    // If used 3 times and hasn't given feedback, auto-open after a delay
    if (usageCount >= 3 && !hasGivenFeedback && !isOpen) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (rating === 0) {
    setError("Please select a rating");
    return;
  }

  setIsSubmitting(true);
  setError(null);

  try {
    // Call your Node.js backend
    const response = await fetch('http://localhost:5000/api/feedback', { // Change port if needed
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        rating, 
        tool: selectedTool, 
        feedback: feedbackText, 
        email: email || undefined 
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to submit feedback');
    }

    // Save flag to local storage so we don't bug them again
    localStorage.setItem("vidly_feedback_given", "true");
    
    setIsSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
      // Reset form after closing
      setTimeout(() => {
        setIsSuccess(false);
        setRating(0);
        setSelectedTool(TOOLS[0]);
        setFeedbackText("");
        setEmail("");
        setError(null);
      }, 500);
    }, 2000);
  } catch (error) {
    console.log(error)
    console.error('Error submitting feedback:', error);
    
    // Handle specific errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      setError('Cannot connect to the server. Please make sure your backend is running on port 5001.');
    } else {
      setError(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  // Reset error when form changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [rating, selectedTool, feedbackText, email]);

  return (
    <>
      {/* 1. Floating Trigger Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#B02E2B] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#902421] transition-colors"
      >
        <MessageSquarePlus className="w-5 h-5" />
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap text-sm font-medium pr-1"
            >
              Feedback
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 2. Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm pointer-events-auto"
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 z-[61] flex items-end sm:items-center justify-center sm:justify-end sm:px-6 sm:pb-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="pointer-events-auto w-full max-w-sm bg-white dark:bg-[#0f0f0f] border border-neutral-200 dark:border-neutral-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                  <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="text-[#B02E2B]">✨</span> Help us improve
                  </h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5">
                  {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Rating Section */}
                      <div className="space-y-1.5 text-center">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          How accurate did it feel?
                        </label>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRating(star);
                              }}
                              disabled={isSubmitting}
                              className="p-1 transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= (hoveredRating || rating)
                                    ? "fill-[#B02E2B] text-[#B02E2B]"
                                    : "text-neutral-300 dark:text-neutral-700"
                                } ${isSubmitting ? 'opacity-50' : ''}`}
                              />
                            </button>
                          ))}
                        </div>
                        {rating === 0 && error && (
                          <p className="text-xs text-red-500 mt-1">Please select a rating</p>
                        )}
                      </div>

                      {/* Tool Selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-500">Which tool did you use?</label>
                        <select 
                          value={selectedTool}
                          onChange={(e) => setSelectedTool(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 text-sm text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#B02E2B] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      {/* Feedback Text */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-500">What should we improve?</label>
                        <textarea
                          required
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Be honest, we can take it..."
                          disabled={isSubmitting}
                          className="w-full h-24 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm text-neutral-900 dark:text-white resize-none focus:ring-1 focus:ring-[#B02E2B] outline-none placeholder:text-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Email (Optional) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-500">Email (Optional)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="If you want a reply..."
                          disabled={isSubmitting}
                          className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 text-sm text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#B02E2B] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Error Message */}
                      {error && error !== "Please select a rating" && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || rating === 0}
                        className="w-full bg-[#B02E2B] hover:bg-[#902421] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Feedback
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>

                      {/* Form Note */}
                      <p className="text-xs text-neutral-500 text-center pt-2">
                        Your feedback helps us improve Vidly for everyone
                      </p>
                    </form>
                  ) : (
                    <div className="py-10 text-center space-y-3">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                        <Smile className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-neutral-900 dark:text-white">Thank You!</h4>
                        <p className="text-sm text-neutral-500">Your feedback shapes Vidly.</p>
                      </div>
                      <p className="text-xs text-neutral-400 pt-4">
                        You can close this window now
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}