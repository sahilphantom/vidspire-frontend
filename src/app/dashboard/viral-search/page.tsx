"use client"

import { useState } from "react"
import { Search, Filter, TrendingUp, Eye, Users, AlertCircle, Loader2, PlayCircle, Clock, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Types matching your Backend Response
interface VideoResult {
  id: string
  title: string
  thumbnail: string
  channel: string
  views: number
  subscribers: number
  outlierScore: number
  viewToSubRatio: number
  publishedAt: string
  durationMins: number
}

export default function AdvancedViralSearchPage() {
  // --- State ---
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<VideoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Filters
  const [minViews, setMinViews] = useState([10000])
  const [outlierThreshold, setOutlierThreshold] = useState([200])
  const [videoType, setVideoType] = useState<"all" | "long" | "shorts">("long")
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "viewCount" | "rating">("date")

  // --- API Call ---
  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    setHasSearched(true)
    setResults([])

    try {
      const params = new URLSearchParams({
        query: query,
        videoType: videoType,
        sort: sortBy,
        views: `${minViews[0]}-10000000`, 
        outlierScore: `${outlierThreshold[0]}-1000`, 
        maxResults: "20",
      })

      const response = await fetch(`http://localhost:5000/api/topics/search-advanced?${params}`)
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

  // --- Helpers ---
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num)
  }

  // 👇 NEW: Helper to format duration correctly
  const formatDuration = (mins: number) => {
    if (mins < 1) {
      return `${Math.round(mins * 60)} sec`
    }
    const hours = Math.floor(mins / 60)
    const minutes = Math.floor(mins % 60)
    
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes} mins`
  }

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B02E2B]/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#B02E2B]" />
            </div>
            <h1 className="text-3xl font-bold font-heading text-white">Advanced Viral Search</h1>
        </div>
        <p className="text-neutral-400 max-w-2xl">
          Filter by <span className="text-[#B02E2B] font-bold">'Views Per Subscriber'</span> to find small channels pulling massive numbers.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 bg-[#0f0f0f] p-6 rounded-2xl border border-neutral-800 shadow-xl shadow-black/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <Input 
              placeholder="Enter a niche (e.g., 'Coding Tutorials', 'Minecraft', 'Finance')" 
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
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <PlayCircle className="w-5 h-5 mr-2" />}
            {loading ? "Hunting..." : "Find Outliers"}
          </Button>
          <Button 
            variant="outline" 
            className={`h-12 px-4 border-neutral-800 bg-black text-neutral-400 hover:text-white ${showFilters ? 'border-[#B02E2B] text-[#B02E2B]' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Expandable Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-neutral-800 mt-2">
                
                {/* 1. Sort Order */}
                <div className="space-y-4">
                  <Label className="text-white mb-2 block font-medium">Sort Strategy</Label>
                  <div className="grid grid-cols-2 gap-2">
                     <Badge 
                        variant="outline"
                        className={`cursor-pointer justify-center py-2 ${sortBy === "date" ? "bg-[#B02E2B] border-[#B02E2B] text-white" : "text-neutral-400 border-neutral-800 hover:bg-neutral-900"}`}
                        onClick={() => setSortBy("date")}
                      >
                        <Clock className="w-3 h-3 mr-1" /> Latest
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`cursor-pointer justify-center py-2 ${sortBy === "relevance" ? "bg-[#B02E2B] border-[#B02E2B] text-white" : "text-neutral-400 border-neutral-800 hover:bg-neutral-900"}`}
                        onClick={() => setSortBy("relevance")}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" /> Best Match
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`cursor-pointer justify-center py-2 ${sortBy === "viewCount" ? "bg-[#B02E2B] border-[#B02E2B] text-white" : "text-neutral-400 border-neutral-800 hover:bg-neutral-900"}`}
                        onClick={() => setSortBy("viewCount")}
                      >
                        <Eye className="w-3 h-3 mr-1" /> Most Views
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`cursor-pointer justify-center py-2 ${sortBy === "rating" ? "bg-[#B02E2B] border-[#B02E2B] text-white" : "text-neutral-400 border-neutral-800 hover:bg-neutral-900"}`}
                        onClick={() => setSortBy("rating")}
                      >
                        <Star className="w-3 h-3 mr-1" /> Top Rated
                      </Badge>
                  </div>
                </div>

                {/* 2. Content Type */}
                <div className="space-y-4">
                  <Label className="text-white mb-2 block font-medium">Content Type</Label>
                  <div className="flex gap-2">
                    <Badge 
                      variant="outline"
                      className={`cursor-pointer px-4 py-2 h-9 flex-1 justify-center ${videoType === "long" ? "bg-[#B02E2B] border-[#B02E2B] text-white" : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"}`}
                      onClick={() => setVideoType("long")}
                    >
                      Long Form
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={`cursor-pointer px-4 py-2 h-9 flex-1 justify-center ${videoType === "shorts" ? "bg-[#B02E2B] border-[#B02E2B] text-white" : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"}`}
                      onClick={() => setVideoType("shorts")}
                    >
                      Shorts
                    </Badge>
                  </div>
                </div>

                {/* 3. Outlier Score */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-white font-medium">Viral Score</Label>
                    <span className="text-[#B02E2B] bg-[#B02E2B]/10 px-2 py-1 rounded text-xs font-mono font-bold">{outlierThreshold[0]}%</span>
                  </div>
                  <Slider 
                    value={outlierThreshold} 
                    onValueChange={setOutlierThreshold} 
                    max={500} 
                    step={10}
                    className="py-4"
                  />
                </div>

                {/* 4. Min Views */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-white font-medium">Min Views</Label>
                    <span className="text-neutral-300 bg-neutral-800 px-2 py-1 rounded text-xs font-mono">{formatNumber(minViews[0])}+</span>
                  </div>
                  <Slider 
                    value={minViews} 
                    onValueChange={setMinViews} 
                    max={500000} 
                    step={5000}
                    className="py-4"
                  />
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {results.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-black border-neutral-800 overflow-hidden hover:border-[#B02E2B] transition-all duration-300 group shadow-lg hover:shadow-[#B02E2B]/10">
              
              <div className="relative aspect-video overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                
                {/* 👇 FIXED DURATION DISPLAY 👇 */}
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 text-[10px] text-white rounded font-mono border border-white/10">
                  {formatDuration(video.durationMins)}
                </div>
                
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold shadow-lg flex items-center gap-1 backdrop-blur-md border ${
                    video.outlierScore > 300 ? "bg-[#B02E2B] text-white border-[#B02E2B]" : 
                    video.outlierScore > 150 ? "bg-orange-600 text-white border-orange-500" :
                    "bg-neutral-800 text-neutral-400 border-neutral-700"
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {video.outlierScore}% Viral
                </div>

                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-neutral-300 border border-white/10 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(video.publishedAt).toLocaleDateString()}
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                <h3 className="text-white font-medium line-clamp-2 leading-snug group-hover:text-[#B02E2B] transition-colors h-10">
                  {video.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm">
                   <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-400 font-bold">
                        {video.channel.charAt(0)}
                   </div>
                   <span className="text-neutral-400 truncate">{video.channel}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-900/50 p-2 rounded border border-neutral-800 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] uppercase tracking-wider mb-1">
                      <Eye className="w-3 h-3" /> Views
                    </div>
                    <span className="text-white font-mono font-bold">{formatNumber(video.views)}</span>
                  </div>
                  <div className="bg-neutral-900/50 p-2 rounded border border-neutral-800 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] uppercase tracking-wider mb-1">
                      <Users className="w-3 h-3" /> Subs
                    </div>
                    <span className="text-white font-mono font-bold">{formatNumber(video.subscribers)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-900">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Performance Ratio</span>
                    <span className={`font-bold font-mono ${video.viewToSubRatio > 1 ? "text-[#B02E2B]" : "text-neutral-400"}`}>
                      {video.viewToSubRatio.toFixed(1)}x
                    </span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-[#B02E2B]" 
                        style={{ width: `${Math.min(video.viewToSubRatio * 10, 100)}%` }}
                      />
                  </div>
                  <p className="text-[10px] text-right text-neutral-600 mt-1">Views vs Subscribers</p>
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
             <Search className="w-8 h-8 text-neutral-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to find outliers?</h3>
          <p className="max-w-md text-center">Enter a niche above to find videos that are outperforming their channel size.</p>
        </div>
      )}

      {/* No Results State */}
      {!loading && results.length === 0 && hasSearched && (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
          <AlertCircle className="w-10 h-10 mb-4 text-[#B02E2B]" />
          <h3 className="text-lg font-bold text-white">No viral outliers found</h3>
          <p>Try lowering the "Viral Score" or selecting "Latest" sort order.</p>
        </div>
      )}
    </div>
  )
}