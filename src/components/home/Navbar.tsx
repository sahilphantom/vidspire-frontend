"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle"; 
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility
import { Space_Grotesk, Outfit } from "next/font/google";





const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space", // This defines the CSS variable name
  display: "swap",
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit", // This defines the CSS variable name
  display: "swap",
});
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/feature" },
    { name: "Solutions", href: "/solution" },
  ];

  return (
    <div className="flex justify-center w-full fixed top-4 z-50 px-4">
      <nav
        className={cn(
          "relative flex items-center justify-between w-full max-w-5xl rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-2xl shadow-sm py-3 px-6 transition-all duration-500",
          isOpen && "rounded-b-none bg-white dark:bg-black" // Remove bottom radius when menu is open for seamless look
        )}
      >
        {/* Left: Logo */}
         <Link href={"/"}>
        <div className="flex items-center  z-50">
         
          <img
                src="/assets/vidspirelogo.png"
                alt="Videspire Logo"
                width={80}
                height={80}
                className="w-20 h-20 -my-6 object-contain"
              />
          <span className={`text-xl ${spaceGrotesk.className} font-semibold tracking-tight text-gray-900 dark:text-white`}>
            Vidly
          </span>
         
        </div>
         </Link>

        {/* Center: Desktop Navigation Links */}
        <div className={`hidden ${outfit.className} md:flex items-center gap-8`}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-[#d6211e] dark:hover:text-[#d6211e] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions (Desktop) */}
        <div className={`hidden ${outfit.className} md:flex items-center gap-4`}>
          <ThemeToggle />
          
          <Link
            href="#"
            className={`border-[#B02E2B]  border-2 text-black dark:text-white rounded-full text-sm font-medium px-5 py-2 hover:bg-[#d6211e]/10 transition-colors`}
          >
            Watch Demo
          </Link>

          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-[#B02E2B] to-[#d6211e] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:brightness-110 transition-all shadow-[0_0_15px_rgba(214,33,30,0.5)]"
          >
            Start for Free
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-4 md:hidden z-50">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 dark:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-x border-b border-black/5 dark:border-white/10 rounded-b-3xl shadow-xl overflow-hidden md:hidden flex flex-col items-center py-8 gap-6"
            >
              {/* Mobile Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Close menu on click
                  className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-[#d6211e] dark:hover:text-[#d6211e] transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              <div className="w-full h-px bg-gray-200 dark:bg-zinc-800 w-3/4 mx-auto" />

              {/* Mobile Buttons */}
              <div className="flex flex-col gap-4 w-full px-8">
                <Link
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center border-[#B02E2B] border-2 text-black dark:text-white rounded-full text-sm font-medium px-5 py-3 "
                >
                  Watch Demo
                </Link>

                <Link
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-gradient-to-r from-[#B02E2B] to-[#d6211e] text-white text-sm font-medium px-5 py-3 rounded-full"
                >
                  Start for Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}