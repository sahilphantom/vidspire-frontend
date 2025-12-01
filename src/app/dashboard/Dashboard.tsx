"use client"

import {
  BarChart3,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Search,
  CheckCircle,
  Settings,
  ArrowRight,
  Brain,
  Zap,
  Eye,
  FileText,
  Sidebar as SidebarIcon
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"

// --- Configuration ---
const menuItems = [
  { title: "Overview", icon: BarChart3, isActive: true },
  { title: "Comment Analysis", icon: MessageSquare, isActive: false },
  { title: "Topic Finder", icon: Search, isActive: false },
  { title: "Channel Audit", icon: TrendingUp, isActive: false },
  { title: "Idea Validator", icon: CheckCircle, isActive: false },
  { title: "Settings", icon: Settings, disabled: true },
]

const toolCards = [
  {
    title: "AI Comment Analyzer",
    description: "Understand what your viewers actually think.",
    icon: Brain,
    // Deep Purple Theme
    className: "bg-[#151022] border-purple-500/20 hover:border-purple-500/40 text-purple-100",
    iconColor: "text-purple-400",
  },
  {
    title: "Topic Finder",
    description: "Discover high-potential niche topics.",
    icon: Search,
    // Deep Blue Theme
    className: "bg-[#0f1623] border-blue-500/20 hover:border-blue-500/40 text-blue-100",
    iconColor: "text-blue-400",
  },
  {
    title: "Channel Breakdown",
    description: "Get an instant audit of any YouTube channel.",
    icon: TrendingUp,
    // Deep Green Theme
    className: "bg-[#0a1f16] border-emerald-500/20 hover:border-emerald-500/40 text-emerald-100",
    iconColor: "text-emerald-400",
  },
  {
    title: "Idea Validation",
    description: "Check if your next video idea can perform.",
    icon: Zap,
    // Deep Yellow/Brown Theme
    className: "bg-[#231f10] border-yellow-500/20 hover:border-yellow-500/40 text-yellow-100",
    iconColor: "text-yellow-400",
  },
]

export default function Dashboard() {
  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-black text-white overflow-hidden">
        
        {/* --- SIDEBAR (Standard Config) --- */}
        <div className="hidden md:block w-64 shrink-0 border-r border-neutral-900 bg-black">
          <Sidebar collapsible="none" className="h-full w-full border-none bg-black">
            <SidebarHeader className="px-6 py-6">
                 <Link href={"/"}>
              <div className="flex items-center ">
               
                <div className="flex items-center justify-center ">
                  <img
                src="/assets/vidspirelogo.png"
                alt="Videspire Logo"
                width={80}
                height={80}
                className="w-20 h-20 -my-6 object-contain"
              />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg tracking-wide">VidSpire</h2>
                  
                </div>
              </div>
              </Link>
            </SidebarHeader>

            <SidebarContent className="px-4">
              <SidebarGroup>
                <div className="px-2 pb-3 pt-2">
                  <span className="text-neutral-600 text-[11px] font-bold tracking-wider uppercase">Tools</span>
                </div>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`h-11 w-full justify-start rounded-md px-3 transition-all duration-200 ${
                            item.isActive
                              ? "bg-[#7c3aed] text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:bg-[#6d28d9]"
                              : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                          }`}
                        >
                          <a href="#" className="flex items-center">
                            <item.icon className={`mr-3 h-4 w-4 ${item.isActive ? "text-white" : "text-neutral-500 group-hover:text-white"}`} />
                            <span className="font-medium text-sm">{item.title}</span>
                            {item.disabled && (
                              <Badge className="ml-auto text-[10px] h-5 bg-neutral-900 text-neutral-500 border-neutral-800 px-1.5 hover:bg-neutral-900">
                                Coming
                              </Badge>
                            )}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>

        {/* --- MAIN CONTENT (Updated to Match Image) --- */}
        <div className="flex flex-1 flex-col overflow-hidden bg-black">
          
          {/* Header */}
          <header className="flex h-18 items-center justify-between px-8 py-4">
             <div className="flex items-center gap-4">
                <div className="md:hidden">
                  <SidebarTrigger />
                </div>
                <div className="flex-col">
                <h1 className="text-lg font-semibold text-white">Dashboard Overview</h1>
                  <p className="text-xs text-neutral-500 mt-0.5">A quick snapshot of your YouTube strategy tools.</p>
            </div>
             </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 pt-2">
            <div className="max-w-7xl space-y-10">
              
              {/* Quick Access Cards - 4 Column Grid */}
              <section>
                <h2 className="text-sm font-semibold text-neutral-300 mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {toolCards.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Card
                        key={tool.title}
                        className={`bg-gradient-to-br ${tool.iconColor} border ${tool.className} hover:border-opacity-60 transition-all cursor-pointer group`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <Icon className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                          <CardTitle className="text-sm font-semibold text-white mt-2">{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-neutral-400 leading-relaxed">{tool.description}</p>
                          <div className="mt-3 flex items-center text-xs text-neutral-300 group-hover:text-white transition-colors">
                            Open <ArrowRight className="w-3 h-3 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </section>
          
          {/* Recent Analyses Section */}
              <section>
                <h2 className="text-sm font-semibold text-neutral-300 mb-4">Recent Analyses</h2>
                <Card className="bg-neutral-900/50 border-neutral-800 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-neutral-800/50 p-3 mb-3">
                      <MessageSquare className="w-5 h-5 text-neutral-500" />
                    </div>
                    <p className="text-neutral-400 text-sm font-medium">You haven't analyzed anything yet.</p>
                    <p className="text-neutral-500 text-xs mt-1">
                      Get started by choosing a tool above to begin your analysis.
                    </p>
                  </CardContent>
                </Card>
              </section>


              {/* 3. Get Started Section (Updated Banner Style) */}
              <section>
                <h2 className="text-sm font-bold text-neutral-200 mb-4">Get Started</h2>
                <Card className="bg-gradient-to-r from-[#1e1b2e] to-[#0f1623] border border-blue-900/30 overflow-hidden relative">
                  <CardHeader className="pb-8 z-10 relative">
                     <div className="flex justify-between items-start">
                        <div>
                           <CardTitle className="text-xl font-bold text-white mb-2">Choose a tool to get started</CardTitle>
                           <CardDescription className="text-neutral-400">
                              Pick one of our AI-powered tools to analyze your YouTube channel and get actionable insights.
                           </CardDescription>
                        </div>
                        <Sparkles className="w-5 h-5 text-purple-400" />
                     </div>
                  </CardHeader>
                  <CardContent className="z-10 relative">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="bg-[#151022]/50 border-purple-500/20 hover:bg-[#151022] hover:border-purple-500/50 text-white h-12">
                           Analyze Comments
                        </Button>
                        <Button variant="outline" className="bg-[#0f1623]/50 border-blue-500/20 hover:bg-[#0f1623] hover:border-blue-500/50 text-white h-12">
                           Find Topics
                        </Button>
                        <Button variant="outline" className="bg-[#0a1f16]/50 border-emerald-500/20 hover:bg-[#0a1f16] hover:border-emerald-500/50 text-white h-12">
                           Audit a Channel
                        </Button>
                        <Button variant="outline" className="bg-[#231f10]/50 border-yellow-500/20 hover:bg-[#231f10] hover:border-yellow-500/50 text-white h-12">
                           Validate Idea
                        </Button>
                     </div>
                  </CardContent>
                </Card>
              </section>

              {/* 4. Coming Soon Section (Updated Layout) */}
              <section>
                <h2 className="text-sm font-bold text-neutral-200 mb-4">Coming Soon</h2>
                <Card className="bg-[#080808] border border-neutral-800">
                  <CardContent className="p-6">
                     <p className="text-sm text-neutral-400 mb-6">We're continuously building new features to help you grow. Stay tuned!</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Item 1 */}
                        <div className="h-12 rounded-md border border-neutral-800 bg-[#0f0f0f] flex items-center px-4 justify-between opacity-60">
                           <div className="flex items-center gap-3">
                              <Eye className="w-4 h-4 text-neutral-500" />
                              <span className="text-sm text-neutral-400">Competitor Analysis</span>
                           </div>
                           <Badge variant="secondary" className="bg-neutral-800 text-neutral-500 text-[10px] h-5">Soon</Badge>
                        </div>

                         {/* Item 2 */}
                         <div className="h-12 rounded-md border border-neutral-800 bg-[#0f0f0f] flex items-center px-4 justify-between opacity-60">
                           <div className="flex items-center gap-3">
                              <Search className="w-4 h-4 text-neutral-500" />
                              <span className="text-sm text-neutral-400">Keyword Explorer</span>
                           </div>
                           <Badge variant="secondary" className="bg-neutral-800 text-neutral-500 text-[10px] h-5">Soon</Badge>
                        </div>

                         {/* Item 3 */}
                         <div className="h-12 rounded-md border border-neutral-800 bg-[#0f0f0f] flex items-center px-4 justify-between opacity-60">
                           <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-neutral-500" />
                              <span className="text-sm text-neutral-400">Script Generator</span>
                           </div>
                           <Badge variant="secondary" className="bg-neutral-800 text-neutral-500 text-[10px] h-5">Soon</Badge>
                        </div>
                     </div>
                  </CardContent>
                </Card>
              </section>

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}