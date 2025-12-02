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
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon
} from "lucide-react"
import { useState, useEffect, createContext, useContext } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

// --- Theme Context ---
type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

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
    darkClass: "bg-[#1f0a0a] border-red-500/20 hover:border-[#d6211e]/50 text-red-100",
    lightClass: "bg-red-50 border-red-200 hover:border-red-400 text-red-900",
    iconColor: "text-[#d6211e]",
  },
  {
    title: "Topic Finder",
    description: "Discover high-potential niche topics.",
    icon: Search,
    darkClass: "bg-[#1a0808] border-red-600/20 hover:border-[#d6211e]/50 text-red-100",
    lightClass: "bg-red-50/80 border-red-300 hover:border-red-400 text-red-900",
    iconColor: "text-red-400",
  },
  {
    title: "Channel Breakdown",
    description: "Get an instant audit of any YouTube channel.",
    icon: TrendingUp,
    darkClass: "bg-[#180505] border-red-700/20 hover:border-[#d6211e]/50 text-red-100",
    lightClass: "bg-red-100/50 border-red-400 hover:border-red-500 text-red-900",
    iconColor: "text-red-500",
  },
  {
    title: "Idea Validation",
    description: "Check if your next video idea can perform.",
    icon: Zap,
    darkClass: "bg-[#1c0b05] border-orange-600/20 hover:border-orange-500/50 text-orange-100",
    lightClass: "bg-orange-50 border-orange-200 hover:border-orange-400 text-orange-900",
    iconColor: "text-orange-500",
  },
]

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [theme, setTheme] = useState<Theme>("dark")

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(newTheme)
    // Store in localStorage for persistence
    localStorage.setItem("theme", newTheme)
  }

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light")
    setTheme(initialTheme)
    document.documentElement.classList.add(initialTheme)
  }, [])

  // Theme-dependent styles
  const getBgColor = () => theme === "dark" ? "bg-black" : "bg-gray-50"
  const getTextColor = () => theme === "dark" ? "text-white" : "text-gray-900"
  const getSidebarBg = () => theme === "dark" ? "bg-black" : "bg-white"
  const getSidebarBorder = () => theme === "dark" ? "border-neutral-900" : "border-gray-200"
  const getHeaderText = () => theme === "dark" ? "text-neutral-300" : "text-gray-700"
  const getDescriptionText = () => theme === "dark" ? "text-neutral-500" : "text-gray-500"
  const getCardBg = () => theme === "dark" ? "bg-neutral-900/50" : "bg-gray-100"
  const getComingSoonBg = () => theme === "dark" ? "bg-[#080808]" : "bg-gray-50"
  const getComingSoonBorder = () => theme === "dark" ? "border-neutral-800" : "border-gray-300"
  
  // Get card class based on theme
  const getCardClass = (card: typeof toolCards[0]) => {
    return theme === "dark" ? card.darkClass : card.lightClass
  }

  // Get button variant based on theme
  const getButtonVariant = () => theme === "dark" 
    ? "bg-[#2b0c0c]/50 border-red-500/20 hover:bg-[#2b0c0c] hover:border-[#d6211e]/50 text-white"
    : "bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400 text-red-900"

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <TooltipProvider>
        <SidebarProvider style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
          <div className={`flex h-screen w-full ${getBgColor()} ${getTextColor()} overflow-hidden transition-colors duration-300`}>
            
            {/* --- SIDEBAR (Collapsible) --- */}
            <div 
              className={`hidden md:block transition-all duration-300 ease-in-out border-r ${getSidebarBorder()} ${getSidebarBg()} ${
                isSidebarCollapsed ? "w-16" : "w-64"
              }`}
            >
              <Sidebar collapsible="none" className={`h-full w-full border-none ${getSidebarBg()}`}>
                <SidebarHeader className={`px-6 py-6 ${isSidebarCollapsed ? "px-2" : ""}`}>
                  <Link href={"/"}>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center">
                        <img
                          src="/assets/vidspirelogo.png"
                          alt="Videspire Logo"
                          width={80}
                          height={80}
                          className={`object-contain transition-all duration-300 ${
                            isSidebarCollapsed ? "w-14 h-14" : "w-20 h-20 -my-6"
                          }`}
                        />
                      </div>
                      {!isSidebarCollapsed && (
                        <div>
                          <h2 className={`font-bold ${getTextColor()} text-lg tracking-wide`}>Vidly</h2>
                        </div>
                      )}
                    </div>
                  </Link>
                </SidebarHeader>

                <SidebarContent className={`px-4 ${isSidebarCollapsed ? "px-2" : ""}`}>
                  <SidebarGroup>
                    {!isSidebarCollapsed && (
                      <div className="px-2 pb-3 pt-2">
                        <span className={`${theme === "dark" ? "text-neutral-600" : "text-gray-500"} text-[11px] font-bold tracking-wider uppercase`}>Tools</span>
                      </div>
                    )}
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-1">
                        {menuItems.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            {isSidebarCollapsed ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    asChild
                                    className={`h-11 w-full justify-center rounded-md px-0 transition-all duration-200 ${
                                      item.isActive
                                        ? "bg-[#d6211e] text-white shadow-[0_0_15px_rgba(214,33,30,0.3)] hover:bg-[#b02e2b]"
                                        : `${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`
                                    }`}
                                  >
                                    <a href="#" className="flex items-center justify-center">
                                      <item.icon 
                                        className={`h-4 w-4 ${
                                          item.isActive ? "text-white" : `${theme === "dark" ? "text-neutral-500 group-hover:text-white" : "text-gray-400 group-hover:text-gray-800"}`
                                        }`} 
                                      />
                                    </a>
                                  </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" className={`${theme === "dark" ? "bg-neutral-900 border-neutral-800 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                                  <p className="font-medium">{item.title}</p>
                                  {item.disabled && (
                                    <p className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-500"} mt-1`}>Coming soon</p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <SidebarMenuButton
                                asChild
                                className={`h-11 w-full justify-start rounded-md px-3 transition-all duration-200 ${
                                  item.isActive
                                    ? "bg-[#d6211e] text-white shadow-[0_0_15px_rgba(214,33,30,0.3)] hover:bg-[#b02e2b]"
                                    : `${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`
                                }`}
                              >
                                <a href="#" className="flex items-center">
                                  <item.icon 
                                    className={`mr-3 h-4 w-4 ${
                                      item.isActive ? "text-white" : `${theme === "dark" ? "text-neutral-500 group-hover:text-white" : "text-gray-500 group-hover:text-gray-800"}`
                                    }`} 
                                  />
                                  <span className="font-medium text-sm">{item.title}</span>
                                  {item.disabled && (
                                    <Badge className={`ml-auto text-[10px] h-5 ${theme === "dark" ? "bg-neutral-900 text-neutral-500 border-neutral-800" : "bg-gray-200 text-gray-600 border-gray-300"} px-1.5 hover:bg-neutral-900`}>
                                      Coming
                                    </Badge>
                                  )}
                                </a>
                              </SidebarMenuButton>
                            )}
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>

                  {/* Theme Toggle in Sidebar */}
                  {!isSidebarCollapsed && (
                    <div className={`mt-auto px-3 py-4 border-t ${theme === "dark" ? "border-neutral-900" : "border-gray-200"}`}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                        onClick={toggleTheme}
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="mr-3 h-4 w-4" />
                            <span className="font-medium text-sm">Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="mr-3 h-4 w-4" />
                            <span className="font-medium text-sm">Dark Mode</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </SidebarContent>
              </Sidebar>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className={`flex flex-1 flex-col overflow-hidden ${getBgColor()}`}>
              
              {/* Header with Collapse Button and Theme Toggle */}
              <header className={`flex h-18 items-center justify-between px-8 py-4 ${theme === "dark" ? "border-b border-neutral-900" : "border-b border-gray-200"}`}>
                <div className="flex items-center gap-4">
                  <div className="md:hidden">
                    <SidebarTrigger />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`hidden md:flex h-9 w-9 ${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                        onClick={toggleSidebar}
                        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                      >
                        {isSidebarCollapsed ? (
                          <PanelLeftOpen className="h-4 w-4" />
                        ) : (
                          <PanelLeftClose className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className={`${theme === "dark" ? "bg-neutral-900 border-neutral-800 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                      <p>{isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex-col">
                    <h1 className={`text-lg font-semibold ${getTextColor()}`}>Dashboard Overview</h1>
                    <p className={`text-xs ${getDescriptionText()} mt-0.5`}>A quick snapshot of your YouTube strategy tools.</p>
                  </div>
                </div>

                {/* Theme Toggle in Header (for collapsed sidebar) */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 ${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                      onClick={toggleTheme}
                      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className={`${theme === "dark" ? "bg-neutral-900 border-neutral-800 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                    <p>{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</p>
                  </TooltipContent>
                </Tooltip>
              </header>

              <main className={`flex-1 overflow-y-auto py-4 transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? "pl-8 pr-8" : "pl-8 pr-8" 
              }`}>
                <div className={`max-w-7xl space-y-10 mx-auto ${
                  isSidebarCollapsed ? "max-w-full" : ""
                }`}>
                  
                  {/* Quick Access Cards - Responsive Grid */}
                  <section>
                    <h2 className={`text-sm font-semibold ${getHeaderText()} mb-4`}>Quick Access</h2>
                    <div className={`grid gap-4 ${
                      isSidebarCollapsed ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                    }`}>
                      {toolCards.map((tool) => {
                        const Icon = tool.icon
                        return (
                          <Card
                            key={tool.title}
                            className={`bg-gradient-to-br ${getCardClass(tool)} border hover:border-opacity-100 transition-all cursor-pointer group`}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                  <Icon className={`w-5 h-5 ${tool.iconColor} group-hover:text-white transition-colors`} />
                                </div>
                              </div>
                              <CardTitle className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} mt-2`}>
                                {tool.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} leading-relaxed`}>{tool.description}</p>
                              <div className={`mt-3 flex items-center text-xs ${theme === "dark" ? "text-neutral-500" : "text-gray-500"} group-hover:text-white transition-colors`}>
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
                    <h2 className={`text-sm font-semibold ${getHeaderText()} mb-4`}>Recent Analyses</h2>
                    <Card className={`${getCardBg()} ${theme === "dark" ? "border-neutral-800" : "border-gray-300"} border-dashed`}>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className={`rounded-full ${theme === "dark" ? "bg-neutral-800/50" : "bg-gray-200"} p-3 mb-3`}>
                          <MessageSquare className={`w-5 h-5 ${theme === "dark" ? "text-neutral-500" : "text-gray-400"}`} />
                        </div>
                        <p className={`text-sm font-medium ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                          You haven't analyzed anything yet.
                        </p>
                        <p className={`text-xs mt-1 ${theme === "dark" ? "text-neutral-500" : "text-gray-500"}`}>
                          Get started by choosing a tool above to begin your analysis.
                        </p>
                      </CardContent>
                    </Card>
                  </section>

                  {/* Get Started Section */}
                  <section>
                    <h2 className={`text-sm font-bold ${theme === "dark" ? "text-neutral-200" : "text-gray-700"} mb-4`}>Get Started</h2>
                    <Card className={`bg-gradient-to-r ${theme === "dark" ? "from-[#1a0505] to-[#0f1623] border-red-900/20" : "from-red-50 to-blue-50 border-red-200"} overflow-hidden relative`}>
                      <CardHeader className="pb-8 z-10 relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>
                              Choose a tool to get started
                            </CardTitle>
                            <CardDescription className={theme === "dark" ? "text-neutral-400" : "text-gray-600"}>
                              Pick one of our AI-powered tools to analyze your YouTube channel and get actionable insights.
                            </CardDescription>
                          </div>
                          <Sparkles className={`w-5 h-5 ${theme === "dark" ? "text-[#d6211e]" : "text-red-500"}`} />
                        </div>
                      </CardHeader>
                      <CardContent className="z-10 relative">
                        <div className={`grid gap-4 ${
                          isSidebarCollapsed ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-4"
                        }`}>
                          <Button variant="outline" className={`${getButtonVariant()} h-12`}>
                            Analyze Comments
                          </Button>
                          <Button variant="outline" className={`${getButtonVariant()} h-12`}>
                            Find Topics
                          </Button>
                          <Button variant="outline" className={`${getButtonVariant()} h-12`}>
                            Audit a Channel
                          </Button>
                          <Button variant="outline" className={`${getButtonVariant()} h-12`}>
                            Validate Idea
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  {/* Coming Soon Section */}
                  <section>
                    <h2 className={`text-sm font-bold ${theme === "dark" ? "text-neutral-200" : "text-gray-700"} mb-4`}>Coming Soon</h2>
                    <Card className={`${getComingSoonBg()} ${getComingSoonBorder()}`}>
                      <CardContent className="p-6">
                        <p className={`text-sm mb-6 ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                          We're continuously building new features to help you grow. Stay tuned!
                        </p>
                        
                        <div className={`grid gap-4 ${
                          isSidebarCollapsed ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-3"
                        }`}>
                          {/* Item 1 */}
                          <div className={`h-12 rounded-md border ${theme === "dark" ? "border-neutral-800 bg-[#0f0f0f]" : "border-gray-300 bg-gray-100"} flex items-center px-4 justify-between ${theme === "dark" ? "opacity-60" : "opacity-80"}`}>
                            <div className="flex items-center gap-3">
                              <Eye className={`w-4 h-4 ${theme === "dark" ? "text-neutral-500" : "text-gray-400"}`} />
                              <span className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>Competitor Analysis</span>
                            </div>
                            <Badge variant="secondary" className={`${theme === "dark" ? "bg-neutral-800 text-neutral-500" : "bg-gray-200 text-gray-600"} text-[10px] h-5`}>
                              Soon
                            </Badge>
                          </div>

                          {/* Item 2 */}
                          <div className={`h-12 rounded-md border ${theme === "dark" ? "border-neutral-800 bg-[#0f0f0f]" : "border-gray-300 bg-gray-100"} flex items-center px-4 justify-between ${theme === "dark" ? "opacity-60" : "opacity-80"}`}>
                            <div className="flex items-center gap-3">
                              <Search className={`w-4 h-4 ${theme === "dark" ? "text-neutral-500" : "text-gray-400"}`} />
                              <span className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>Keyword Explorer</span>
                            </div>
                            <Badge variant="secondary" className={`${theme === "dark" ? "bg-neutral-800 text-neutral-500" : "bg-gray-200 text-gray-600"} text-[10px] h-5`}>
                              Soon
                            </Badge>
                          </div>

                          {/* Item 3 */}
                          <div className={`h-12 rounded-md border ${theme === "dark" ? "border-neutral-800 bg-[#0f0f0f]" : "border-gray-300 bg-gray-100"} flex items-center px-4 justify-between ${theme === "dark" ? "opacity-60" : "opacity-80"}`}>
                            <div className="flex items-center gap-3">
                              <FileText className={`w-4 h-4 ${theme === "dark" ? "text-neutral-500" : "text-gray-400"}`} />
                              <span className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>Script Generator</span>
                            </div>
                            <Badge variant="secondary" className={`${theme === "dark" ? "bg-neutral-800 text-neutral-500" : "bg-gray-200 text-gray-600"} text-[10px] h-5`}>
                              Soon
                            </Badge>
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
      </TooltipProvider>
    </ThemeContext.Provider>
  )
}