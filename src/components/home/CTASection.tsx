"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { Space_Grotesk, Outfit } from "next/font/google";



const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});


const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export default function CTASection() {
  return (
    <section className="w-full py-6 lg:py-24 px-4 bg-white dark:bg-black flex justify-center items-center transition-colors duration-300">
      
      {/* Container Logic:
        - h-auto + py-16: For mobile/tablet (grows with content)
        - lg:h-[500px] + lg:py-0: For big screens (fixed 500px height, centered content)
      */}
      <div className="relative w-full max-w-5xl h-auto lg:h-[500px] flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0a0a0a] shadow-2xl shadow-neutral-200/50 dark:shadow-none transition-all duration-300">
        
        {/* --- Background Glow Effects --- */}
        <div className="absolute -top-32 -left-32 w-64 h-64 md:w-96 md:h-96 bg-[#B02E2B]/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 md:w-96 md:h-96 bg-orange-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
        
        {/* --- Content --- */}
        {/* Added z-10 and px-4 for mobile safety */}
        <div className="relative z-10 flex flex-col items-center justify-center py-16 lg:py-0 px-4 text-center w-full">
          
          {/* Badge */}
          <div className="mb-6 lg:mb-8 inline-flex items-center gap-2 rounded-full border border-[#B02E2B]/20 bg-[#B02E2B]/5 px-3 py-1 md:px-4 md:py-1.5 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#B02E2B]" />
            <span className={`text-xs ${outfit.className} md:text-sm font-medium text-[#B02E2B] dark:text-red-200`}>
              Creator-Grade AI
            </span>
          </div>

          {/* Main Headline - Responsive Text Sizes */}
          <h2 className={`mb-4 ${spaceGrotesk.className} lg:mb-6 max-w-3xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]`}>
            Stop Guessing. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B02E2B] to-[#8a2422]">
              Start Dominating.
            </span>
          </h2>

          {/* Subtitle */}
          <p className={`mb-8 ${outfit.className} lg:mb-10 max-w-sm sm:max-w-lg text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed`}>
            Your channel data is trying to tell you something. We help you listen. Get the insights you need to double your growth today.
          </p>

          {/* CTA Button */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#B02E2B] to-[#8a2422] opacity-40 blur-lg transition duration-200 group-hover:opacity-70 group-hover:blur-xl" />
            <Link href="/dashboard" passHref>
            <Button 
              size="lg"
              className={`relative ${outfit.className} h-12 md:h-14 rounded-full bg-[#B02E2B] px-8 md:px-10 text-base md:text-lg font-semibold text-white hover:bg-[#8a2422] transition-all active:scale-95 border border-white/10 shadow-xl`}
            >
              Try for Free
            </Button>
            </Link>
          </div>

         
        </div>

        {/* --- Texture Overlay --- */}
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