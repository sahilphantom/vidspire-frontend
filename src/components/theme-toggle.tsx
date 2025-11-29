"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative flex w-16 h-8 p-1 rounded-full cursor-pointer transition-colors duration-500
        ${isDark ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-200 border border-zinc-300"}
      `}
    >
      {/* Moving Circle (The Thumb) */}
      <motion.div
        className="w-6 h-6 bg-linear-to-r from-[#B02E2B] via-[#B02E2B] to-[#B02E2B] rounded-full shadow-md z-10 flex items-center justify-center"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        animate={{
          x: isDark ? 32 : 0, 
        }}
      >
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ scale: 0.5, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
            {/* Icons inside the red circle */}
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-white fill-white" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-white fill-white" />
          )}
        </motion.div>
      </motion.div>

      {/* Background Icons (Decorative) */}
      <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
        <Sun className={`w-3 h-3 ${isDark ? "text-zinc-600" : "opacity-0"}`} />
        <Moon className={`w-3 h-3 ${!isDark ? "text-zinc-400" : "opacity-0"}`} />
      </div>
    </div>
  );
}