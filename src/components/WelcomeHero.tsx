"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Clock } from "lucide-react";

const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#B02E2B]">
      {/* Aurora Layer 1: Shifting Primary to Bright */}
      <motion.div
        animate={{
          x: ["-20%", "20%", "-20%"],
          y: ["-10%", "10%", "-10%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] opacity-60 blur-[100px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, #FF6B6B 0%, transparent 70%)",
        }}
      />

      {/* Aurora Layer 2: Shifting Bright to Light */}
      <motion.div
        animate={{
          x: ["20%", "-20%", "20%"],
          y: ["10%", "-10%", "10%"],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[120%] h-[120%] opacity-50 blur-[120px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, #EF5350 0%, transparent 70%)",
        }}
      />

      {/* Aurora Layer 3: Dynamic Highlight */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] left-[30%] w-[60%] h-[60%] opacity-40 blur-[80px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, #B02E2B 0%, transparent 60%)",
        }}
      />
      
      {/* Subtle Overlay for smooth color blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20" />
    </div>
  );
};

export function WelcomeHero() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("Creator");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const savedName = localStorage.getItem("user_name");
    if (savedName) setUserName(savedName);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFormattedDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFormattedTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-black border border-neutral-800 mb-10"
    >
      {/* Aurora Background Animation */}
      <AuroraBackground />

      

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="max-w-4xl">
          {/* Time Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black backdrop-blur-md border border-[#B02E2B]/20 rounded-full mb-6"
          >
            <Clock className="w-4 h-4 text-[#EF5350]" />
            <span className="text-sm font-mono text-white">
              {getFormattedTime()}
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-sm text-neutral-400">{getFormattedDate()}</span>
          </motion.div>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                {getGreeting()},{" "}
              </span>
              <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                {userName}
              </span>
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="inline-block ml-3"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-xl md:text-2xl text-white leading-relaxed">
              Ready to unlock viral insights and dominate YouTube?
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {[
              {
                icon: Sparkles,
                label: "AI-Powered",
                value: "3 Tools",
                color: "#EF5350",
              },
              {
                icon: Zap,
                label: "Daily Limit",
                value: "6 Uses",
                color: "#FF6B6B",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black backdrop-blur-md border border-neutral-800 rounded-2xl p-5 hover:border-[#B02E2B]/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                      border: `1px solid ${stat.color}30`,
                    }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-300 uppercase tracking-wider font-bold">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      
    </motion.section>
  );
}
