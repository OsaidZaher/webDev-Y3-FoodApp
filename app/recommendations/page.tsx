'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  getUserInsights, 
  hasEnoughDataForRecommendations,
  fetchAIRecommendations,
  type AIFoodRecommendation 
} from '@/lib/recommendations';
import { Sparkles, AlertCircle, Search, Loader2, Brain } from 'lucide-react';
import { Restaurant } from '@/types';
import RestaurantList from '@/app/components/RestaurantList';

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [aiRecommendations, setAiRecommendations] = useState<AIFoodRecommendation[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [hasEnoughData, setHasEnoughData] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Check for enough data and generate recommendations
    const hasData = hasEnoughDataForRecommendations();
    const userInsights = getUserInsights(); // Always get insights for progress display
    setInsights(userInsights);
    setHasEnoughData(hasData);
    
    if (hasData) {
      // Auto-load AI recommendations
      loadAIRecommendations();
    }
  }, []);

  const loadAIRecommendations = async () => {
    setAiLoading(true);
    try {
      const aiRecs = await fetchAIRecommendations();
      setAiRecommendations(aiRecs);
      
      // Auto-search first AI recommendation
      if (aiRecs.length > 0) {
        searchRecommendation(aiRecs[0].foodName);
        setSelectedRecommendation(aiRecs[0].foodName);
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const searchRecommendation = async (query: string) => {
    setLoading(true);
    setSelectedRecommendation(query);
    
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const response = await fetch('/api/search-restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          foodName: query,
          location,
          radius: 5000,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.restaurants) {
        setRestaurants(data.restaurants);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error searching recommendation:', error);
      // Fallback to Dublin coordinates if location fails
      try {
        const response = await fetch('/api/search-restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            foodName: query,
            location: { lat: 53.3498, lng: -6.2603 }, // Dublin
            radius: 5000,
          }),
        });

        const data = await response.json();
        
        if (data.success && data.restaurants) {
          setRestaurants(data.restaurants);
        } else {
          setRestaurants([]);
        }
      } catch (fallbackError) {
        console.error('Fallback search failed:', fallbackError);
        setRestaurants([]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16 md:pb-0">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not enough data view
  if (!hasEnoughData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
              Recommendations
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Personalized restaurant suggestions based on your history
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-orange-500 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Not Enough Data Yet
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We need at least <strong>10 unique entries</strong> (food searches or viewed restaurants) 
              to generate personalized recommendations for you.
            </p>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 md:p-8 max-w-md mx-auto mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Current Progress:
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Food Searches:</span>
                  <span className="font-bold text-orange-600">{insights?.totalClassifications || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Viewed Restaurants:</span>
                  <span className="font-bold text-orange-600">{insights?.totalViewedRestaurants || 0}</span>
                </div>
                <div className="h-px bg-gray-300 my-2"></div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total Entries:</span>
                  <span className="font-bold text-2xl text-orange-600">
                    {insights?.totalUniqueEntries || 0} / 10
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(((insights?.totalUniqueEntries || 0) / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-gray-600">
              <p className="font-medium">To unlock recommendations:</p>
              <ul className="text-left max-w-md mx-auto space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Upload food photos or search for restaurants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Click "Learn More" on restaurants to view details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Keep exploring until you reach 10 entries!</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
            Your Recommendations
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Based on {insights?.totalUniqueEntries} entries in your history
          </p>
        </div>

        {/* Insights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Top Food Category</h3>
            <p className="text-2xl font-bold text-orange-600 capitalize">
              {insights?.topFoodCategories[0]?.name || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Searched {insights?.topFoodCategories[0]?.count || 0} times
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Average Rating</h3>
            <p className="text-2xl font-bold text-orange-600">
              {insights?.averageRating?.toFixed(1) || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">From viewed restaurants</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Price Preference</h3>
            <p className="text-2xl font-bold text-orange-600">
              {insights?.preferredPriceLevel ? '$'.repeat(insights.preferredPriceLevel) : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Most common choice</p>
          </div>
        </div>

        {/* AI-Powered Recommendation Cards */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI-Powered Recommendations
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            ChatGPT analyzed your taste preferences to suggest similar foods you might love
          </p>

          {aiLoading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-gray-600">AI is analyzing your preferences...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          ) : aiRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiRecommendations.map((rec, index) => (
                <button
                  key={index}
                  onClick={() => searchRecommendation(rec.foodName)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedRecommendation === rec.foodName
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.foodName}</h3>
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      {rec.confidence}%
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {rec.cuisineType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                  <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                    <Search className="w-4 h-4" />
                    Find Restaurants
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">Loading AI recommendations...</p>
            </div>
          )}
        </div>

        {/* Restaurant Results */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Finding restaurants for you...</p>
          </div>
        ) : restaurants.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Results for "{selectedRecommendation}"
            </h2>
            <RestaurantList restaurants={restaurants} foodName={selectedRecommendation || ''} />
          </div>
        ) : selectedRecommendation ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No restaurants found. Try another recommendation!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
