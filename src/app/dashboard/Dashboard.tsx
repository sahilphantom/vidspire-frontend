"use client"

import { useState } from "react"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  { title: "Overview", icon: BarChart3, isActive: true },
  { title: "Comment Analysis", icon: MessageSquare },
  { title: "Topic Finder", icon: Search },
  { title: "Channel Audit", icon: TrendingUp },
  { title: "Idea Validator", icon: CheckCircle },
  { title: "Settings", icon: Settings, disabled: true },
]

const toolCards = [
  {
    title: "AI Comment Analyzer",
    description: "Understand what your viewers actually think.",
    icon: Brain,
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30",
  },
  {
    title: "Topic Finder",
    description: "Discover high-potential niche topics.",
    icon: Search,
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
  },
  {
    title: "Channel Breakdown",
    description: "Get an instant audit of any YouTube channel.",
    icon: TrendingUp,
    color: "from-emerald-500/20 to-emerald-600/20",
    borderColor: "border-emerald-500/30",
  },
  {
    title: "Idea Validation",
    description: "Check if your next video idea can perform.",
    icon: Zap,
    color: "from-yellow-500/20 to-yellow-600/20",
    borderColor: "border-yellow-500/30",
  },
]

const comingSoonFeatures = [
  { title: "Competitor Analysis", icon: Eye },
  { title: "Keyword Explorer", icon: Search },
  { title: "Script Generator", icon: Sparkles },
]

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-neutral-950">
        {/* Sidebar */}
        <Sidebar className="border-r border-neutral-800 bg-neutral-900">
          <SidebarHeader className="border-b border-neutral-800 px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">VidSpire</h2>
                <p className="text-xs text-neutral-400">Creator Analytics</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-0">
            <SidebarGroup>
              <SidebarGroupLabel className="text-neutral-500 text-xs font-semibold px-6 py-2">TOOLS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 px-4">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="relative">
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        disabled={item.disabled}
                        className={`rounded-md transition-colors ${
                          item.disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : "hover:bg-neutral-800"
                        }`}
                      >
                        <a href="#" className="flex items-center space-x-2 text-sm">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          {item.disabled && (
                            <Badge variant="secondary" className="ml-auto text-xs bg-neutral-800 text-neutral-400">
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

        {/* Main Content */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-14 items-center justify-between border-b border-neutral-800 px-6 bg-neutral-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="text-neutral-400 hover:text-white" />
              <div>
                <h1 className="text-xl font-semibold text-white">Dashboard Overview</h1>
                <p className="text-xs text-neutral-400">A quick snapshot of your YouTube strategy tools.</p>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Quick Access Cards - 4 Column Grid */}
              <section>
                <h2 className="text-sm font-semibold text-neutral-300 mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {toolCards.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Card
                        key={tool.title}
                        className={`bg-gradient-to-br ${tool.color} border ${tool.borderColor} hover:border-opacity-60 transition-all cursor-pointer group`}
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

              {/* Get Started Section */}
              <section>
                <h2 className="text-sm font-semibold text-neutral-300 mb-4">Get Started</h2>
                <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">Choose a tool to get started</CardTitle>
                        <CardDescription className="text-neutral-400 mt-1">
                          Pick one of our AI-powered tools to analyze your YouTube channel and get actionable insights.
                        </CardDescription>
                      </div>
                      <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        className="border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 text-white text-sm"
                      >
                        Analyze Comments
                      </Button>
                      <Button
                        variant="outline"
                        className="border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 text-white text-sm"
                      >
                        Find Topics
                      </Button>
                      <Button
                        variant="outline"
                        className="border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 text-white text-sm"
                      >
                        Audit a Channel
                      </Button>
                      <Button
                        variant="outline"
                        className="border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 text-white text-sm"
                      >
                        Validate Idea
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Coming Soon Section */}
              <section>
                <h2 className="text-sm font-semibold text-neutral-300 mb-4">Coming Soon</h2>
                <Card className="bg-neutral-900/50 border-neutral-800">
                  <CardHeader>
                    <CardDescription className="text-neutral-400">
                      We're continuously building new features to help you grow. Stay tuned!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {comingSoonFeatures.map((feature) => {
                        const Icon = feature.icon
                        return (
                          <Button
                            key={feature.title}
                            variant="outline"
                            disabled
                            className="border-neutral-700 bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900/50 cursor-not-allowed flex items-center justify-center space-x-2 h-12"
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{feature.title}</span>
                            <Badge variant="secondary" className="text-xs bg-neutral-800 text-neutral-400 ml-auto">
                              Soon
                            </Badge>
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
