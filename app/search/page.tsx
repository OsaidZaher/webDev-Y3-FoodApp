'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FoodInput from '@/app/components/FoodInput';
import RestaurantList from '@/app/components/RestaurantList';
import { FoodRecognitionResult, Restaurant, UserLocation } from '@/types';
import { useState } from 'react';
import { saveClassification } from '@/lib/history';

export default function SearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [currentFood, setCurrentFood] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastImagePreview, setLastImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationError(null);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Could not get your location. Using default location (NYC).');
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
      }
    );
  };

  const searchRestaurants = async (foodName: string) => {
    if (!userLocation) {
      setError('Location not available. Please allow location access.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentFood(foodName);

    try {
      const response = await fetch('/api/search-restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodName,
          location: userLocation,
          radius: 5000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to search restaurants');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to search restaurants');
      }

      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching restaurants');
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodRecognized = (result: FoodRecognitionResult) => {
    if (result.success && result.foodName) {
      // Save to history
      saveClassification({
        foodName: result.foodName,
        confidence: result.confidence,
        labels: result.labels,
        imagePreview: lastImagePreview || undefined,
      });
      
      searchRestaurants(result.foodName);
    } else {
      setError('Could not recognize food. Please try again or enter manually.');
    }
  };

  const handleManualInput = (foodName: string) => {
    // Save manual input to history
    saveClassification({
      foodName,
      confidence: 1.0,
      labels: [foodName],
    });
    
    searchRestaurants(foodName);
  };

  const handleImageSelected = (imageDataUrl: string) => {
    setLastImagePreview(imageDataUrl);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16 md:pb-0">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Search Restaurants 🔍
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Find restaurants by food photo or name
          </p>
        </div>

        {locationError && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm md:text-base text-yellow-800">{locationError}</p>
          </div>
        )}

        <div className="mb-6 md:mb-8">
          <FoodInput
            onFoodRecognized={handleFoodRecognized}
            onFoodManualInput={handleManualInput}
            onImageSelected={handleImageSelected}
            isLoading={isLoading}
          />
        </div>

        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm md:text-base text-red-700">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <div className="text-5xl md:text-6xl mb-4 animate-spin">🔍</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Searching...
            </h3>
          </div>
        )}

        {!isLoading && currentFood && restaurants.length > 0 && (
          <RestaurantList restaurants={restaurants} foodName={currentFood} />
        )}

        {!isLoading && currentFood && restaurants.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <div className="text-5xl md:text-6xl mb-4">😕</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Try a different search!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
