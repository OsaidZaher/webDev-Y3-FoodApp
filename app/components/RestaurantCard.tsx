'use client';

import { Restaurant } from '@/types';
import { MapPin, Star, Clock, DollarSign, Map } from 'lucide-react';
import { useState } from 'react';
import RestaurantModal from './RestaurantModal';

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleViewOnMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${restaurant.place_id}`;
    window.open(mapsUrl, '_blank');
  };

  // Format distance
  const formatDistance = (meters?: number): string => {
    if (!meters) return 'N/A';
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Render price level
  const renderPriceLevel = (level?: number): string => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  // Render rating stars
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
        {user_ratings_total && (
          <span className="text-xs text-gray-500 ml-1">
            ({user_ratings_total})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gray-200">
        {photos && photos.length > 0 ? (
          <img
            src={photos[0]}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Distance Badge */}
        {distance !== undefined && (
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              {formatDistance(distance)}
            </span>
          </div>
        )}

        {/* Open/Closed Badge */}
        {opening_hours?.open_now !== undefined && (
          <div className={`absolute top-3 left-3 rounded-full px-3 py-1 shadow-md flex items-center gap-1 ${
            opening_hours.open_now 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <Clock className="w-3 h-3" />
            <span className="text-sm font-medium">
              {opening_hours.open_now ? 'Open' : 'Closed'}
            </span>
          </div>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {name}
        </h3>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {renderStars(rating)}
          </div>
          {price_level && (
            <span className="text-lg font-semibold text-green-600">
              {renderPriceLevel(price_level)}
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="line-clamp-2">{address}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleLearnMore}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium text-center hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Learn More
          </button>
          <button
            onClick={handleViewOnMaps}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            title="View on Google Maps"
          >
            <Map className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <RestaurantModal
        placeId={restaurant.place_id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
