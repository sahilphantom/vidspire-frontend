"use client"
import { useState } from "react"
import { Search, TrendingUp, BarChart2, Zap, AlertTriangle, ArrowRight, Loader2, Target } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress" // You might need to add this component

// Types matching your Backend Response (AdvancedSearchTopic)
interface TopicResult {
  keyword: string
  searchVolume: number
  competition: "low" | "medium" | "high"
  trend: "rising" | "stable" | "declining"
  avgViews: number
  opportunityScore: number
  opportunityReason: string
  growthRate: string
  estimatedRevenue: string
}

export default function TopicFinderPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<TopicResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // --- API Call ---
  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    setHasSearched(true)
    setResults([])

    try {
      // Calling your existing Node.js endpoint
      const response = await fetch(`http://localhost:5000/api/topics/search?query=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.data)
      } else {
        console.error("Search failed:", data.message)
      }
    } catch (error) {
      console.error("Network error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper for formatting large numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num)
  }

  // Helper for color coding the Opportunity Score
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500 bg-green-500/10 border-green-500/20"
    if (score >= 50) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    return "text-red-500 bg-red-500/10 border-red-500/20"
  }

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B02E2B]/10 rounded-lg">
                <Target className="w-6 h-6 text-[#B02E2B]" />
            </div>
            <h1 className="text-3xl font-bold font-heading text-white">Viral Gap Detector</h1>
        </div>
        <p className="text-neutral-400 max-w-2xl">
          Enter a broad niche to identify <span className="text-[#B02E2B] font-bold">Blue Ocean</span> topics—high demand, low competition.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 bg-[#0f0f0f] p-6 rounded-2xl border border-neutral-800 shadow-xl shadow-black/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <Input 
            placeholder="Enter a broad topic (e.g. 'Fitness', 'Crypto', 'AI Tools')" 
            className="pl-10 h-12 bg-black border-neutral-800 text-white focus:border-[#B02E2B] focus:ring-[#B02E2B]/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button 
          className="h-12 px-8 bg-[#B02E2B] hover:bg-[#8a2422] text-white font-bold shadow-[0_0_15px_rgba(176,46,43,0.4)] transition-all hover:scale-105"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
          {loading ? "Analyzing..." : "Find Gaps"}
        </Button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((topic, index) => (
          <motion.div
            key={topic.keyword}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-black border-neutral-800 hover:border-[#B02E2B]/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-[#B02E2B] transition-colors">
                    {topic.keyword}
                  </CardTitle>
                  <p className="text-sm text-neutral-400 mt-1 flex items-center gap-2">
                     {topic.trend === "rising" && <TrendingUp className="w-4 h-4 text-green-500" />}
                     {topic.trend === "stable" && <BarChart2 className="w-4 h-4 text-yellow-500" />}
                     {topic.trend === "declining" && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                     <span className="capitalize">{topic.trend} Trend</span>
                  </p>
                </div>
                
                {/* Opportunity Score Badge */}
                <div className={`flex flex-col items-end`}>
                   <Badge variant="outline" className={`text-lg font-bold px-3 py-1 mb-1 ${getScoreColor(topic.opportunityScore)}`}>
                      {topic.opportunityScore}/100
                   </Badge>
                   <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Opp. Score</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                
                {/* Main Stats */}
                <div className="grid grid-cols-3 gap-2 bg-[#0f0f0f] p-3 rounded-lg border border-neutral-800/50">
                   <div className="text-center">
                      <p className="text-[10px] text-neutral-500 uppercase">Search Vol</p>
                      <p className="text-white font-mono font-bold">{formatNumber(topic.searchVolume)}</p>
                   </div>
                   <div className="text-center border-l border-neutral-800">
                      <p className="text-[10px] text-neutral-500 uppercase">Competition</p>
                      <p className={`font-mono font-bold ${
                          topic.competition === "low" ? "text-green-500" : 
                          topic.competition === "medium" ? "text-yellow-500" : "text-red-500"
                      }`}>
                          {topic.competition.toUpperCase()}
                      </p>
                   </div>
                   <div className="text-center border-l border-neutral-800">
                      <p className="text-[10px] text-neutral-500 uppercase">Avg Views</p>
                      <p className="text-white font-mono font-bold">{formatNumber(topic.avgViews)}</p>
                   </div>
                </div>

                {/* Insight & Revenue */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-neutral-300 font-medium">{topic.opportunityReason}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">Estimated Revenue: {topic.estimatedRevenue}</p>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-neutral-900 flex justify-between items-center">
                    <Badge variant="secondary" className="bg-neutral-900 text-neutral-400 hover:bg-neutral-800">
                       Growth: {topic.growthRate}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-[#B02E2B] hover:text-white hover:bg-[#B02E2B]">
                        Analyze Deeply <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && results.length === 0 && !hasSearched && (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
          <div className="p-4 bg-neutral-900 rounded-full mb-4">
             <Target className="w-8 h-8 text-neutral-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Find your next viral topic</h3>
          <p className="max-w-md text-center">We analyze competition, search volume, and trends to calculate a "Gap Score".</p>
        </div>
      )}

      {/* No Results State */}
      {!loading && results.length === 0 && hasSearched && (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
          <AlertTriangle className="w-10 h-10 mb-4 text-[#B02E2B]" />
          <h3 className="text-lg font-bold text-white">No gaps found</h3>
          <p>This niche might be too small or API limits reached. Try a broader term.</p>
        </div>
      )}

    </div>
  )
}