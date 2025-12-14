"use client"

import type React from "react"

import type { Restaurant } from "@/types"
import { useState } from "react"
import RestaurantModal from "./RestaurantModal"

interface RestaurantCardProps {
  restaurant: Restaurant
}

// Inline SVG Icons
const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const StarIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg
    className={className}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const MapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
)

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
)

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { name, rating, price_level, address, distance, photos, opening_hours, user_ratings_total } = restaurant

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const handleViewOnMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${restaurant.place_id}`
    window.open(mapsUrl, "_blank")
  }

  const formatDistance = (meters?: number): string => {
    if (!meters) return "N/A"
    if (meters < 1000) {
      return `${meters}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
  }

  const renderPriceLevel = (level?: number): string => {
    if (!level) return ""
    return "$".repeat(level)
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null

    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className="w-4 h-4 text-amber-400" filled />
        ))}
        {hasHalfStar && <StarIcon className="w-4 h-4 text-amber-400" filled />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="w-4 h-4 text-white/20" />
        ))}
        <span className="text-sm text-slate-300 ml-1 font-medium">{rating.toFixed(1)}</span>
        {user_ratings_total && <span className="text-xs text-slate-400 ml-1">({user_ratings_total})</span>}
      </div>
    )
  }

  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] animate-fade-in">
        {/* Gradient border effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-violet-500/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
          {/* Restaurant Image */}
          <div className="relative h-48 bg-white/[0.02] overflow-hidden">
            {photos && photos.length > 0 ? (
              <img
                src={photos[0] || "/placeholder.svg"}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
                <MapPinIcon className="w-16 h-16 text-white/20" />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Distance Badge */}
            {distance !== undefined && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
                <MapPinIcon className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-sm font-medium text-slate-200">{formatDistance(distance)}</span>
              </div>
            )}

            {/* Open/Closed Badge */}
            {opening_hours?.open_now !== undefined && (
              <div
                className={`absolute top-3 left-3 rounded-full px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-md border ${
                  opening_hours.open_now
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/20 border-red-500/30 text-red-400"
                }`}
              >
                <ClockIcon className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{opening_hours.open_now ? "Open" : "Closed"}</span>
              </div>
            )}
          </div>

          {/* Restaurant Info */}
          <div className="p-5">
            {/* Name */}
            <h3 className="text-xl font-bold text-slate-200 mb-3 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all duration-300">
              {name}
            </h3>

            {/* Rating and Price */}
            <div className="flex items-center justify-between mb-4">
              <div>{renderStars(rating)}</div>
              {price_level && (
                <span className="text-lg font-bold text-emerald-400">{renderPriceLevel(price_level)}</span>
              )}
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 text-slate-400 text-sm mb-5">
              <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-violet-400/70" />
              <p className="line-clamp-2">{address}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleLearnMore}
                className="flex-1 relative group/btn overflow-hidden rounded-xl py-2.5 px-4 font-semibold text-white transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300 group-hover/btn:from-violet-500 group-hover/btn:to-fuchsia-500" />
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),transparent_60%)]" />
                <span className="relative flex items-center justify-center gap-2">
                  Learn More
                  <ExternalLinkIcon className="w-4 h-4" />
                </span>
              </button>
              <button
                onClick={handleViewOnMaps}
                className="p-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-violet-500/50 text-white rounded-xl transition-all duration-300 hover:scale-105"
                title="View on Google Maps"
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RestaurantModal placeId={restaurant.place_id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
