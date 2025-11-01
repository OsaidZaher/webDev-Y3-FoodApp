/**
 * RestaurantList Component
 * Displays a list of restaurants with sorting and filtering capabilities
 */

'use client';

import { useState, useMemo } from 'react';
import { Restaurant, SortOption } from '@/types';
import RestaurantCard from './RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
  foodName: string;
}

export default function RestaurantList({ restaurants, foodName }: RestaurantListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  /**
   * Sorts restaurants based on selected criteria
   */
  const sortedRestaurants = useMemo(() => {
    const sorted = [...restaurants];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = a.price_level || 0;
          const priceB = b.price_level || 0;
          return priceA - priceB;
        });

      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = a.price_level || 0;
          const priceB = b.price_level || 0;
          return priceB - priceA;
        });

      case 'rating':
      default:
        return sorted.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
    }
  }, [restaurants, sortBy]);

  if (restaurants.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-12">
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Restaurants Found
          </h3>
          <p className="text-gray-500">
            We couldn&apos;t find any restaurants serving &ldquo;{foodName}&rdquo; in your area.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try searching for a different food or check your location settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      {/* Header with Results Count and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Restaurants serving {foodName}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Found {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
          >
            <option value="rating">Rating (High to Low)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-12"></div>
    </div>
  );
}
