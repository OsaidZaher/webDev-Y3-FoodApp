'use client';

import { useState } from 'react';
import { Restaurant, SortOption } from '@/types';
import RestaurantCard from './RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
  foodName: string;
}

export default function RestaurantList({ restaurants, foodName }: RestaurantListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  // Sort restaurants based on selected option
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price_level || 5) - (b.price_level || 5);
      case 'price-high':
        return (b.price_level || 0) - (a.price_level || 0);
      case 'rating':
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  if (restaurants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No restaurants found
        </h3>
        <p className="text-gray-600">
          We couldn't find any restaurants serving {foodName} nearby.
          Try a different search or increase your search radius.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Sort Options */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Restaurants serving {foodName}
            </h2>
            <p className="text-gray-600 mt-1">
              Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
