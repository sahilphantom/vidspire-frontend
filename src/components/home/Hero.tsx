"use client";

export function Hero() {
  return (
    <section className="relative w-full bg-charcoal pt-20 pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">

        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-custom/20 border border-gray-custom mb-8">
          <span className="text-xs text-gray-400">v2.0 - Updated integrations</span>
        </div>

        {/* Decorative Icons (floating) */}
        <div className="absolute left-[10%] top-[15%] w-8 h-8 opacity-60">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="absolute right-[12%] top-[12%] w-8 h-8 opacity-60">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        <div className="absolute left-[15%] bottom-[35%] w-8 h-8 opacity-60">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="absolute right-[10%] bottom-[30%] w-8 h-8 opacity-60">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold font-heading tracking-tight leading-tight">
          Organize your<br />
          projects in{" "}
          <span className="relative inline-block">
            <span className="relative z-10">seconds</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-green-400/30 -rotate-1"></span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Revolutionize product management. Boost productivity effortlessly.<br />
          Take control and elevate your workflow with us.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <a
            href="/signup"
            className="inline-block px-8 py-3 bg-primary-red text-white font-bold text-sm hover:brightness-110 transition-all"
          >
            Start for free
          </a>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 rounded-lg border border-gray-custom bg-jet shadow-2xl p-2 neon-glow">
          <img
            src="/dashboard-preview.png"
            alt="Vidspire Dashboard"
            className="rounded w-full"
          />
        </div>

      </div>
    </section>
  );
}