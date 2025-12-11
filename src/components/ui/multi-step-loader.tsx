"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export const MultiStepLoader = ({
  loading,
  loadingText = "Initializing...",
  progress = 0
}: {
  loading?: boolean;
  loadingText?: string;
  progress?: number;
}) => {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full flex flex-col items-center justify-center py-20"
        >
          <div className="relative w-full max-w-md space-y-8 text-center">
            
            {/* Text Animation with Smooth Fade */}
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full mb-4 shadow-sm">
                  <Loader2 className="w-3 h-3 text-[#B02E2B] animate-spin" />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tracking-widest uppercase">
                     System Active
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
                    className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-neutral-500 to-neutral-800 dark:from-neutral-200 dark:via-white dark:to-neutral-400 leading-tight"
                 >
                   {loadingText}
                 </motion.h3>
               </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2 px-8">
              <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#B02E2B] shadow-[0_0_15px_rgba(176,46,43,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-neutral-400 dark:text-neutral-600">
                 <span>AI_PROCESS_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                 <span>{Math.round(progress)}%</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};