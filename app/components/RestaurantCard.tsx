/**
 * RestaurantCard Component
 * Displays individual restaurant information in a card format
 */

'use client';

import Image from 'next/image';
import { Restaurant } from '@/types';
import { formatDistance, formatPriceLevel } from '@/lib/google-places';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const {
    name,
    rating,
    price_level,
    address,
    distance,
    photos,
    opening_hours,
    user_ratings_total,
  } = restaurant;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gray-200">
        {photos && photos.length > 0 ? (
          <Image
            src={photos[0]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        
        {/* Open/Closed Badge */}
        {opening_hours?.open_now !== undefined && (
          <div className="absolute top-3 right-3">
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${
                  opening_hours.open_now
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }
              `}
            >
              {opening_hours.open_now ? 'Open Now' : 'Closed'}
            </span>
          </div>
        )}
      </div>

      {/* Restaurant Information */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {name}
        </h3>

        {/* Rating and Price */}
        <div className="flex items-center gap-3 mb-3">
          {rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium text-gray-700">
                {rating.toFixed(1)}
              </span>
              {user_ratings_total && (
                <span className="text-xs text-gray-500">
                  ({user_ratings_total})
                </span>
              )}
            </div>
          )}
          
          {price_level && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-600">
                {formatPriceLevel(price_level)}
              </span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-gray-400 mt-0.5">📍</span>
          <p className="text-sm text-gray-600 line-clamp-2 flex-1">
            {address}
          </p>
        </div>

        {/* Distance */}
        {distance !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🚶</span>
            <p className="text-sm text-gray-600">
              {formatDistance(distance)} away
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
        <button
          onClick={() => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              name + ' ' + address
            )}`;
            window.open(mapsUrl, '_blank');
          }}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View on Maps
        </button>
      </div>
    </div>
  );
}
