"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="w-full py-6 px-4 bg-white dark:bg-black flex justify-center items-center transition-colors duration-300">
      
      {/* Main Card Container - Matches the rounded look of the screenshot */}
      <div className="relative w-full max-w-5xl h-[500px]  mx-auto verflow-hidden rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0a0a0a] shadow-2xl shadow-neutral-200/50 dark:shadow-none">
        
        {/* --- Background Glow Effects (VidSpire Red Theme) --- */}
        {/* Top Left Red Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#B02E2B]/10 rounded-full blur-[100px] pointer-events-none" />
        {/* Bottom Right Orange/Red Glow */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* --- Content --- */}
        <div className="relative z-10 flex flex-col items-center justify-center py-20 px-6 text-center">
          
          {/* Badge / Pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#B02E2B]/20 bg-[#B02E2B]/5 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#B02E2B]" />
            <span className="text-sm font-medium text-[#B02E2B] dark:text-red-200">
              AI-Powered Growth
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-6xl">
            Say Goodbye to 10 of 10s. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B02E2B] to-orange-500">
              Try VidSpire for Free.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mb-10 max-w-lg text-lg text-neutral-600 dark:text-neutral-400">
            No headaches, no delays, no hidden costs. Turn every comment and trend into data-backed clarity today.
          </p>

          {/* Glowing CTA Button */}
          <div className="relative group">
            {/* Button Glow/Shadow - Red Glow matches the brand */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#B02E2B] to-orange-600 opacity-40 blur-lg transition duration-200 " />
            
            {/* Actual Button */}
            <Link href="/dashboard">
            <Button 
              size="lg"
              className="relative h-14 rounded-full bg-[#B02E2B] px-10 text-lg font-semibold text-white hover:bg-[#8a2422] transition-all active:scale-95 border border-white/10 shadow-xl"
            >
              Try for Free
            </Button>
            </Link>
          </div>

         

        </div>

        {/* --- Subtle Overlay Grid (Texture) --- */}
        <div 
            className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none" 
            style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B02E2B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
            }} 
        />
      </div>
    </section>
  )
}