"use client"

import Link from "next/link"

export function Navbar() {
  return (
    <nav className="w-full border-b border-gray-custom bg-charcoal">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-red flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <span className="text-xl font-extrabold font-heading">Vidspire</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm hover:text-primary-red transition-colors">
            Homepage
          </Link>
          <Link href="/about" className="text-sm hover:text-primary-red transition-colors">
            About us
          </Link>
          <Link href="/features" className="text-sm hover:text-primary-red transition-colors">
            Features
          </Link>
          <Link href="/blog" className="text-sm hover:text-primary-red transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="text-sm hover:text-primary-red transition-colors">
            Contact us
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            href="/demo" 
            className="px-5 py-2 text-sm font-medium hover:bg-gray-custom/20 transition-colors border border-gray-custom"
          >
            Watch Demo
          </Link>
          <Link 
            href="/signup" 
            className="px-5 py-2 text-sm font-bold bg-primary-red hover:brightness-110 transition-all"
          >
            Start for free
          </Link>
        </div>
      </div>
    </nav>
  )
}