"use client"

import {
  MessageSquare,
  Search,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Brain,
  Zap,
  Eye,
  FileText,
  Sparkles
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const toolCards = [
  {
    title: "Audience Mind-Reader",
    description: "Extract hidden content demands and pain points from viewer comments.",
    icon: Brain,
    href: "/dashboard/comment-analyzer",
    darkClass: "bg-[#180505] border-[#B02E2B] hover:border-[#B02E2B]/50 text-red-100",
    iconColor: "text-[#B02E2B]",
  },
  {
    title: "Viral Gap Detector",
    description: "Identify high-demand, low-supply 'Blue Ocean' topics to rank #1.",
    icon: Search,
    href: "/dashboard/topic-finder",
    darkClass: "bg-[#180505] border-[#B02E2B] hover:border-[#B02E2B]/50 text-red-100",
    iconColor: "text-[#B02E2B]",
  },
  {
    title: "Advanced Viral Search",
    description: "Filter by 'Views Per Subscriber' to find small channels pulling massive numbers.",
    icon: TrendingUp,
    href: "/dashboard/viral-search",
    darkClass: "bg-[#180505] border-[#B02E2B] hover:border-[#B02E2B]/50 text-red-100",
    iconColor: "text-[#B02E2B]",
  },
  {
    title: "Pre-Production Risk Audit",
    description: "Simulate your video's performance against historical data before you film.",
    icon: Zap,
    href: "/dashboard/idea-validator",
    darkClass: "bg-[#180505] border-[#B02E2B] hover:border-[#B02E2B]/50 text-red-100",
    iconColor: "text-[#B02E2B]",
  },
]

export default function DashboardPage() {
  return (
    <div className="max-w-7xl space-y-10 mx-auto">
      
      {/* Quick Access Cards */}
      <section>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Quick Access</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {toolCards.map((tool) => {
            const Icon = tool.icon
            return (
              <Link href={tool.href} key={tool.title} className="block h-full">
                <Card className={`bg-gradient-to-br ${tool.darkClass} border h-full cursor-pointer transition-all duration-200 hover:scale-[1.02]`}>
                  <CardHeader>
                    <div className="flex items-center">
                      <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                    </div>
                    <CardTitle className="text-sm font-semibold text-white mt-2">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-neutral-400 leading-relaxed">{tool.description}</p>
                    <div className="mt-3 flex items-center text-xs text-neutral-500 group-hover:text-white transition-colors">
                      Open <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent Analyses (Empty State) */}
      <section>
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Recent Missions</h2>
        <Card className="bg-neutral-900/50 border-neutral-800 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-neutral-800/50 p-3 mb-3">
              <MessageSquare className="w-5 h-5 text-neutral-500" />
            </div>
            <p className="text-sm font-medium text-neutral-400">Intelligence Log Empty</p>
            <p className="text-xs mt-1 text-neutral-500">You haven't run any missions yet.</p>
          </CardContent>
        </Card>
      </section>

      {/* Get Started Section */}
      <section>
        <h2 className="text-sm font-bold text-neutral-200 mb-4">Get Started</h2>
        <Card className="bg-gradient-to-r from-[#1a0505] to-[#1a0505] border-[#B02E2B] overflow-hidden relative">
          <CardHeader className="pb-8 z-10 relative">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold text-white mb-2">Launch Your First Mission</CardTitle>
                <CardDescription className="text-neutral-400">Pick an intelligence tool to analyze the market.</CardDescription>
              </div>
              <Sparkles className="w-5 h-5 text-[#d6211e]" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
              <Link href="/dashboard/comment-analyzer" className="w-full">
                <Button variant="outline" className="bg-[#B02E2B]/50 border-red-500/20 hover:bg-[#2b0c0c] text-white h-12 w-full">Mine Comments</Button>
              </Link>
              <Link href="/dashboard/topic-finder" className="w-full">
                <Button variant="outline" className="bg-[#B02E2B]/50 border-red-500/20 hover:bg-[#2b0c0c] text-white h-12 w-full">Find Gaps</Button>
              </Link>
              <Link href="/dashboard/viral-search" className="w-full">
                <Button variant="outline" className="bg-[#B02E2B]/50 border-red-500/20 hover:bg-[#2b0c0c] text-white h-12 w-full">Hunt Outliers</Button>
              </Link>
              <Link href="/dashboard/idea-validator" className="w-full">
                <Button variant="outline" className="bg-[#B02E2B]/50 border-red-500/20 hover:bg-[#2b0c0c] text-white h-12 w-full">Audit Risk</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Coming Soon Section */}
      <section>
        <h2 className="text-sm font-bold text-neutral-200 mb-4">Future Arsenal</h2>
        <Card className="bg-[#080808] border-neutral-800">
          <CardContent className="p-6">
            <p className="text-sm mb-6 text-neutral-400">We are building the ultimate unfair advantage. Stay tuned!</p>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {['Agent Ethan (AI Manager)', 'Thumbnail Forensics', 'Retention Spy'].map((item, i) => (
                <div key={i} className="h-12 rounded-md border border-neutral-800 bg-[#0f0f0f] flex items-center px-4 justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-400">{item}</span>
                  </div>
                  <Badge variant="secondary" className="bg-neutral-800 text-neutral-500 text-[10px] h-5">Soon</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}