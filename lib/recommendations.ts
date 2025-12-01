/**
 * Recommendation Algorithm for Restaurant Suggestions
 * Based on user's food classification and viewed restaurant history
 */

import { getClassificationHistory, getViewedRestaurantsHistory } from './history';

export interface RecommendationInsights {
  totalClassifications: number;
  totalViewedRestaurants: number;
  totalUniqueEntries: number;
  hasEnoughData: boolean;
  topFoodCategories: { name: string; count: number }[];
  averageRating: number;
  preferredPriceLevel?: number;
}

export interface RestaurantRecommendation {
  query: string;
  reason: string;
  confidence: number;
}

const MIN_UNIQUE_ENTRIES = 10;

/**
 * Check if there's enough data to generate recommendations
 */
export function hasEnoughDataForRecommendations(userId?: string): boolean {
  const classifications = getClassificationHistory(userId);
  const restaurants = getViewedRestaurantsHistory(userId);
  
  const totalUnique = classifications.length + restaurants.length;
  return totalUnique >= MIN_UNIQUE_ENTRIES;
}

/**
 * Get insights from user history
 */
export function getUserInsights(userId?: string): RecommendationInsights {
  const classifications = getClassificationHistory(userId);
  const restaurants = getViewedRestaurantsHistory(userId);
  
  const totalUnique = classifications.length + restaurants.length;
  
  // Extract food categories from classifications
  const foodCategoryMap = new Map<string, number>();
  
  classifications.forEach(classification => {
    const foodName = classification.foodName.toLowerCase();
    foodCategoryMap.set(foodName, (foodCategoryMap.get(foodName) || 0) + 1);
    
    // Also count labels if available
    classification.labels?.forEach(label => {
      const labelName = label.toLowerCase();
      foodCategoryMap.set(labelName, (foodCategoryMap.get(labelName) || 0) + 1);
    });
  });
  
  // Get top food categories
  const topFoodCategories = Array.from(foodCategoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Calculate average rating from viewed restaurants
  const ratingsSum = restaurants.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = restaurants.length > 0 ? ratingsSum / restaurants.length : 0;
  
  // Determine preferred price level (most common)
  const priceLevels = restaurants
    .map(r => r.price_level)
    .filter(p => p !== undefined) as number[];
  
  const priceLevelMode = priceLevels.length > 0
    ? priceLevels.sort((a, b) =>
        priceLevels.filter(v => v === a).length - priceLevels.filter(v => v === b).length
      ).pop()
    : undefined;
  
  return {
    totalClassifications: classifications.length,
    totalViewedRestaurants: restaurants.length,
    totalUniqueEntries: totalUnique,
    hasEnoughData: totalUnique >= MIN_UNIQUE_ENTRIES,
    topFoodCategories,
    averageRating,
    preferredPriceLevel: priceLevelMode,
  };
}

/**
 * Generate restaurant recommendations based on user history
 */
export function generateRecommendations(userId?: string): RestaurantRecommendation[] {
  const insights = getUserInsights(userId);
  
  if (!insights.hasEnoughData) {
    return [];
  }
  
  const recommendations: RestaurantRecommendation[] = [];
  
  // Recommendation 1: Based on most frequent food category
  if (insights.topFoodCategories.length > 0) {
    const topFood = insights.topFoodCategories[0];
    recommendations.push({
      query: topFood.name,
      reason: `You've searched for "${topFood.name}" ${topFood.count} time${topFood.count > 1 ? 's' : ''}`,
      confidence: Math.min(topFood.count * 10, 100),
    });
  }
  
  // Recommendation 2: Based on second most frequent food category
  if (insights.topFoodCategories.length > 1) {
    const secondFood = insights.topFoodCategories[1];
    recommendations.push({
      query: secondFood.name,
      reason: `You've shown interest in "${secondFood.name}" multiple times`,
      confidence: Math.min(secondFood.count * 10, 90),
    });
  }
  
  // Recommendation 3: Combination of top categories
  if (insights.topFoodCategories.length > 2) {
    const combo = `${insights.topFoodCategories[0].name} ${insights.topFoodCategories[2].name}`;
    recommendations.push({
      query: combo,
      reason: `Based on your interest in both ${insights.topFoodCategories[0].name} and ${insights.topFoodCategories[2].name}`,
      confidence: 75,
    });
  }
  
  // Recommendation 4: Cuisine variation
  if (insights.topFoodCategories.length > 0) {
    const topFood = insights.topFoodCategories[0].name;
    const cuisineVariations = getCuisineVariation(topFood);
    if (cuisineVariations) {
      recommendations.push({
        query: cuisineVariations,
        reason: `You might enjoy ${cuisineVariations}, similar to your favorites`,
        confidence: 70,
      });
    }
  }
  
  // Recommendation 5: High-rated category
  if (insights.averageRating >= 4.0 && insights.topFoodCategories.length > 0) {
    recommendations.push({
      query: `best ${insights.topFoodCategories[0].name}`,
      reason: `Top-rated ${insights.topFoodCategories[0].name} restaurants for you`,
      confidence: 85,
    });
  }
  
  // Recommendation 6: New but related
  if (insights.topFoodCategories.length > 1) {
    recommendations.push({
      query: `${insights.topFoodCategories[1].name} restaurant`,
      reason: 'Discover new places serving your favorite foods',
      confidence: 65,
    });
  }
  
  // Sort by confidence
  return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
}

/**
 * Get cuisine variation suggestions based on food type
 */
function getCuisineVariation(foodName: string): string | null {
  const foodName_lower = foodName.toLowerCase();
  
  const variations: Record<string, string> = {
    'pizza': 'italian pasta',
    'burger': 'american BBQ',
    'sushi': 'japanese ramen',
    'pasta': 'italian risotto',
    'ramen': 'asian noodles',
    'tacos': 'mexican burritos',
    'curry': 'indian biryani',
    'steak': 'grilled meat',
    'salad': 'healthy bowls',
    'chicken': 'grilled poultry',
    'seafood': 'fresh fish',
    'noodles': 'asian cuisine',
    'rice': 'asian bowls',
    'sandwich': 'deli',
    'coffee': 'cafe',
    'dessert': 'bakery',
    'breakfast': 'brunch',
  };
  
  // Check for direct matches
  for (const [key, value] of Object.entries(variations)) {
    if (foodName_lower.includes(key)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Get personalized search queries based on history
 */
export function getPersonalizedSearchQueries(userId?: string): string[] {
  const insights = getUserInsights(userId);
  
  if (!insights.hasEnoughData) {
    return [];
  }
  
  return insights.topFoodCategories
    .slice(0, 3)
    .map(category => category.name);
}

/**
 * AI Recommendation Interface
 */
export interface AIFoodRecommendation {
  foodName: string;
  reason: string;
  cuisineType: string;
  confidence: number;
}

/**
 * Fetch AI-powered recommendations from OpenAI
 */
export async function fetchAIRecommendations(userId?: string): Promise<AIFoodRecommendation[]> {
  try {
    const insights = getUserInsights(userId);
    
    if (!insights.hasEnoughData) {
      return [];
    }

    const response = await fetch('/api/ai-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userHistory: {
          classifications: insights.totalClassifications,
          viewedRestaurants: insights.totalViewedRestaurants,
        },
        insights,
      }),
    });

    const data = await response.json();
    
    if (data.success && data.recommendations) {
      return data.recommendations;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    return [];
  }
}
