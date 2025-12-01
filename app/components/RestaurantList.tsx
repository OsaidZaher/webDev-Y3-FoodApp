"use client"

import { useState } from "react"
import type { Restaurant, SortOption } from "@/types"
import RestaurantCard from "./RestaurantCard"

interface RestaurantListProps {
  restaurants: Restaurant[]
  foodName: string
}

// Inline SVG Icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const SortIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
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

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

export default function RestaurantList({ restaurants, foodName }: RestaurantListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("rating")

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price_level || 5) - (b.price_level || 5)
      case "price-high":
        return (b.price_level || 0) - (a.price_level || 0)
      case "rating":
      default:
        return (b.rating || 0) - (a.rating || 0)
    }
  })

  if (restaurants.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 rounded-3xl" />
        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center border border-white/[0.08]">
            <SearchIcon className="w-10 h-10 text-white/30" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No restaurants found</h3>
          <p className="text-white/50 max-w-md mx-auto leading-relaxed">
            We couldn't find any restaurants serving <span className="text-violet-400 font-medium">{foodName}</span>{" "}
            nearby. Try a different search or increase your search radius.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Sort Options */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 rounded-2xl" />
        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <MapPinIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Restaurants serving{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                    {foodName}
                  </span>
                </h2>
                <p className="text-white/50 mt-0.5">
                  Found <span className="text-violet-400 font-semibold">{restaurants.length}</span> restaurant
                  {restaurants.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <SortIcon className="w-4 h-4" />
                <span>Sort by:</span>
              </div>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 cursor-pointer transition-all hover:bg-white/[0.08]"
                >
                  <option value="rating" className="bg-[#0a0a0f] text-white">
                    Highest Rated
                  </option>
                  <option value="price-low" className="bg-[#0a0a0f] text-white">
                    Price: Low to High
                  </option>
                  <option value="price-high" className="bg-[#0a0a0f] text-white">
                    Price: High to Low
                  </option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRestaurants.map((restaurant, index) => (
          <div key={restaurant.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
