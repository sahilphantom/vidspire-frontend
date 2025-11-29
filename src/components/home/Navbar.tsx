"use client";

import Link from "next/link";
import { Sun, Waypoints } from "lucide-react"; // Waypoints used as a placeholder for the logo icon

export function Navbar() {
  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "Solutions", href: "#" },
  ];

  return (
    <div className="flex justify-center  w-full fixed top-4 z-50 px-4 ">
<nav className="flex items-center justify-between w-full max-w-5xl rounded-full border border-white/20 bg-white/70 backdrop-blur-2xl shadow-sm py-3 px-6 ">        
        {/* Left: Logo */}
        <div className="flex items-center ">
         <img 
  src="/assets/vidspirelogo.png" 
  alt="Videspire Logo"
  width={80} 
  height={80} 
  
  className="w-18 h-18 -my-6 object-contain" 
/>
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            VideSpire
          </span>
        </div>

        {/* Center: Navigation Links (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-800 hover:text-gray-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            type="button"
            className="text-gray-600 hover:text-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5" />
          </button>

          {/* CTA Button */}
          <Link
            href="#"
            className="border-[#d6211e] border-2 text-black rounded-full text-sm font-medium px-5 py-2   transition-colors"
          >
            Watch Demo
          </Link>

          <Link
            href="#"
            className="bg-[#d6211e] text-white text-sm font-medium px-5 py-2.5 rounded-full  transition-colors"
          >
            Start for Free
          </Link>
        </div>
      </nav>
    </div>
  );
}