"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  getUserInsights,
  hasEnoughDataForRecommendations,
  fetchAIRecommendations,
  type AIFoodRecommendation,
} from "@/lib/recommendations"
import { Restaurant } from "@/types"
import RestaurantList from "@/app/components/RestaurantList"

// Inline SVG Icons as components
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
)

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const BrainIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const StarIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const DollarSignIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const UtensilsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ZapIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

export default function RecommendationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [aiRecommendations, setAiRecommendations] = useState<AIFoodRecommendation[]>([])
  const [insights, setInsights] = useState<any>(null)
  const [hasEnoughData, setHasEnoughData] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      const hasData = hasEnoughDataForRecommendations(session.user.id)
      const userInsights = getUserInsights(session.user.id)
      setInsights(userInsights)
      setHasEnoughData(hasData)

      if (hasData) {
        loadAIRecommendations()
      }
    }
  }, [session?.user?.id])

  const loadAIRecommendations = async () => {
    setAiLoading(true)
    try {
      const aiRecs = await fetchAIRecommendations(session?.user?.id)
      setAiRecommendations(aiRecs)

      if (aiRecs.length > 0) {
        searchRecommendation(aiRecs[0].foodName)
        setSelectedRecommendation(aiRecs[0].foodName)
      }
    } catch (error) {
      console.error("Error loading AI recommendations:", error)
    } finally {
      setAiLoading(false)
    }
  }

  const searchRecommendation = async (query: string) => {
    setLoading(true)
    setSelectedRecommendation(query)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      const response = await fetch("/api/search-restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodName: query,
          location,
          radius: 5000,
        }),
      })

      const data = await response.json()

      if (data.success && data.restaurants) {
        setRestaurants(data.restaurants)
      } else {
        setRestaurants([])
      }
    } catch (error) {
      console.error("Error searching recommendation:", error)
      try {
        const response = await fetch("/api/search-restaurants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foodName: query,
            location: { lat: 53.3498, lng: -6.2603 },
            radius: 5000,
          }),
        })

        const data = await response.json()

        if (data.success && data.restaurants) {
          setRestaurants(data.restaurants)
        } else {
          setRestaurants([])
        }
      } catch (fallbackError) {
        console.error("Fallback search failed:", fallbackError)
        setRestaurants([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative text-center space-y-6">
          {/* Animated loader */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-violet-500/20 glass glass-border flex items-center justify-center animate-float">
              <SparklesIcon className="w-9 h-9 text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <BrainIcon className="w-4 h-4 text-white" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-primary rounded-full" />
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "4s", animationDirection: "reverse" }}
            >
              <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-violet-400 rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Loading recommendations</h2>
            <p className="text-sm text-muted-foreground">Preparing your personalized suggestions...</p>
          </div>

          {/* Loading bar */}
          <div className="w-48 h-1 mx-auto bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-full animate-shimmer rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  // Not enough data view
  if (!hasEnoughData) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-8 relative">
        {/* Ambient background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        {/* Header Section */}
        <header className="border-b border-border/50 glass sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-violet-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Recommendations</h1>
                <p className="text-sm text-muted-foreground">Personalized suggestions based on your history</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
            {/* Icon Container */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-3xl blur-2xl" />
              <div className="relative w-24 h-24 rounded-3xl glass glass-border flex items-center justify-center">
                <AlertCircleIcon className="w-12 h-12 text-primary" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full opacity-60" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-violet-500 rounded-full opacity-60" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">Not Enough Data Yet</h2>
            <p className="text-base text-muted-foreground text-center max-w-lg mb-8">
              We need at least <span className="font-semibold gradient-text">10 unique entries</span> (food searches or
              viewed restaurants) to generate personalized recommendations for you.
            </p>

            {/* Progress Card */}
            <div className="w-full max-w-md glass glass-border rounded-3xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5 text-primary" />
                Current Progress
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UtensilsIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Food Searches</span>
                  </div>
                  <span className="font-bold text-foreground">{insights?.totalClassifications || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <MapPinIcon className="w-4 h-4 text-violet-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Viewed Restaurants</span>
                  </div>
                  <span className="font-bold text-foreground">{insights?.totalViewedRestaurants || 0}</span>
                </div>

                <div className="h-px bg-border/50 my-4" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total Entries</span>
                  <span className="text-2xl font-bold gradient-text">{insights?.totalUniqueEntries || 0} / 10</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(((insights?.totalUniqueEntries || 0) / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="w-full max-w-md glass glass-border rounded-3xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <h3 className="text-lg font-bold text-foreground mb-4">To unlock recommendations:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Upload food photos or search for restaurants</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Click "Learn More" on restaurants to view details
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Keep exploring until you reach 10 entries</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-violet-500 text-white font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 button-glow"
            >
              <SearchIcon className="w-5 h-5" />
              <span>Start Exploring</span>
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 relative">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-violet-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Your Recommendations</h1>
              <p className="text-sm text-muted-foreground">
                Based on <span className="gradient-text font-semibold">{insights?.totalUniqueEntries}</span> entries in
                your history
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Insights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <InsightCard
            icon={<TrendingUpIcon className="w-5 h-5 text-primary" />}
            iconBg="bg-primary/10"
            label="Top Food Category"
            value={insights?.topFoodCategories[0]?.name || "N/A"}
            subtext={`Searched ${insights?.topFoodCategories[0]?.count || 0} times`}
            delay={0}
          />
          <InsightCard
            icon={<StarIcon className="w-5 h-5 text-amber-400" filled />}
            iconBg="bg-amber-500/10"
            label="Average Rating"
            value={insights?.averageRating?.toFixed(1) || "N/A"}
            subtext="From viewed restaurants"
            delay={75}
          />
          <InsightCard
            icon={<DollarSignIcon className="w-5 h-5 text-emerald-400" />}
            iconBg="bg-emerald-500/10"
            label="Price Preference"
            value={insights?.preferredPriceLevel ? "$".repeat(insights.preferredPriceLevel) : "N/A"}
            subtext="Most common choice"
            delay={150}
          />
        </div>

        {/* AI-Powered Recommendation Cards */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-md opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BrainIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI-Powered Recommendations</h2>
              <p className="text-sm text-muted-foreground">Personalized suggestions based on your taste preferences</p>
            </div>
          </div>

          {aiLoading ? (
            <div className="glass glass-border rounded-3xl p-12 text-center animate-fade-in-up">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 glass glass-border flex items-center justify-center">
                  <BrainIcon className="w-7 h-7 text-violet-500 animate-pulse" />
                </div>
                {/* Orbiting dots */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
                  <div className="absolute -top-1 left-1/2 w-2 h-2 bg-violet-500 rounded-full" />
                </div>
              </div>
              <p className="text-foreground font-medium mb-2">AI is analyzing your preferences...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          ) : aiRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiRecommendations.map((rec, index) => (
                <RecommendationCard
                  key={index}
                  recommendation={rec}
                  index={index}
                  isSelected={selectedRecommendation === rec.foodName}
                  isHovered={hoveredCard === index}
                  onHover={() => setHoveredCard(index)}
                  onLeave={() => setHoveredCard(null)}
                  onClick={() => searchRecommendation(rec.foodName)}
                />
              ))}
            </div>
          ) : (
            <div className="glass glass-border rounded-3xl p-8 text-center">
              <p className="text-muted-foreground">Loading AI recommendations...</p>
            </div>
          )}
        </div>

        {/* Restaurant Results */}
        {loading ? (
          <div className="glass glass-border rounded-3xl p-12 text-center animate-fade-in-up">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-2xl blur-xl" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 glass glass-border flex items-center justify-center">
                <MapPinIcon className="w-7 h-7 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-foreground font-medium mb-2">Finding restaurants for you...</p>
            <p className="text-sm text-muted-foreground">Searching nearby locations</p>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 glass glass-border flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Results for "<span className="gradient-text">{selectedRecommendation}</span>"
              </h2>
            </div>
            <RestaurantList restaurants={restaurants} foodName={selectedRecommendation || ""} />
          </div>
        ) : selectedRecommendation ? (
          <div className="glass glass-border rounded-3xl p-12 text-center animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary/50 flex items-center justify-center">
              <SearchIcon className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-2">No restaurants found</p>
            <p className="text-sm text-muted-foreground">Try another recommendation!</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}

// Insight Card Component
function InsightCard({
  icon,
  iconBg,
  label,
  value,
  subtext,
  delay,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  subtext: string
  delay: number
}) {
  return (
    <div
      className="glass glass-border rounded-2xl p-5 card-hover animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>{icon}</div>
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      </div>
      <p className="text-2xl font-bold text-foreground capitalize">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </div>
  )
}

// Recommendation Card Component
function RecommendationCard({
  recommendation,
  index,
  isSelected,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  recommendation: AIFoodRecommendation
  index: number
  isSelected: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        group relative text-left p-5 rounded-2xl transition-all duration-300 card-hover
        animate-fade-in-up
        ${
          isSelected
            ? "glass gradient-border bg-gradient-to-br from-primary/5 to-violet-500/5"
            : "glass glass-border hover:border-primary/30"
        }
        ${isHovered && !isSelected ? "gradient-border" : ""}
      `}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-foreground text-lg">{recommendation.foodName}</h3>
        <span
          className={`
            text-xs font-bold px-2.5 py-1 rounded-lg transition-all duration-300
            ${isSelected ? "bg-gradient-to-r from-primary to-violet-500 text-white" : "bg-primary/10 text-primary"}
          `}
        >
          {recommendation.confidence}%
        </span>
      </div>

      <div className="mb-3">
        <span className="text-xs font-medium text-muted-foreground bg-secondary/80 px-3 py-1 rounded-lg border border-border/50">
          {recommendation.cuisineType}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{recommendation.reason}</p>

      <div
        className={`
          flex items-center gap-2 text-sm font-semibold transition-all duration-300
          ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"}
        `}
      >
        <SearchIcon className="w-4 h-4" />
        <span>Find Restaurants</span>
        <ChevronRightIcon
          className={`w-4 h-4 transition-transform duration-300 ${isHovered || isSelected ? "translate-x-1" : ""}`}
        />
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 bg-gradient-to-r from-primary to-violet-500 rounded-full animate-pulse" />
        </div>
      )}
    </button>
  )
}
