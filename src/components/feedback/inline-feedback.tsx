"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InlineFeedback({ toolName }: { toolName: string }) {
  const [status, setStatus] = useState<"idle" | "liked" | "disliked" | "commenting">("idle");
  const [comment, setComment] = useState("");

  const handleVote = (vote: "liked" | "disliked") => {
    setStatus(vote === "disliked" ? "commenting" : "liked");
    // Send initial vote to API immediately
    // fetch('/api/feedback/vote', ...);
    
    // Increment usage counter for the global auto-trigger logic
    const currentCount = parseInt(localStorage.getItem("vidly_tool_usage") || "0");
    localStorage.setItem("vidly_tool_usage", (currentCount + 1).toString());
  };

  const submitComment = () => {
    // Send comment to API
    setStatus("disliked"); // Show "Thanks" state essentially
  };

  if (status === "liked" || status === "disliked") {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
      >
        <p className="text-green-600 dark:text-green-400 text-sm font-medium">
          Thanks for the feedback!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-2xl mx-auto mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">Was this analysis helpful?</h4>
          <p className="text-xs text-neutral-500">Help us improve the {toolName} algorithm.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleVote("liked")}
            className="hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50 transition-colors"
          >
            <ThumbsUp className="w-4 h-4 mr-2" /> Yes
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleVote("disliked")}
            className="hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-colors"
          >
            <ThumbsDown className="w-4 h-4 mr-2" /> No
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {status === "commenting" && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What specifically went wrong?"
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#B02E2B] outline-none resize-none mb-2"
              rows={2}
            />
            <div className="flex justify-end gap-2">
               <Button variant="ghost" size="sm" onClick={() => setStatus("idle")} className="text-neutral-500">Cancel</Button>
               <Button size="sm" onClick={submitComment} className="bg-[#B02E2B] hover:bg-[#902421] text-white">
                  Submit <Send className="w-3 h-3 ml-2" />
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}