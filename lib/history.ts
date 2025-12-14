/**
 * Local Storage Utility for History Tracking
 * User-specific history using userId in storage keys
 */

export interface FoodClassification {
  id: string;
  foodName: string;
  confidence?: number;
  labels?: string[];
  imagePreview?: string;
  timestamp: number;
}

export interface ViewedRestaurant {
  id: string;
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  address: string;
  photos?: string[];
  timestamp: number;
}

const MAX_ITEMS = 50; // Maximum items to store

/**
 * Get user-specific storage key
 */
function getStorageKey(baseKey: string, userId?: string): string {
  if (!userId) {
    // Fallback to a temporary key if no user is logged in
    return `${baseKey}_guest`;
  }
  return `${baseKey}_${userId}`;
}

/**
 * Save a food classification to history
 */
export function saveClassification(
  classification: Omit<FoodClassification, 'id' | 'timestamp'>,
  userId?: string
): void {
  try {
    const key = getStorageKey('food_classifications_history', userId);
    const history = getClassificationHistory(userId);
    const newItem: FoodClassification = {
      ...classification,
      // Clamp confidence to 0-1 range to prevent display issues
      confidence: classification.confidence !== undefined 
        ? Math.min(Math.max(classification.confidence, 0), 1) 
        : undefined,
      id: `classification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to beginning of array and limit size
    const updated = [newItem, ...history].slice(0, MAX_ITEMS);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving classification to history:', error);
  }
}

/**
 * Get all food classification history
 */
export function getClassificationHistory(userId?: string): FoodClassification[] {
  try {
    const key = getStorageKey('food_classifications_history', userId);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading classification history:', error);
    return [];
  }
}

/**
 * Save a viewed restaurant to history
 */
export function saveViewedRestaurant(
  restaurant: Omit<ViewedRestaurant, 'id' | 'timestamp'>,
  userId?: string
): void {
  try {
    const key = getStorageKey('viewed_restaurants_history', userId);
    const history = getViewedRestaurantsHistory(userId);
    
    // Check if restaurant already exists (by place_id)
    const existingIndex = history.findIndex(r => r.place_id === restaurant.place_id);
    
    const newItem: ViewedRestaurant = {
      ...restaurant,
      id: `restaurant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    let updated: ViewedRestaurant[];
    if (existingIndex !== -1) {
      // Update existing entry and move to top
      updated = [newItem, ...history.filter((_, i) => i !== existingIndex)];
    } else {
      // Add new entry
      updated = [newItem, ...history];
    }

    // Limit size
    updated = updated.slice(0, MAX_ITEMS);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving restaurant to history:', error);
  }
}

/**
 * Get all viewed restaurants history
 */
export function getViewedRestaurantsHistory(userId?: string): ViewedRestaurant[] {
  try {
    const key = getStorageKey('viewed_restaurants_history', userId);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading restaurant history:', error);
    return [];
  }
}

/**
 * Clear all classification history
 */
export function clearClassificationHistory(userId?: string): void {
  try {
    const key = getStorageKey('food_classifications_history', userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing classification history:', error);
  }
}

/**
 * Clear all restaurant history
 */
export function clearRestaurantHistory(userId?: string): void {
  try {
    const key = getStorageKey('viewed_restaurants_history', userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing restaurant history:', error);
  }
}

/**
 * Clear all history
 */
export function clearAllHistory(userId?: string): void {
  clearClassificationHistory(userId);
  clearRestaurantHistory(userId);
}

/**
 * Delete a specific classification by id
 */
export function deleteClassification(id: string, userId?: string): void {
  try {
    const key = getStorageKey('food_classifications_history', userId);
    const history = getClassificationHistory(userId);
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting classification:', error);
  }
}

/**
 * Delete a specific restaurant by id
 */
export function deleteViewedRestaurant(id: string, userId?: string): void {
  try {
    const key = getStorageKey('viewed_restaurants_history', userId);
    const history = getViewedRestaurantsHistory(userId);
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting restaurant:', error);
  }
}
