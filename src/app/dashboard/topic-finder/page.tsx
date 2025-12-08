"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, TrendingUp, Zap, Target, ArrowRight, 
  Loader2, DollarSign, Clock, BarChart3, AlertCircle, 
  CheckCircle2, Tags, Youtube, Eye, ThumbsUp, X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// --- Interfaces ---

// 1. Light Search Result (GET /search)
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
  successRate: string
  bestPostTime: { day: string; time: string; reason: string }
}

// 2. Suggestions (GET /suggestions)
interface SuggestionItem {
  keyword: string
  quickStats: { competition: string; trend: string; estimatedViews: string }
  opportunityScore: number
}

// 3. Deep Analysis Result (POST /analyze)
interface AnalysisResult {
  keyword: string
  searchVolume: number
  competition: string
  trend: string
  difficultyScore: number
  difficultyReason: string
  monetizationPotential: {
    estimatedRevenuePerVideo: string
    cpmRate: string
    monthlyPotential: string
  }
  optimalVideoLength: {
    avgLength: string
    insight: string
  }
  titleInsights: {
    commonWords: string[]
    avgTitleLength: string
    topPattern: string
  }
  competitorInsights: {
    topChannelUploadFrequency: string
    recommendedFrequency: string
  }
  seoRecommendations: {
    suggestedTags: string[]
    longTailKeywords: string[]
    searchability: string
  }
  viralPotential: {
    score: number
    reasoning: string
    timing: string
  }
  youtubeData: {
    videoCount: number
    avgViews: number
    topChannels: string[]
    avgLikes: number
    avgComments: number
    engagementRate: string
  }
}

