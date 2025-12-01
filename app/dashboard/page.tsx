"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import FoodInput from "@/app/components/FoodInput"
import RestaurantList from "@/app/components/RestaurantList"
import type { FoodRecognitionResult, Restaurant, UserLocation } from "@/types"
import { saveClassification } from "@/lib/history"

// Inline SVG Icons for premium design
const ChefHatIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
    <path d="M6 17h12" />
  </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
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
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const SearchXIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m13.5 8.5-5 5" />
    <path d="m8.5 8.5 5 5" />
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const CameraIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
)

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
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
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
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const WaveIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12h.01" />
    <path d="M5 12a5 5 0 0 1 5-5" />
    <path d="M5 12a9 9 0 0 1 9-9" />
  </svg>
)

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [currentFood, setCurrentFood] = useState<string>("")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [error, setError] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [lastImagePreview, setLastImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setUserLocation({ lat: 40.7128, lng: -74.006 })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLocationError(null)
      },
      (error) => {
        console.error("Error getting location:", error)
        setLocationError("Could not get your location. Using default location.")
        setUserLocation({ lat: 40.7128, lng: -74.006 })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  const searchRestaurants = async (foodName: string) => {
    if (!userLocation) {
      setError("Location not available. Please allow location access.")
      return
    }

    setIsLoading(true)
    setError(null)
    setCurrentFood(foodName)

    try {
      const response = await fetch("/api/search-restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodName,
          location: userLocation,
          radius: 5000,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to search restaurants")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to search restaurants")
      }

      setRestaurants(data.restaurants || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error searching restaurants")
      setRestaurants([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFoodRecognized = (result: FoodRecognitionResult) => {
    if (result.success && result.foodName) {
      saveClassification(
        {
          foodName: result.foodName,
          confidence: result.confidence,
          labels: result.labels,
          imagePreview: lastImagePreview || undefined,
        },
        session?.user?.id,
      )

      searchRestaurants(result.foodName)
    } else {
      setError("Could not recognize food. Please try again or enter manually.")
    }
  }

  const handleManualInput = (foodName: string) => {
    saveClassification(
      {
        foodName,
        confidence: 1.0,
        labels: [foodName],
      },
      session?.user?.id,
    )

    searchRestaurants(foodName)
  }

  const handleImageSelected = (imageDataUrl: string) => {
    setLastImagePreview(imageDataUrl)
  }

  const handleRetry = () => {
    setRestaurants([])
    setCurrentFood("")
    setError(null)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pb-16 md:pb-0 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl shadow-violet-500/20">
              <ChefHatIcon className="w-10 h-10 text-violet-400 animate-pulse" />
            </div>
            {/* Orbiting particles */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="absolute -top-2 left-1/2 w-2 h-2 bg-violet-400 rounded-full" />
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "4s", animationDirection: "reverse" }}
            >
              <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-fuchsia-400 rounded-full" />
            </div>
          </div>
          <p className="text-lg text-white/80 font-medium mt-6 tracking-wide">Loading your dashboard</p>
          <p className="text-sm text-white/40 mt-1">Just a moment...</p>
        </div>
      </div>
    )
  }

  const firstName = session?.user?.name?.split(" ")[0] || "Explorer"

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24 md:pb-8 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        {/* Premium Header */}
        <div className="mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/25">
                <ChefHatIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Welcome back</h1>
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  {firstName}
                </span>
              </div>
              <p className="text-white/50 mt-2 text-base md:text-lg max-w-xl">
                Discover amazing restaurants by uploading a food photo or searching manually
              </p>
            </div>
          </div>
        </div>

        {/* Location Status - Warning */}
        {locationError && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-2xl blur opacity-30" />
              <div className="relative p-4 bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangleIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm md:text-base text-amber-200 font-medium">{locationError}</p>
                  <button
                    onClick={getUserLocation}
                    className="text-amber-400 hover:text-amber-300 text-sm mt-2 font-medium inline-flex items-center gap-1 group/btn"
                  >
                    <WaveIcon className="w-4 h-4 group-hover/btn:animate-pulse" />
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Status - Success */}
        {userLocation && !locationError && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-2xl blur opacity-20" />
              <div className="relative p-4 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm md:text-base text-emerald-200 font-medium">Location detected successfully</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Food Input Component */}
        <div
          className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700"
          style={{ animationDelay: "100ms" }}
        >
          <FoodInput
            onFoodRecognized={handleFoodRecognized}
            onFoodManualInput={handleManualInput}
            onImageSelected={handleImageSelected}
            isLoading={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/50 to-rose-500/50 rounded-2xl blur opacity-30" />
              <div className="relative p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl">
                <p className="text-sm md:text-base text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Premium Loading State */}
        {isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-violet-600/30 rounded-3xl blur-xl animate-pulse" />
              <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-12 text-center overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse" />
                </div>

                <div className="relative z-10">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl animate-pulse" />
                    <div className="absolute inset-[2px] bg-[#0a0a0f] rounded-[22px] flex items-center justify-center">
                      <div className="relative">
                        <MapPinIcon className="w-8 h-8 text-violet-400" />
                        <div className="absolute inset-0 animate-ping">
                          <MapPinIcon className="w-8 h-8 text-violet-400 opacity-50" />
                        </div>
                      </div>
                    </div>
                    {/* Orbiting dots */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50" />
                    </div>
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{ animationDuration: "3s", animationDirection: "reverse" }}
                    >
                      <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 bg-fuchsia-400 rounded-full shadow-lg shadow-fuchsia-400/50" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Searching for restaurants</h3>
                  <p className="text-white/50 text-lg">
                    Finding the best places serving{" "}
                    <span className="font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                      {currentFood}
                    </span>
                  </p>

                  {/* Progress bar */}
                  <div className="mt-8 max-w-xs mx-auto">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
                        style={{ width: "60%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Results */}
        {!isLoading && currentFood && restaurants.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <RestaurantList restaurants={restaurants} foodName={currentFood} />
            <div className="mt-8 text-center">
              <button
                onClick={handleRetry}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium transition-all duration-300"
              >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Start a new search
              </button>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && currentFood && restaurants.length === 0 && !error && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-3xl blur-xl" />
              <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <SearchXIcon className="w-10 h-10 text-white/30" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">No restaurants found</h3>
                <p className="text-white/50 mb-8 text-lg max-w-md mx-auto">
                  We couldn't find any restaurants serving{" "}
                  <span className="font-semibold text-white/70">{currentFood}</span> nearby.
                </p>
                <button
                  onClick={handleRetry}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Try Again</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How It Works - Premium Version */}
        {!currentFood && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-10 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-fuchsia-600/10 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">How it works</h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: CameraIcon,
                        step: "01",
                        title: "Upload or Type",
                        description: "Upload a photo of food or manually enter what you're craving",
                        gradient: "from-violet-500 to-indigo-500",
                        glow: "violet",
                      },
                      {
                        icon: SparklesIcon,
                        step: "02",
                        title: "AI Recognition",
                        description: "Our AI identifies the food and finds matching restaurants",
                        gradient: "from-fuchsia-500 to-pink-500",
                        glow: "fuchsia",
                      },
                      {
                        icon: MapPinIcon,
                        step: "03",
                        title: "Discover Nearby",
                        description: "Browse nearby restaurants and find your perfect meal",
                        gradient: "from-pink-500 to-rose-500",
                        glow: "pink",
                      },
                    ].map((item, index) => (
                      <div
                        key={item.step}
                        className="group/card relative"
                        style={{ animationDelay: `${(index + 1) * 100}ms` }}
                      >
                        <div
                          className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-0 group-hover/card:opacity-30 transition-opacity duration-500`}
                        />
                        <div className="relative h-full bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 p-6 transition-all duration-500">
                          {/* Step number */}
                          <div className="absolute top-4 right-4 text-4xl font-bold text-white/[0.03] select-none">
                            {item.step}
                          </div>

                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-[1px] mb-5 group-hover/card:scale-110 transition-transform duration-500`}
                          >
                            <div className="w-full h-full rounded-2xl bg-[#0a0a0f]/90 flex items-center justify-center">
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          <h3 className="font-semibold text-white text-lg mb-2 group-hover/card:text-transparent group-hover/card:bg-gradient-to-r group-hover/card:from-white group-hover/card:to-white/80 group-hover/card:bg-clip-text transition-all duration-300">
                            {item.title}
                          </h3>
                          <p className="text-white/40 text-sm leading-relaxed group-hover/card:text-white/50 transition-colors duration-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom animation keyframes */}
      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
