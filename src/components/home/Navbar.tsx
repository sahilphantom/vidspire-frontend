"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle"; // Import your new component

export function Navbar() {
  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "Solutions", href: "#" },
  ];

  return (
    <div className="flex justify-center w-full fixed top-4 z-50 px-4">
      <nav className="flex items-center justify-between w-full max-w-5xl rounded-full border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-2xl shadow-sm py-3 px-6 transition-all duration-500">        
        {/* Left: Logo */}
        <div className="flex items-center ">
           <img

  src="/assets/vidspirelogo.png"

  alt="Videspire Logo"

  width={80}

  height={80}

 

  className="w-18 h-18 -my-6 object-contain"

/>
          <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            VideSpire
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* THEME TOGGLE */}
          <ThemeToggle />

          {/* Buttons */}
          <Link
            href="#"
            className="hidden sm:block border-[#B02E2B] border-2 text-black dark:text-white rounded-full text-sm font-medium px-5 py-2 hover:bg-[#d6211e]/10 transition-colors"
          >
            Watch Demo
          </Link>

          <Link
            href="#"
            className="bg-linear-to-r from-[#B02E2B] via-[#B02E2B] to-[#B02E2B] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:brightness-110 transition-colors shadow-[0_0_15px_rgba(214,33,30,0.5)]"
          >
            Start for Free
          </Link>
        </div>
      </nav>
    </div>
  );
}