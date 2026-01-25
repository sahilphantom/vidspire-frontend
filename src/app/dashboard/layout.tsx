"use client"

import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Search,
  CheckCircle,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect, createContext, useContext } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

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
} from "@/components/ui/sidebar"
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

// --- Menu Configuration ---
const menuItems = [
  { title: "Command Center", icon: BarChart3, href: "/dashboard" },
  { title: "Audience Mind-Reader", icon: MessageSquare, href: "/dashboard/comment-analyzer" },
  { title: "Advanced Viral Search", icon: TrendingUp, href: "/dashboard/viral-search" },
  { title: "Idea Validator", icon: CheckCircle, href: "/dashboard/idea-validator" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings", disabled: true },
]

// ✅ PAGE TRANSITION VARIANTS
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1], // Custom easing for smooth motion
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    filter: "blur(10px)",
    transition: {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light")
    setTheme(initialTheme)
    document.documentElement.classList.add(initialTheme)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Styles Helpers
  const getBgColor = () => theme === "dark" ? "bg-black" : "bg-white"
  const getTextColor = () => theme === "dark" ? "text-white" : "text-gray-900"
  const getSidebarBg = () => theme === "dark" ? "bg-black" : "bg-white"
  const getSidebarBorder = () => theme === "dark" ? "border-neutral-900" : "border-gray-200"
  const getDescriptionText = () => theme === "dark" ? "text-neutral-500" : "text-gray-500"

  // Sidebar Component (Reused for Desktop and Mobile)
  const SidebarContentBlock = () => (
    <>
      <SidebarHeader className={`px-6 py-6 ${isSidebarCollapsed ? "md:px-2" : ""}`}>
        <Link href={"/"}>
          <div className="flex items-center">
            <div className="flex items-center justify-center">
              <img
                src="/assets/vidspirelogo.png"
                alt="Videspire Logo"
                width={80}
                height={80}
                className={`object-contain transition-all duration-300 ${
                  isSidebarCollapsed ? "w-16 h-16" : "w-20 h-20 -my-6"
                }`}
              />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h2 className={`font-bold ${getTextColor()} ${spaceGrotesk.className} text-lg tracking-wide`}>Vidly</h2>
              </div>
            )}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className={`px-4 ${isSidebarCollapsed ? "md:px-2" : ""}`}>
        <SidebarGroup>
          {!isSidebarCollapsed && (
            <div className="px-2 pb-3 pt-2">
              <span className={`${theme === "dark" ? "text-neutral-600" : "text-gray-500"} text-[11px] font-bold tracking-wider uppercase`}>Tools</span>
            </div>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.title}>
                    {isSidebarCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            disabled={item.disabled}
                            className={`h-11 w-full justify-center rounded-md px-0 transition-all duration-200 ${
                              isActive
                                ? "bg-[#B02E2B] text-white shadow-[0_0_15px_rgba(214,33,30,0.3)] hover:bg-[#b02e2b]"
                                : `${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`
                            }`}
                          >
                            <Link href={item.disabled ? "#" : item.href} className="flex items-center justify-center">
                              <item.icon 
                                className={`h-4 w-4 ${
                                  isActive ? "text-white" : `${theme === "dark" ? "text-neutral-500 group-hover:text-white" : "text-gray-400 group-hover:text-gray-800"}`
                                }`} 
                              />
                            </Link>
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
                        disabled={item.disabled}
                        className={`h-11 w-full justify-start rounded-md px-3 transition-all duration-200 ${
                          isActive
                            ? "bg-[#B02E2B] text-white shadow-[0_0_15px_rgba(214,33,30,0.3)] hover:bg-[#b02e2b]"
                            : `${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`
                        }`}
                      >
                        <Link href={item.disabled ? "#" : item.href} className="flex items-center">
                          <item.icon 
                            className={`mr-3 h-4 w-4 ${
                              isActive ? "text-white" : `${theme === "dark" ? "text-neutral-500 group-hover:text-white" : "text-gray-500 group-hover:text-gray-800"}`
                            }`} 
                          />
                          <span className="font-medium text-sm">{item.title}</span>
                          {item.disabled && (
                            <Badge className={`ml-auto text-[10px] h-5 ${theme === "dark" ? "bg-neutral-900 text-neutral-500 border-neutral-800" : "bg-gray-200 text-gray-600 border-gray-300"} px-1.5 hover:bg-neutral-900`}>
                              Coming
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
    </>
  )

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <TooltipProvider>
        <SidebarProvider style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
          <div className={`flex h-screen w-full ${getBgColor()} ${getTextColor()} overflow-hidden transition-colors duration-300`}>
            
            {/* --- DESKTOP SIDEBAR --- */}
            <div 
              className={`hidden md:block transition-all duration-300 ease-in-out border-r ${getSidebarBorder()} ${getSidebarBg()} ${
                isSidebarCollapsed ? "w-16" : "w-64"
              }`}
            >
              <Sidebar collapsible="none" className={`h-full w-full border-none ${getSidebarBg()}`}>
                <SidebarContentBlock />
              </Sidebar>
            </div>

            {/* --- MOBILE SIDEBAR (Drawer) --- */}
            <div 
              className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div 
              className={`fixed top-0 left-0 z-50 h-full w-64 ${getSidebarBg()} border-r ${getSidebarBorder()} transition-transform duration-300 ease-in-out md:hidden ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`absolute right-4 top-4 p-2 rounded-md ${theme === "dark" ? "text-neutral-400 hover:bg-neutral-900" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="pt-2">
                 <Sidebar collapsible="none" className={`h-full w-full border-none ${getSidebarBg()}`}>
                    <SidebarContentBlock />
                 </Sidebar>
              </div>
            </div>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className={`flex flex-1 flex-col overflow-hidden ${getBgColor()}`}>
              
              {/* Header */}
              <header className={`flex h-18 items-center justify-between px-4 md:px-8 py-4 ${theme === "dark" ? "border-b border-neutral-900" : "border-b border-gray-200"}`}>
                <div className="flex items-center gap-4">
                  <div className="md:hidden">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleMobileMenu}
                      className={theme === "dark" ? "text-neutral-400" : "text-gray-600"}
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`hidden md:flex h-9 w-9 ${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                        onClick={toggleSidebar}
                      >
                        {isSidebarCollapsed ? (
                          <PanelLeftOpen className="h-4 w-4" />
                        ) : (
                          <PanelLeftClose className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex-col">
                    <h1 className={`text-lg font-semibold ${getTextColor()}`}>Command Center</h1>
                    <p className={`text-xs ${getDescriptionText()} mt-0.5`}>Your daily intelligence briefing.</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`hidden md:flex h-9 w-9 ${theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </header>

              {/* ✅ DYNAMIC CONTENT WITH PAGE TRANSITIONS */}
              <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? "px-4 md:px-8" : "px-4 md:px-8" 
              }`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="py-4"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>

            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeContext.Provider>
  )
}