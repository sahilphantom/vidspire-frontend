"use client";

import Link from "next/link";
import { Sun, Waypoints } from "lucide-react"; // Waypoints used as a placeholder for the logo icon

export function Navbar() {
  const navLinks = [
    { name: "Pricing", href: "#" },
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
  ];

  return (
    <div className="flex justify-center w-full fixed top-4 z-50 px-4 ">
      <nav className="flex items-center justify-between w-full max-w-5xl rounded-full border border-gray-200 bg-white/80 backdrop-blur-md py-3 px-6 shadow-sm">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          {/* Custom Logo Icon attempting to match the image */}
          <div className="text-black">
            <Waypoints className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            Notus
          </span>
        </div>

        {/* Center: Navigation Links (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
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
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5" />
          </button>

          {/* CTA Button */}
          <Link
            href="#"
            className="bg-[#1C1C1C] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            Start building
          </Link>
        </div>
      </nav>
    </div>
  );
}