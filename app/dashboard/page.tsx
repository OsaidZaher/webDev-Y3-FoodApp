'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FoodInput from '@/app/components/FoodInput';
import RestaurantList from '@/app/components/RestaurantList';
import { FoodRecognitionResult, Restaurant, UserLocation } from '@/types';
import { UtensilsCrossed, PartyPopper, AlertTriangle, CheckCircle2, Loader2, Frown, Camera, Bot, MapPin } from 'lucide-react';
import { saveClassification } from '@/lib/history';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [currentFood, setCurrentFood] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastImagePreview, setLastImagePreview] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      // Use default location (New York City)
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
        // Use default location
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
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
          radius: 5000, // 5km radius
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
    // Save manual input to history (without image)
    saveClassification({
      foodName,
      confidence: 1.0, // Manual input is 100% confident
      labels: [foodName],
    });
    
    searchRestaurants(foodName);
  };

  const handleImageSelected = (imageDataUrl: string) => {
    setLastImagePreview(imageDataUrl);
  };

  const handleRetry = () => {
    setRestaurants([]);
    setCurrentFood('');
    setError(null);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16 md:pb-0">
        <div className="text-center">
          <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-orange-500 animate-bounce" />
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            Welcome, {session?.user?.name || 'Food Explorer'}!
            <PartyPopper className="w-8 h-8 text-orange-500" />
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Discover amazing restaurants by uploading a food photo or searching manually
          </p>
        </div>

        {/* Location Status */}
        {locationError && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm md:text-base text-yellow-800 font-medium">{locationError}</p>
              <button
                onClick={getUserLocation}
                className="text-yellow-700 underline text-xs md:text-sm mt-1 hover:text-yellow-900"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {userLocation && !locationError && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm md:text-base text-green-800">
              Location detected: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          </div>
        )}

        {/* Food Input Component */}
        <div className="mb-6 md:mb-8">
          <FoodInput
            onFoodRecognized={handleFoodRecognized}
            onFoodManualInput={handleManualInput}
            onImageSelected={handleImageSelected}
            isLoading={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm md:text-base text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-orange-500 animate-spin" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Searching for restaurants...
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Finding the best places serving {currentFood}
            </p>
          </div>
        )}

        {/* Restaurant Results */}
        {!isLoading && currentFood && restaurants.length > 0 && (
          <>
            <RestaurantList restaurants={restaurants} foodName={currentFood} />
            <div className="mt-6 text-center">
              <button
                onClick={handleRetry}
                className="text-orange-500 hover:text-orange-600 font-medium underline"
              >
                ← Start a new search
              </button>
            </div>
          </>
        )}

        {/* No Results */}
        {!isLoading && currentFood && restaurants.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Frown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any restaurants serving {currentFood} nearby.
              Try a different search!
            </p>
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Welcome Message (shown when no search has been performed) */}
        {!currentFood && !isLoading && (
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How it works:
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Camera className="w-10 h-10 mx-auto mb-3 text-orange-500" />
                <h3 className="font-semibold text-lg mb-2">1. Upload or Type</h3>
                <p className="text-gray-600 text-sm">
                  Upload a photo of food or manually enter what you're craving
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Bot className="w-10 h-10 mx-auto mb-3 text-orange-500" />
                <h3 className="font-semibold text-lg mb-2">2. AI Recognition</h3>
                <p className="text-gray-600 text-sm">
                  Our AI identifies the food and finds matching restaurants
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 text-orange-500" />
                <h3 className="font-semibold text-lg mb-2">3. Discover & Enjoy</h3>
                <p className="text-gray-600 text-sm">
                  Browse nearby restaurants and find your perfect meal
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