export default function ViralGapDetector() {
  const router = useRouter()
  
  // State
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Data State
  const [searchResults, setSearchResults] = useState<TopicResult[]>([])
  const [suggestions, setSuggestions] = useState<{ highOpportunity: SuggestionItem[] } | null>(null)
  const [searchSummary, setSearchSummary] = useState<any>(null)

  // Analysis Modal State
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)

  // --- 1. Main Search (GET) ---
  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    setHasSearched(true)
    setSearchResults([])
    setSuggestions(null)

    try {
      const [searchRes, suggestRes] = await Promise.all([
        fetch(`http://localhost:5000/api/topics/search?query=${encodeURIComponent(query)}`),
        fetch(`http://localhost:5000/api/topics/suggestions?keyword=${encodeURIComponent(query)}`)
      ])
      
      const searchData = await searchRes.json()
      const suggestData = await suggestRes.json()

      if (searchData.success) {
        setSearchResults(searchData.data)
        setSearchSummary(searchData.searchSummary)
      }
      if (suggestData.success) {
        setSuggestions(suggestData.data.suggestions)
      }
    } catch (error) {
      console.error("Network error:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- 2. Deep Analysis (POST) ---
  const handleAnalyzeTopic = async (keyword: string) => {
    setAnalyzing(true)
    setIsAnalysisOpen(true)
    setAnalysisData(null) // Reset previous data

    try {
      const response = await fetch('http://localhost:5000/api/topics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      })
      const data = await response.json()

      if (data.success) {
        setAnalysisData(data.data)
      }
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-8 text-neutral-200">
      
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#B02E2B] to-red-900 rounded-xl shadow-lg shadow-red-900/20">
                <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-heading text-white">Viral Gap Detector</h1>
              <p className="text-neutral-400">Find the <span className="text-[#B02E2B] font-bold">Blue Ocean</span> topics your competitors are missing.</p>
            </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="bg-[#0a0a0a] border-neutral-800 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input 
                placeholder="Enter a broad niche (e.g. 'Boxing', 'Finance', 'Minecraft')" 
                className="pl-12 h-14 bg-neutral-900/50 border-neutral-800 text-lg text-white focus:border-[#B02E2B] focus:ring-1 focus:ring-[#B02E2B] rounded-xl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button 
              className="h-14 px-10 bg-[#B02E2B] hover:bg-[#8a2422] text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(176,46,43,0.3)] transition-all hover:scale-105"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Identify Gaps"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RESULTS AREA */}
      <AnimatePresence>
        {hasSearched && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* LEFT COLUMN: Main Gap Analysis */}
            <div className="lg:col-span-2 space-y-6">
              {searchSummary && (
                 <div className="bg-gradient-to-r from-emerald-950/50 to-neutral-900 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Zap className="w-5 h-5 text-emerald-400" />
                       <span className="text-emerald-200 font-medium">Found {searchSummary.bestOpportunities} High-Potential Gaps</span>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      {searchSummary.recommendation}
                    </Badge>
                 </div>
              )}

              {searchResults.map((topic, index) => (
                <TopicCard key={index} topic={topic} index={index} onAnalyze={() => handleAnalyzeTopic(topic.keyword)} />
              ))}
            </div>

            {/* RIGHT COLUMN: Suggestions */}
            <div className="space-y-6">
              <Card className="bg-[#0a0a0a] border-neutral-800 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-[#B02E2B]" />
                    Related Blue Oceans
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions?.highOpportunity?.slice(0, 5).map((item, idx) => (
                    <div key={idx} onClick={() => handleAnalyzeTopic(item.keyword)} className="group flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer">
                      <div>
                        <p className="font-medium text-white group-hover:text-[#B02E2B] transition-colors">{item.keyword}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] h-5 bg-neutral-800 text-neutral-400">{item.quickStats.trend}</Badge>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-emerald-500">{item.opportunityScore}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading State */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center text-neutral-500">
          <Loader2 className="w-10 h-10 animate-spin text-[#B02E2B] mb-4" />
          <p>Analyzing millions of data points...</p>
        </div>
      )}

     {/* --- DEEP ANALYSIS MODAL --- */}
      <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
        <DialogContent className="w-full max-w-[95vw] lg:max-w-6xl h-[95vh] lg:h-[90vh] p-0 gap-0 bg-[#0a0a0a] border-neutral-800 text-white overflow-hidden flex flex-col">
          
          {/* 1. Header (Fixed) */}
          <DialogHeader className="p-6 border-b border-neutral-800 bg-[#0a0a0a] shrink-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
               {analyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-[#B02E2B]" />
                    <span>Generating Intelligence Report...</span>
                  </>
               ) : (
                  <>
                    <div className="p-2 bg-[#B02E2B]/10 rounded-lg">
                      <Target className="w-5 h-5 text-[#B02E2B]" />
                    </div>
                    <span>Analysis: <span className="text-[#B02E2B] capitalize">{analysisData?.keyword}</span></span>
                  </>
               )}
            </DialogTitle>
            {!analyzing && (
              <DialogDescription className="text-neutral-400 flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 Report generated successfully based on real-time market data.
              </DialogDescription>
            )}
          </DialogHeader>

          {/* 2. Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            {!analyzing && analysisData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* === LEFT COLUMN: MAIN DATA (2/3 Width) === */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* A. Monetization Hero (The "Money" Section) */}
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-[#0a0a0a]">
                     <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <DollarSign className="w-32 h-32 text-emerald-500" />
                     </div>
                     <div className="p-6 relative z-10">
                        <h3 className="text-emerald-400 font-bold mb-6 flex items-center gap-2 text-lg">
                           <DollarSign className="w-5 h-5" /> Monetization Potential
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                           <div className="space-y-1">
                              <p className="text-xs font-medium text-emerald-500/70 uppercase tracking-wider">Estimated Revenue</p>
                              <p className="text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
                                 {analysisData.monetizationPotential.estimatedRevenuePerVideo}
                              </p>
                              <p className="text-[10px] text-neutral-400">per video average</p>
                           </div>
                           <div className="space-y-1 sm:border-l sm:border-emerald-500/20 sm:pl-6">
                              <p className="text-xs font-medium text-emerald-500/70 uppercase tracking-wider">Monthly Potential</p>
                              <p className="text-xl font-mono font-bold text-white">
                                 {analysisData.monetizationPotential.monthlyPotential}
                              </p>
                              <p className="text-[10px] text-neutral-400">based on 4 uploads</p>
                           </div>
                           <div className="space-y-1 sm:border-l sm:border-emerald-500/20 sm:pl-6">
                              <p className="text-xs font-medium text-emerald-500/70 uppercase tracking-wider">CPM Rate</p>
                              <p className="text-xl font-mono font-bold text-white">
                                 {analysisData.monetizationPotential.cpmRate}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* B. Market Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                         <p className="text-xs text-neutral-500 uppercase mb-1">Search Vol</p>
                         <p className="text-lg font-mono font-bold">{new Intl.NumberFormat('en-US', { notation: "compact" }).format(analysisData.searchVolume)}</p>
                      </div>
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                         <p className="text-xs text-neutral-500 uppercase mb-1">Avg Views</p>
                         <p className="text-lg font-mono font-bold">{new Intl.NumberFormat('en-US', { notation: "compact" }).format(analysisData.youtubeData.avgViews)}</p>
                      </div>
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                         <p className="text-xs text-neutral-500 uppercase mb-1">Competition</p>
                         <p className={`font-bold capitalize ${analysisData.competition === 'high' ? 'text-red-400' : 'text-emerald-400'}`}>
                           {analysisData.competition}
                         </p>
                      </div>
                      <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                         <p className="text-xs text-neutral-500 uppercase mb-1">Engagement</p>
                         <p className="text-lg font-mono font-bold text-[#B02E2B]">{analysisData.youtubeData.engagementRate}</p>
                      </div>
                  </div>

                  {/* C. SEO & Keywords Strategy */}
                  <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6">
                     <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                        <Tags className="w-5 h-5 text-[#B02E2B]" /> SEO Strategy
                     </h3>
                     
                     <div className="space-y-4">
                        <div>
                           <p className="text-sm text-neutral-400 mb-2">High-Ranking Tags:</p>
                           <div className="flex flex-wrap gap-2">
                              {analysisData.seoRecommendations.suggestedTags.slice(0, 10).map(tag => (
                                 <Badge key={tag} variant="secondary" className="bg-black border border-neutral-800 text-neutral-300 hover:bg-neutral-800 py-1 px-3">
                                    #{tag}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                           <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                              <p className="text-xs text-[#B02E2B] font-semibold mb-2">WINNING TITLE PATTERN</p>
                              <p className="text-sm text-white font-mono">"{analysisData.titleInsights.topPattern}..."</p>
                              <p className="text-[10px] text-neutral-500 mt-1">Avg Length: {analysisData.titleInsights.avgTitleLength}</p>
                           </div>
                           <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                              <p className="text-xs text-[#B02E2B] font-semibold mb-2">OPTIMAL VIDEO LENGTH</p>
                              <p className="text-sm text-white font-mono">{analysisData.optimalVideoLength.avgLength}</p>
                              <p className="text-[10px] text-neutral-500 mt-1">{analysisData.optimalVideoLength.insight}</p>
                           </div>
                        </div>

                        <div>
                           <p className="text-sm text-neutral-400 mb-2">Long-tail Opportunities:</p>
                           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {analysisData.seoRecommendations.longTailKeywords.map(kw => (
                                 <li key={kw} className="text-sm text-white flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {kw}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>

                  {/* D. Competitors */}
                  <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6">
                      <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                        <Eye className="w-5 h-5 text-[#B02E2B]" /> Competitor Intel
                     </h3>
                     <div className="flex flex-wrap gap-3">
                        {analysisData.youtubeData.topChannels.map(ch => (
                           <div key={ch} className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg border border-neutral-800">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center text-[10px] font-bold">
                                 {ch.charAt(0)}
                              </div>
                              <span className="text-sm text-neutral-300">{ch}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>

                {/* === RIGHT SIDEBAR (1/3 Width) - STICKY ON DESKTOP === */}
                <div className="lg:col-span-1">
                  <div className="sticky top-0 space-y-4">
                     
                     {/* 1. Score Cards Group */}
                     <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                        {/* Difficulty */}
                        <Card className="bg-neutral-900 border-neutral-800">
                           <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                              <span className="text-xs text-neutral-400 uppercase tracking-widest mb-3">Difficulty</span>
                              <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-[6px] border-[#B02E2B]/30 bg-black mb-3 shadow-inner">
                                 <span className="text-3xl font-bold text-white">{analysisData.difficultyScore}</span>
                              </div>
                              <p className="text-xs text-neutral-500 leading-tight">{analysisData.difficultyReason}</p>
                           </CardContent>
                        </Card>

                        {/* Viral Potential */}
                        <Card className="bg-neutral-900 border-neutral-800">
                           <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                              <span className="text-xs text-neutral-400 uppercase tracking-widest mb-3">Viral Potential</span>
                              <div className={`relative w-24 h-24 flex items-center justify-center rounded-full border-[6px] ${analysisData.viralPotential.score > 7 ? "border-emerald-500/50" : "border-yellow-500/50"} bg-black mb-3 shadow-inner`}>
                                 <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold text-white">{analysisData.viralPotential.score}</span>
                                    <span className="text-[10px] text-neutral-500 uppercase">/ 10</span>
                                 </div>
                              </div>
                              <p className="text-xs text-neutral-500 leading-tight">{analysisData.viralPotential.reasoning}</p>
                           </CardContent>
                        </Card>
                     </div>

                     {/* 2. Key Takeaways Panel */}
                     <div className="bg-[#B02E2B]/5 border border-[#B02E2B]/20 rounded-xl p-5">
                        <h4 className="text-[#B02E2B] font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4" /> Action Plan
                        </h4>
                        <ul className="space-y-3">
                           <li className="text-sm text-neutral-300 flex items-start gap-2">
                              <span className="text-neutral-500 mt-0.5">•</span>
                              Post on <span className="text-white font-semibold">{analysisData.viralPotential.timing}</span>
                           </li>
                           <li className="text-sm text-neutral-300 flex items-start gap-2">
                              <span className="text-neutral-500 mt-0.5">•</span>
                              Target <span className="text-white font-semibold">{analysisData.competitorInsights.recommendedFrequency}</span>
                           </li>
                           <li className="text-sm text-neutral-300 flex items-start gap-2">
                              <span className="text-neutral-500 mt-0.5">•</span>
                              Gap: <span className="text-white font-semibold italic">"Detailed Tutorials"</span>
                           </li>
                        </ul>
                     </div>

                     {/* 3. Primary CTA */}
                     <Button 
                        size="lg" 
                        className="w-full h-14 bg-[#B02E2B] hover:bg-[#8a2422] text-white font-bold text-lg shadow-[0_0_20px_rgba(176,46,43,0.3)] hover:shadow-[0_0_25px_rgba(176,46,43,0.5)] transition-all"
                        onClick={() => {
                           setIsAnalysisOpen(false)
                           router.push(`/dashboard/viral-search?q=${encodeURIComponent(analysisData.keyword)}`)
                        }}
                     >
                        Search Viral Videos <ArrowRight className="ml-2 w-5 h-5" />
                     </Button>
                     <p className="text-[10px] text-center text-neutral-500">
                        Proceed to find actual video examples to model.
                     </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

// --- SUB-COMPONENT: Topic Card ---
function TopicCard({ topic, index, onAnalyze }: { topic: TopicResult, index: number, onAnalyze: () => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }
  const getScoreBorder = (score: number) => {
    if (score >= 80) return "border-emerald-500"
    if (score >= 60) return "border-yellow-500"
    return "border-red-500"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className="bg-[#0f0f0f] border-neutral-800 overflow-hidden hover:border-[#B02E2B]/30 transition-all duration-300 group">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-[#B02E2B] transition-colors capitalize">{topic.keyword}</h3>
                <p className="text-sm text-neutral-400 mt-1 flex items-center gap-2">
                   {topic.trend === "rising" ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <BarChart3 className="w-4 h-4 text-neutral-500" />}
                   <span className={topic.trend === "rising" ? "text-emerald-500 font-medium" : "text-neutral-400"}>{topic.trend.toUpperCase()} Trend</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-neutral-900">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Est. Revenue</p>
                <p className="text-lg font-mono font-bold text-emerald-400">{topic.estimatedRevenue.split('-')[0]}+</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Avg Views</p>
                <p className="text-lg font-mono font-bold text-white">{new Intl.NumberFormat('en-US', { notation: "compact" }).format(topic.avgViews)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Success Rate</p>
                 <Badge variant="outline" className="border-neutral-700 text-neutral-400 text-[10px]">
                    {topic.successRate}
                 </Badge>
              </div>
            </div>
          </div>

          {/* Right Sidebar: The Score */}
          <div className="w-full md:w-48 bg-neutral-900/30 border-l border-neutral-800 p-6 flex flex-col items-center justify-center gap-4">
             <div className={`relative w-20 h-20 rounded-full border-4 ${getScoreBorder(topic.opportunityScore)} flex items-center justify-center bg-black`}>
                <div className="text-center">
                   <span className={`text-2xl font-bold ${getScoreColor(topic.opportunityScore)}`}>{topic.opportunityScore}</span>
                   <p className="text-[8px] uppercase tracking-widest text-neutral-500">Score</p>
                </div>
             </div>
             <Button size="sm" className="w-full bg-white text-black hover:bg-neutral-200 font-bold" onClick={onAnalyze}>
               Analyze <ArrowRight className="w-3 h-3 ml-1" />
             </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}