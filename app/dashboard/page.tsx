"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getClassificationHistory, getViewedRestaurantsHistory, type FoodClassification, type ViewedRestaurant } from "@/lib/history"

// Inline SVG Icons
const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
)

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

const UtensilsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
)

const ChefHatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
    <path d="M6 17h12" />
  </svg>
)

// Helper functions for analytics
function getWeeklyActivity(classifications: FoodClassification[], restaurants: ViewedRestaurant[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const weekData = days.map((day, index) => {
    const targetDate = new Date(weekAgo)
    targetDate.setDate(targetDate.getDate() + index + 1)
    
    const searches = classifications.filter(c => {
      const date = new Date(c.timestamp)
      return date.toDateString() === targetDate.toDateString()
    }).length
    
    const views = restaurants.filter(r => {
      const date = new Date(r.timestamp)
      return date.toDateString() === targetDate.toDateString()
    }).length
    
    return { day: days[targetDate.getDay()], searches, views, total: searches + views }
  })
  
  return weekData
}

function getTopFoods(classifications: FoodClassification[], limit = 5) {
  const foodCounts: Record<string, number> = {}
  classifications.forEach(c => {
    const food = c.foodName.toLowerCase()
    foodCounts[food] = (foodCounts[food] || 0) + 1
  })
  
  return Object.entries(foodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
}

function getCuisineBreakdown(classifications: FoodClassification[]) {
  const cuisines: Record<string, { count: number; color: string }> = {
    'Italian': { count: 0, color: 'from-red-500 to-orange-500' },
    'Asian': { count: 0, color: 'from-amber-500 to-yellow-500' },
    'Mexican': { count: 0, color: 'from-green-500 to-emerald-500' },
    'American': { count: 0, color: 'from-blue-500 to-indigo-500' },
    'Mediterranean': { count: 0, color: 'from-cyan-500 to-teal-500' },
    'Other': { count: 0, color: 'from-violet-500 to-purple-500' },
  }
  
  const italianKeywords = ['pizza', 'pasta', 'lasagna', 'risotto', 'spaghetti', 'ravioli', 'gnocchi', 'carbonara']
  const asianKeywords = ['sushi', 'ramen', 'pho', 'curry', 'noodles', 'dim sum', 'pad thai', 'teriyaki', 'bibimbap', 'dumplings', 'chinese', 'japanese', 'thai', 'korean', 'vietnamese']
  const mexicanKeywords = ['taco', 'burrito', 'quesadilla', 'nachos', 'enchilada', 'guacamole', 'salsa', 'fajita']
  const americanKeywords = ['burger', 'hot dog', 'steak', 'bbq', 'barbecue', 'wings', 'fries', 'sandwich', 'fried chicken']
  const mediterraneanKeywords = ['hummus', 'falafel', 'shawarma', 'kebab', 'gyro', 'greek', 'tzatziki', 'pita']
  
  classifications.forEach(c => {
    const food = c.foodName.toLowerCase()
    if (italianKeywords.some(k => food.includes(k))) cuisines['Italian'].count++
    else if (asianKeywords.some(k => food.includes(k))) cuisines['Asian'].count++
    else if (mexicanKeywords.some(k => food.includes(k))) cuisines['Mexican'].count++
    else if (americanKeywords.some(k => food.includes(k))) cuisines['American'].count++
    else if (mediterraneanKeywords.some(k => food.includes(k))) cuisines['Mediterranean'].count++
    else cuisines['Other'].count++
  })
  
  const total = Object.values(cuisines).reduce((sum, c) => sum + c.count, 0)
  return Object.entries(cuisines)
    .filter(([_, data]) => data.count > 0)
    .map(([name, data]) => ({
      name,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      color: data.color,
    }))
    .sort((a, b) => b.count - a.count)
}

function getRecentActivity(classifications: FoodClassification[], restaurants: ViewedRestaurant[], limit = 6) {
  const allActivity = [
    ...classifications.map(c => ({ type: 'search' as const, name: c.foodName, timestamp: c.timestamp, imagePreview: c.imagePreview })),
    ...restaurants.map(r => ({ type: 'view' as const, name: r.name, timestamp: r.timestamp, rating: r.rating })),
  ]
  
  return allActivity
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [classifications, setClassifications] = useState<FoodClassification[]>([])
  const [restaurants, setRestaurants] = useState<ViewedRestaurant[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      setClassifications(getClassificationHistory(session.user.id))
      setRestaurants(getViewedRestaurantsHistory(session.user.id))
      setIsLoaded(true)
    }
  }, [session?.user?.id])

  // Computed analytics
  const analytics = useMemo(() => {
    const totalSearches = classifications.length
    const totalViews = restaurants.length
    const avgRating = restaurants.length > 0
      ? restaurants.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / restaurants.filter(r => r.rating).length
      : 0
    const weeklyData = getWeeklyActivity(classifications, restaurants)
    const topFoods = getTopFoods(classifications)
    const cuisineBreakdown = getCuisineBreakdown(classifications)
    const recentActivity = getRecentActivity(classifications, restaurants)
    const maxWeeklyActivity = Math.max(...weeklyData.map(d => d.total), 1)
    
    const now = Date.now()
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    const thisWeekSearches = classifications.filter(c => now - c.timestamp < oneWeek).length
    const lastWeekSearches = classifications.filter(c => now - c.timestamp >= oneWeek && now - c.timestamp < 2 * oneWeek).length
    const searchTrend = lastWeekSearches > 0 ? Math.round(((thisWeekSearches - lastWeekSearches) / lastWeekSearches) * 100) : thisWeekSearches > 0 ? 100 : 0
    
    return {
      totalSearches,
      totalViews,
      avgRating: avgRating.toFixed(1),
      weeklyData,
      topFoods,
      cuisineBreakdown,
      recentActivity,
      maxWeeklyActivity,
      searchTrend,
      thisWeekSearches,
    }
  }, [classifications, restaurants])

  if (status === "loading" || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pb-16 md:pb-0 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl shadow-violet-500/20">
              <ChartBarIcon className="w-10 h-10 text-violet-400 animate-pulse" />
            </div>
          </div>
          <p className="text-lg text-white/80 font-medium mt-6 tracking-wide">Loading your analytics</p>
          <p className="text-sm text-white/40 mt-1">Crunching the numbers...</p>
        </div>
      </div>
    )
  }

  const firstName = session?.user?.name?.split(" ")[0] || "Explorer"
  const hasData = classifications.length > 0 || restaurants.length > 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24 md:pb-8 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/25">
                  <ChartBarIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Welcome Back,</h1>
                  <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                    {firstName}
                  </span>
                </div>
                <p className="text-white/50 mt-2 text-base md:text-lg max-w-xl">
                  Track your food discovery journey and dining insights
                </p>
              </div>
            </div>
            <Link
              href="/search"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-violet-500/25"
            >
              <SearchIcon className="w-4 h-4" />
              New Search
            </Link>
          </div>
        </div>

        {!hasData ? (
          /* Empty State */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-violet-600/30 rounded-3xl blur-xl" />
              <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                  <SparklesIcon className="w-12 h-12 text-violet-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Start Your Food Journey</h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                  Search for your favorite foods to unlock personalized analytics and insights about your dining preferences.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-105"
                  >
                    <SearchIcon className="w-5 h-5" />
                    Search Restaurants
                  </Link>
                  <Link
                    href="/recommendations"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300"
                  >
                    <SparklesIcon className="w-5 h-5" />
                    Get AI Recommendations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
              {/* Total Searches */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-fuchsia-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                      <SearchIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    {analytics.searchTrend !== 0 && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${analytics.searchTrend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        <TrendingUpIcon className={`w-3 h-3 ${analytics.searchTrend < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(analytics.searchTrend)}%
                      </div>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{analytics.totalSearches}</p>
                  <p className="text-sm text-white/50">Total Searches</p>
                </div>
              </div>

              {/* Restaurants Viewed */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600/50 to-pink-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5 text-fuchsia-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{analytics.totalViews}</p>
                  <p className="text-sm text-white/50">Restaurants Viewed</p>
                </div>
              </div>

              {/* Average Rating */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/50 to-orange-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <StarIcon className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{analytics.avgRating}</p>
                  <p className="text-sm text-white/50">Avg. Rating</p>
                </div>
              </div>

              {/* This Week */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/50 to-teal-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{analytics.thisWeekSearches}</p>
                  <p className="text-sm text-white/50">This Week</p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Weekly Activity Chart */}
              <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
                <div className="relative group h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">Weekly Activity</h3>
                        <p className="text-sm text-white/50">Your search patterns this week</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                          <span className="text-white/70">Activity</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-48">
                      {analytics.weeklyData.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="relative w-full flex-1 flex items-end">
                            <div
                              className="w-full bg-gradient-to-t from-violet-600 to-fuchsia-500 rounded-t-lg transition-all duration-500 hover:from-violet-500 hover:to-fuchsia-400"
                              style={{ height: `${(day.total / analytics.maxWeeklyActivity) * 100}%`, minHeight: day.total > 0 ? '8px' : '0' }}
                            />
                          </div>
                          <span className="text-xs text-white/50 font-medium">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Foods */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
                <div className="relative group h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/30 to-orange-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <FireIcon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Top Searches</h3>
                        <p className="text-xs text-white/50">Your favorites</p>
                      </div>
                    </div>
                    {analytics.topFoods.length > 0 ? (
                      <div className="space-y-3">
                        {analytics.topFoods.map((food, index) => (
                          <div key={food.name} className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white/70">
                              {index + 1}
                            </span>
                            <span className="flex-1 text-white font-medium truncate">{food.name}</span>
                            <span className="text-sm text-white/50">{food.count}x</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-sm">Start searching to see your top foods!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cuisine Breakdown */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
                <div className="relative group h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/30 to-teal-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <UtensilsIcon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Cuisine Breakdown</h3>
                        <p className="text-xs text-white/50">Your taste profile</p>
                      </div>
                    </div>
                    {analytics.cuisineBreakdown.length > 0 ? (
                      <div className="space-y-3">
                        {analytics.cuisineBreakdown.slice(0, 5).map((cuisine) => (
                          <div key={cuisine.name} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white font-medium">{cuisine.name}</span>
                              <span className="text-white/50">{cuisine.percentage}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${cuisine.color} rounded-full transition-all duration-500`}
                                style={{ width: `${cuisine.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-sm">Search more to build your taste profile!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "500ms" }}>
                <div className="relative group h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                          <ClockIcon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                          <p className="text-xs text-white/50">Your latest discoveries</p>
                        </div>
                      </div>
                      <Link href="/history" className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1">
                        View All
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                    {analytics.recentActivity.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {analytics.recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              activity.type === 'search' ? 'bg-violet-500/20' : 'bg-fuchsia-500/20'
                            }`}>
                              {activity.type === 'search' ? (
                                <SearchIcon className="w-5 h-5 text-violet-400" />
                              ) : (
                                <MapPinIcon className="w-5 h-5 text-fuchsia-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{activity.name}</p>
                              <p className="text-xs text-white/40">{formatTimeAgo(activity.timestamp)}</p>
                            </div>
                            {activity.type === 'view' && 'rating' in activity && activity.rating && (
                              <div className="flex items-center gap-1 text-amber-400">
                                <StarIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">{activity.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-sm">No recent activity yet. Start exploring!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "600ms" }}>
              <Link href="/search" className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 hover:border-violet-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <CameraIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Photo Search</h4>
                    <p className="text-sm text-white/50">Find by food image</p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-white/30 ml-auto group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
              
              <Link href="/recommendations" className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-white/10 hover:border-amber-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">AI Suggestions</h4>
                    <p className="text-sm text-white/50">Get personalized picks</p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-white/30 ml-auto group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
              
              <Link href="/recipe" className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <ChefHatIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Create Recipe</h4>
                    <p className="text-sm text-white/50">AI-powered recipes</p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-white/30 ml-auto group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
