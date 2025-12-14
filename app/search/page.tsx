'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import FoodInput from '@/app/components/FoodInput';
import RestaurantList from '@/app/components/RestaurantList';
import { FoodRecognitionResult, Restaurant, UserLocation } from '@/types';
import { saveClassification } from '@/lib/history';
import { Search, MapPin, AlertCircle, Loader2, Frown, Sparkles, History, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SearchPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [currentFood, setCurrentFood] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastImagePreview, setLastImagePreview] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[][]>([]);

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

  const searchRestaurants = async (foodName: string, pageToken?: string) => {
    if (!userLocation) {
      setError('Location not available. Please allow location access.');
      return;
    }

    if (pageToken) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setAllRestaurants([]);
      setCurrentPage(1);
    }
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
          pageSize: 15,
          pageToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to search restaurants');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to search restaurants');
      }

      const newRestaurants = data.restaurants || [];
      
      if (pageToken) {
        // Add new page to allRestaurants
        setAllRestaurants(prev => [...prev, newRestaurants]);
        setCurrentPage(prev => prev + 1);
      } else {
        // First page
        setAllRestaurants([newRestaurants]);
        setCurrentPage(1);
      }
      
      setRestaurants(newRestaurants);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching restaurants');
      setRestaurants([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleNextPage = () => {
    if (nextPageToken && currentFood) {
      searchRestaurants(currentFood, nextPageToken);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPageIndex = currentPage - 2;
      setRestaurants(allRestaurants[prevPageIndex] || []);
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleFoodRecognized = (result: FoodRecognitionResult) => {
    if (result.success && result.foodName) {
      // Save to history only if user is logged in
      if (session?.user?.id) {
        saveClassification({
          foodName: result.foodName,
          confidence: result.confidence,
          labels: result.labels,
          imagePreview: lastImagePreview || undefined,
        }, session.user.id);
      }
      
      searchRestaurants(result.foodName);
    } else {
      setError('Could not recognize food. Please try again or enter manually.');
    }
  };

  const handleManualInput = (foodName: string) => {
    // Save manual input to history only if user is logged in
    if (session?.user?.id) {
      saveClassification({
        foodName,
        confidence: 1.0,
        labels: [foodName],
      }, session.user.id);
    }
    
    searchRestaurants(foodName);
  };

  const handleImageSelected = (imageDataUrl: string) => {
    setLastImagePreview(imageDataUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Sign up banner for unauthenticated users */}
        {!session && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Unlock More Features</p>
                  <p className="text-sm text-blue-100">Sign up to save your history and get AI recommendations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium hover:underline">
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Search Restaurants
            </h1>
          </div>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 ml-13">
            Find restaurants by food photo or name
          </p>
        </div>

        {locationError && (
          <div className="mb-4 md:mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
            <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm md:text-base text-amber-800 dark:text-amber-200">{locationError}</p>
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
          <div className="mb-4 md:mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm md:text-base text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Searching nearby restaurants...
            </h3>
            <p className="text-slate-600 dark:text-slate-400">This may take a moment</p>
          </div>
        )}

        {!isLoading && currentFood && restaurants.length > 0 && (
          <>
            <RestaurantList restaurants={restaurants} foodName={currentFood} />
            
            {/* Pagination Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl font-semibold">
                Page {currentPage}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={!nextPageToken || isLoadingMore}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            
            {!nextPageToken && currentPage > 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
                No more results available
              </p>
            )}
          </>
        )}

        {!isLoading && currentFood && restaurants.length === 0 && !error && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Frown className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No restaurants found
            </h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
              Try a different search term or check your location settings
            </p>
          </div>
        )}

        {/* Feature prompts for non-logged in users */}
        {!session && !isLoading && !currentFood && (
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Search History</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Create an account to save your search history and quickly access your favorite foods.
              </p>
              <Link href="/signup" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Sign up to enable
              </Link>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI Recommendations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Get personalized food recommendations based on your taste preferences and history.
              </p>
              <Link href="/signup" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                Sign up to enable
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
