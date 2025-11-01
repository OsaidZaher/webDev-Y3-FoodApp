/**
 * Main Page Component
 * Food Discovery Application - Find restaurants serving your favorite foods
 */

'use client';

import { useState, useEffect } from 'react';
import { Restaurant, FoodRecognitionResult, UserLocation } from '@/types';
import { getUserLocation, getDefaultLocation } from '@/lib/google-places';
import FoodInput from './components/FoodInput';
import RestaurantList from './components/RestaurantList';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedFood, setSearchedFood] = useState<string>('');
  const [locationError, setLocationError] = useState<string | null>(null);

  /**
   * Get user's location on component mount
   */
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);
        setLocationError(null);
      } catch (err) {
        console.error('Error getting location:', err);
        // Use default location as fallback
        const defaultLoc = getDefaultLocation();
        setUserLocation(defaultLoc);
        setLocationError('Using default location (New York City). Enable location services for better results.');
      }
    };

    fetchLocation();
  }, []);

  /**
   * Handles food identification and triggers restaurant search
   */
  const handleFoodIdentified = async (
    foodName: string,
    recognitionResult: FoodRecognitionResult | null
  ) => {
    if (!userLocation) {
      setError('Location not available. Please try again.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setSearchedFood(foodName);

    try {
      const params = new URLSearchParams({
        food: foodName,
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString(),
        radius: '5000',
      });

      const response = await fetch(`/api/search-restaurants?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search restaurants');
      }

      setRestaurants(data.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search for restaurants');
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Location Warning */}
        {locationError && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <p className="text-sm flex-1">{locationError}</p>
            </div>
          </div>
        )}

        {/* Food Input Component */}
        <FoodInput
          onFoodIdentified={handleFoodIdentified}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State for Restaurant Search */}
        {isLoading && searchedFood && (
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Searching for restaurants...</p>
          </div>
        )}

        {/* Restaurant List */}
        {!isLoading && searchedFood && (
          <RestaurantList restaurants={restaurants} foodName={searchedFood} />
        )}

        {/* Empty State - No Search Yet */}
        {!searchedFood && !isLoading && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">👋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to Food Discovery!
              </h3>
              <p className="text-gray-600">
                Upload a photo, take a picture, or type a food name to find restaurants near you.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-sm text-gray-500">
        <p>
          Powered by Google Cloud Vision API &amp; Google Places API
        </p>
      </footer>
    </div>
  );
}
