'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  getClassificationHistory, 
  getViewedRestaurantsHistory, 
  deleteClassification, 
  deleteViewedRestaurant,
  clearAllHistory,
  FoodClassification,
  ViewedRestaurant 
} from '@/lib/history';
import { History, Camera, MapPin, Trash2, Star, Clock, X } from 'lucide-react';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'classifications' | 'restaurants'>('classifications');
  const [classifications, setClassifications] = useState<FoodClassification[]>([]);
  const [restaurants, setRestaurants] = useState<ViewedRestaurant[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadHistory();
    }
  }, []);

  const loadHistory = () => {
    setClassifications(getClassificationHistory());
    setRestaurants(getViewedRestaurantsHistory());
  };

  const handleDeleteClassification = (id: string) => {
    deleteClassification(id);
    loadHistory();
  };

  const handleDeleteRestaurant = (id: string) => {
    deleteViewedRestaurant(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      clearAllHistory();
      loadHistory();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16 md:pb-0">
        <div className="text-center">
          <History className="w-16 h-16 mx-auto mb-4 text-orange-500 animate-pulse" />
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
              <History className="w-8 h-8 text-orange-500" />
              Search History
            </h1>
            {(classifications.length > 0 || restaurants.length > 0) && (
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
          <p className="text-base md:text-lg text-gray-600">
            Your recent food searches and restaurant discoveries
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('classifications')}
              className={`flex-1 py-4 px-6 font-medium text-sm md:text-base transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'classifications'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Camera className="w-5 h-5" />
              Food Classifications
              {classifications.length > 0 && (
                <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
                  {classifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 py-4 px-6 font-medium text-sm md:text-base transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'restaurants'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-5 h-5" />
              Viewed Restaurants
              {restaurants.length > 0 && (
                <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
                  {restaurants.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Food Classifications Tab */}
        {activeTab === 'classifications' && (
          <div className="space-y-4">
            {classifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Classifications Yet
                </h3>
                <p className="text-gray-600">
                  Upload food photos to see your classification history here
                </p>
              </div>
            ) : (
              classifications.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Image Preview */}
                    {item.imagePreview && (
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                        <img
                          src={item.imagePreview}
                          alt={item.foodName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 capitalize">
                          {item.foodName}
                        </h3>
                        <button
                          onClick={() => handleDeleteClassification(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {item.confidence && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(item.confidence * 100).toFixed(0)}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {(item.confidence * 100).toFixed(0)}% confident
                            </span>
                          </div>
                        </div>
                      )}

                      {item.labels && item.labels.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.labels.slice(0, 3).map((label, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Viewed Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div className="space-y-4">
            {restaurants.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Restaurants Viewed Yet
                </h3>
                <p className="text-gray-600">
                  Search for restaurants to see your viewing history here
                </p>
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Restaurant Image */}
                    {restaurant.photos && restaurant.photos.length > 0 ? (
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                        <img
                          src={restaurant.photos[0]}
                          alt={restaurant.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                          {restaurant.name}
                        </h3>
                        <button
                          onClick={() => handleDeleteRestaurant(restaurant.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Rating */}
                      {restaurant.rating && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-gray-900">
                              {restaurant.rating.toFixed(1)}
                            </span>
                          </div>
                          {restaurant.price_level && (
                            <span className="text-green-600 font-semibold">
                              {'$'.repeat(restaurant.price_level)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Address */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {restaurant.address}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {formatTimestamp(restaurant.timestamp)}
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}&query_place_id=${restaurant.place_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                        >
                          View on Maps →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
