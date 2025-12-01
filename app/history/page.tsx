"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import {
  getClassificationHistory,
  getViewedRestaurantsHistory,
  deleteClassification,
  deleteViewedRestaurant,
  clearAllHistory,
  type FoodClassification,
  type ViewedRestaurant,
} from "@/lib/history"

// Inline SVG Icons as components
const HistoryIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
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
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
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

const ClockIcon = ({ className }: { className?: string }) => (
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
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
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

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"classifications" | "restaurants">("classifications")
  const [classifications, setClassifications] = useState<FoodClassification[]>([])
  const [restaurants, setRestaurants] = useState<ViewedRestaurant[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user?.id) {
      loadHistory()
    }
  }, [session?.user?.id])

  const loadHistory = useCallback(() => {
    const userId = session?.user?.id
    setClassifications(getClassificationHistory(userId))
    setRestaurants(getViewedRestaurantsHistory(userId))
  }, [session?.user?.id])

  const handleDeleteClassification = async (id: string) => {
    setDeletingId(id)
    await new Promise((resolve) => setTimeout(resolve, 300))
    deleteClassification(id, session?.user?.id)
    loadHistory()
    setDeletingId(null)
  }

  const handleDeleteRestaurant = async (id: string) => {
    setDeletingId(id)
    await new Promise((resolve) => setTimeout(resolve, 300))
    deleteViewedRestaurant(id, session?.user?.id)
    loadHistory()
    setDeletingId(null)
  }

  const handleClearAll = async () => {
    setIsClearing(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    clearAllHistory(session?.user?.id)
    loadHistory()
    setIsClearing(false)
    setShowClearModal(false)
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative text-center space-y-6">
          {/* Animated loader */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-pink-500/20 glass glass-border flex items-center justify-center animate-float">
              <HistoryIcon className="w-9 h-9 text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-primary rounded-full" />
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "4s", animationDirection: "reverse" }}
            >
              <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-pink-400 rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Loading your history</h2>
            <p className="text-sm text-muted-foreground">Gathering your culinary adventures...</p>
          </div>

          {/* Loading bar */}
          <div className="w-48 h-1 mx-auto bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-full animate-shimmer rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  const totalItems = classifications.length + restaurants.length

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 relative">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-pink-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                  <HistoryIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">History</h1>
                <p className="text-sm text-muted-foreground">
                  <span className="gradient-text font-semibold">{totalItems}</span>{" "}
                  {totalItems === 1 ? "item" : "items"} in your collection
                </p>
              </div>
            </div>

            {totalItems > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive rounded-xl hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all duration-300"
              >
                <TrashIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Tab Navigation */}
        <div className="relative mb-8">
          <div className="flex gap-2 p-1.5 glass glass-border rounded-2xl">
            <TabButton
              active={activeTab === "classifications"}
              onClick={() => setActiveTab("classifications")}
              icon={<CameraIcon className="w-4 h-4" />}
              label="Food Searches"
              count={classifications.length}
            />
            <TabButton
              active={activeTab === "restaurants"}
              onClick={() => setActiveTab("restaurants")}
              icon={<MapPinIcon className="w-4 h-4" />}
              label="Restaurants"
              count={restaurants.length}
            />
          </div>
        </div>

        {/* Food Classifications Tab */}
        {activeTab === "classifications" && (
          <div className="space-y-4">
            {classifications.length === 0 ? (
              <EmptyState
                icon={CameraIcon}
                title="No food searches yet"
                description="Upload a photo of food to identify it and see your history here"
                actionLabel="Start searching"
              />
            ) : (
              classifications.map((item, index) => (
                <ClassificationCard
                  key={item.id}
                  item={item}
                  index={index}
                  isDeleting={deletingId === item.id}
                  isHovered={hoveredCard === item.id}
                  onHover={() => setHoveredCard(item.id)}
                  onLeave={() => setHoveredCard(null)}
                  onDelete={() => handleDeleteClassification(item.id)}
                  formatTimestamp={formatTimestamp}
                />
              ))
            )}
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === "restaurants" && (
          <div className="space-y-4">
            {restaurants.length === 0 ? (
              <EmptyState
                icon={MapPinIcon}
                title="No restaurants viewed yet"
                description="Search for restaurants to build your viewing history"
                actionLabel="Find restaurants"
              />
            ) : (
              restaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  index={index}
                  isDeleting={deletingId === restaurant.id}
                  isHovered={hoveredCard === restaurant.id}
                  onHover={() => setHoveredCard(restaurant.id)}
                  onLeave={() => setHoveredCard(null)}
                  onDelete={() => handleDeleteRestaurant(restaurant.id)}
                  formatTimestamp={formatTimestamp}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Clear All Modal */}
      {showClearModal && (
        <ClearModal isClearing={isClearing} onClose={() => setShowClearModal(false)} onConfirm={handleClearAll} />
      )}
    </div>
  )
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl font-medium text-sm 
        transition-all duration-300 relative overflow-hidden
        ${
          active
            ? "bg-gradient-to-r from-primary/10 to-pink-500/10 text-foreground shadow-lg shadow-primary/5"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }
      `}
    >
      {active && <div className="absolute inset-0 gradient-border rounded-xl" />}
      <span className={`transition-transform duration-300 ${active ? "scale-110" : ""}`}>{icon}</span>
      <span>{label}</span>
      {count > 0 && (
        <span
          className={`
            px-2.5 py-0.5 rounded-full text-xs font-bold transition-all duration-300
            ${active ? "bg-gradient-to-r from-primary to-pink-500 text-white" : "bg-secondary text-muted-foreground"}
          `}
        >
          {count}
        </span>
      )}
    </button>
  )
}

// Classification Card Component
function ClassificationCard({
  item,
  index,
  isDeleting,
  isHovered,
  onHover,
  onLeave,
  onDelete,
  formatTimestamp,
}: {
  item: FoodClassification
  index: number
  isDeleting: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onDelete: () => void
  formatTimestamp: (timestamp: number) => string
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        group relative glass glass-border rounded-3xl p-5 
        transition-all duration-500 card-hover
        animate-fade-in-up
        ${isDeleting ? "opacity-0 scale-95 translate-x-4" : ""}
        ${isHovered ? "gradient-border" : ""}
      `}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex gap-5">
        {/* Image */}
        {item.imagePreview && (
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-2xl">
            <img
              src={item.imagePreview || "/placeholder.svg"}
              alt={item.foodName}
              className={`
                w-full h-full object-cover transition-all duration-500
                ${isHovered ? "scale-110" : "scale-100"}
              `}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground capitalize text-xl leading-tight tracking-tight">
                {item.foodName}
              </h3>

              {/* Confidence Bar */}
              {item.confidence && (
                <div className="flex items-center gap-3">
                  <div className="w-28 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${item.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">{(item.confidence * 100).toFixed(0)}% match</span>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={onDelete}
              className={`
                p-2.5 -m-1 text-muted-foreground hover:text-destructive rounded-xl 
                hover:bg-destructive/10 transition-all duration-300
                ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}
              `}
              aria-label="Delete"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Labels */}
          {item.labels && item.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.labels.slice(0, 4).map((label, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <ClockIcon className="w-3.5 h-3.5" />
            <span>{formatTimestamp(item.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Restaurant Card Component
function RestaurantCard({
  restaurant,
  index,
  isDeleting,
  isHovered,
  onHover,
  onLeave,
  onDelete,
  formatTimestamp,
}: {
  restaurant: ViewedRestaurant
  index: number
  isDeleting: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onDelete: () => void
  formatTimestamp: (timestamp: number) => string
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        group relative glass glass-border rounded-3xl p-5 
        transition-all duration-500 card-hover
        animate-fade-in-up
        ${isDeleting ? "opacity-0 scale-95 translate-x-4" : ""}
        ${isHovered ? "gradient-border" : ""}
      `}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex gap-5">
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary">
          {restaurant.photos && restaurant.photos.length > 0 ? (
            <>
              <img
                src={restaurant.photos[0] || "/placeholder.svg"}
                alt={restaurant.name}
                className={`
                  w-full h-full object-cover transition-all duration-500
                  ${isHovered ? "scale-110" : "scale-100"}
                `}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPinIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-xl leading-tight tracking-tight line-clamp-1">
                {restaurant.name}
              </h3>

              {/* Rating & Price */}
              <div className="flex items-center gap-4">
                {restaurant.rating && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 rounded-lg">
                    <StarIcon className="w-4 h-4 text-amber-400" filled />
                    <span className="text-sm font-bold text-amber-400">{restaurant.rating.toFixed(1)}</span>
                  </div>
                )}
                {restaurant.price_level && (
                  <span className="text-sm font-bold text-emerald-400">
                    {"$".repeat(restaurant.price_level)}
                    <span className="text-muted-foreground/30">{"$".repeat(4 - restaurant.price_level)}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={onDelete}
              className={`
                p-2.5 -m-1 text-muted-foreground hover:text-destructive rounded-xl 
                hover:bg-destructive/10 transition-all duration-300
                ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}
              `}
              aria-label="Delete"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Address */}
          <p className="text-sm text-muted-foreground mt-3 line-clamp-1">{restaurant.address}</p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>{formatTimestamp(restaurant.timestamp)}</span>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}&query_place_id=${restaurant.place_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/link"
            >
              <span>View on Maps</span>
              <ExternalLinkIcon className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up">
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-3xl blur-2xl" />
        <div className="relative w-24 h-24 rounded-3xl glass glass-border flex items-center justify-center">
          <Icon className="w-10 h-10 text-muted-foreground" />
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full opacity-60" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-500 rounded-full opacity-60" />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2 text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">{description}</p>

      {actionLabel && (
        <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 button-glow">
          <SearchIcon className="w-4 h-4" />
          <span>{actionLabel}</span>
          <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  )
}

// Clear Modal Component
function ClearModal({
  isClearing,
  onClose,
  onConfirm,
}: {
  isClearing: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-up"
        style={{ animationDuration: "200ms" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md glass glass-border rounded-3xl p-6 animate-fade-in-up"
        style={{ animationDuration: "300ms" }}
      >
        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <TrashIcon className="w-8 h-8 text-destructive" />
        </div>

        <h2 className="text-xl font-bold text-foreground text-center mb-2">Clear all history?</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          This action cannot be undone. All your food searches and restaurant history will be permanently deleted.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isClearing}
            className="flex-1 py-3 px-4 text-sm font-semibold text-foreground bg-secondary rounded-xl hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isClearing}
            className="flex-1 py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-destructive to-red-600 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isClearing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Clearing...</span>
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4" />
                <span>Clear all</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
