"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { RestaurantDetails } from "@/lib/google-places"
import { saveViewedRestaurant } from "@/lib/history"

interface RestaurantModalProps {
  placeId: string
  isOpen: boolean
  onClose: () => void
}

// Inline SVG Icons
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

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

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const DollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const NavigationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

export default function RestaurantModal({ placeId, isOpen, onClose }: RestaurantModalProps) {
  const { data: session } = useSession()
  const [details, setDetails] = useState<RestaurantDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && placeId) {
      fetchDetails()
    }
  }, [isOpen, placeId])

  const fetchDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/restaurant-details?placeId=${encodeURIComponent(placeId)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch restaurant details")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch details")
      }

      setDetails(data.details)

      saveViewedRestaurant(
        {
          place_id: placeId,
          name: data.details.name,
          rating: data.details.rating,
          price_level: data.details.price_level,
          address: data.details.address,
          photos: data.details.photos,
        },
        session?.user?.id,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading details")
      console.error("Error fetching restaurant details:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGetDirections = () => {
    if (details?.geometry?.location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${details.geometry.location.lat},${details.geometry.location.lng}&destination_place_id=${placeId}`
      window.open(url, "_blank")
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details?.name || "")}&query_place_id=${placeId}`
      window.open(url, "_blank")
    }
  }

  const handleCall = async (phoneNumber: string) => {
    const link = document.createElement("a")
    link.href = `tel:${phoneNumber}`
    link.style.display = "none"
    document.body.appendChild(link)

    try {
      link.click()
    } catch (error) {
      try {
        await navigator.clipboard.writeText(phoneNumber)
        alert(`Phone number copied to clipboard: ${phoneNumber}`)
      } catch (clipboardError) {
        alert(`Phone: ${phoneNumber}`)
      }
    } finally {
      document.body.removeChild(link)
    }
  }

  const renderPriceLevel = (level?: number): string => {
    if (!level) return "Price not available"
    const prices = ["Free", "Inexpensive", "Moderate", "Expensive", "Very Expensive"]
    return `${prices[level]} (${"$".repeat(level)})`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl animate-scale-in">
        {/* Gradient border effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 rounded-3xl opacity-50" />

        <div className="relative bg-[#0a0a0f] rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Restaurant Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/[0.08] rounded-xl transition-colors group">
              <XIcon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto custom-scrollbar">
            {loading && (
              <div className="text-center py-16">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                  <div className="absolute inset-1 rounded-full bg-[#0a0a0f] flex items-center justify-center">
                    <LoaderIcon className="w-8 h-8 text-violet-400 animate-spin" />
                  </div>
                </div>
                <p className="text-white/60 font-medium">Loading details...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {details && !loading && (
              <div className="space-y-6">
                {/* Restaurant Name & Rating */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">{details.name}</h3>
                  {details.rating && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        <StarIcon className="w-5 h-5 text-amber-400" />
                        <span className="text-lg font-bold text-amber-400">{details.rating.toFixed(1)}</span>
                      </div>
                      {details.user_ratings_total && (
                        <span className="text-white/50">({details.user_ratings_total} reviews)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Photos */}
                {details.photos && details.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {details.photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group/photo">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`${details.name} photo ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-110"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Editorial Summary */}
                {details.editorial_summary && (
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10" />
                    <div className="relative p-4 border border-white/[0.08] rounded-2xl">
                      <p className="text-white/80 leading-relaxed">{details.editorial_summary}</p>
                    </div>
                  </div>
                )}

                {/* Key Information */}
                <div className="grid md:grid-cols-2 gap-3">
                  {details.price_level !== undefined && (
                    <div className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <DollarIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Price Range</p>
                        <p className="text-sm text-white/60">{renderPriceLevel(details.price_level)}</p>
                      </div>
                    </div>
                  )}

                  {details.opening_hours && (
                    <div className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Status</p>
                        <p
                          className={`text-sm font-medium ${details.opening_hours.open_now ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {details.opening_hours.open_now ? "Open Now" : "Closed"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hours of Operation */}
                {details.opening_hours?.weekday_text && (
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-violet-400" />
                      Hours of Operation
                    </h4>
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 space-y-2">
                      {details.opening_hours.weekday_text.map((day, idx) => (
                        <p key={idx} className="text-sm text-white/70">
                          {day}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Address</p>
                    <p className="text-white/60">{details.address}</p>
                  </div>
                </div>

                {/* Map Preview */}
                {details.geometry?.location && (
                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5 text-violet-400" />
                      Location
                    </h4>
                    <div className="rounded-2xl overflow-hidden border border-white/[0.08]">
                      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                        <iframe
                          width="100%"
                          height="250"
                          style={{ border: 0 }}
                          loading="lazy"
                          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${placeId}&zoom=15`}
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}&query_place_id=${placeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-[250px] bg-white/[0.03] hover:bg-white/[0.06] transition-colors flex items-center justify-center"
                        >
                          <div className="text-center">
                            <MapPinIcon className="w-12 h-12 text-violet-400 mx-auto mb-3" />
                            <p className="text-white font-medium">View on Google Maps</p>
                            <p className="text-white/50 text-sm mt-1">{details.address}</p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-3">
                  {details.formatted_phone_number && (
                    <button
                      onClick={() => handleCall(details.formatted_phone_number!)}
                      className="flex items-center gap-3 p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl hover:bg-violet-500/20 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PhoneIcon className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-xs text-violet-400 font-medium">Call</p>
                        <p className="text-sm text-white font-medium">{details.formatted_phone_number}</p>
                      </div>
                    </button>
                  )}

                  {details.website && (
                    <a
                      href={details.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/20 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <GlobeIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-400 font-medium">Website</p>
                        <p className="text-sm text-white font-medium truncate">Visit website</p>
                      </div>
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/[0.08]">
                  <button
                    onClick={handleGetDirections}
                    className="flex-1 relative group/btn overflow-hidden rounded-xl py-3.5 px-6 font-semibold text-white transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300 group-hover/btn:from-violet-500 group-hover/btn:to-fuchsia-500" />
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),transparent_60%)]" />
                    <span className="relative flex items-center justify-center gap-2">
                      <NavigationIcon className="w-5 h-5" />
                      Get Directions
                    </span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white rounded-xl font-semibold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
