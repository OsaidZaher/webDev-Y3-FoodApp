/**
 * Local Storage Utility for History Tracking
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

const CLASSIFICATIONS_KEY = 'food_classifications_history';
const RESTAURANTS_KEY = 'viewed_restaurants_history';
const MAX_ITEMS = 50; // Maximum items to store

/**
 * Save a food classification to history
 */
export function saveClassification(classification: Omit<FoodClassification, 'id' | 'timestamp'>): void {
  try {
    const history = getClassificationHistory();
    const newItem: FoodClassification = {
      ...classification,
      id: `classification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to beginning of array and limit size
    const updated = [newItem, ...history].slice(0, MAX_ITEMS);
    localStorage.setItem(CLASSIFICATIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving classification to history:', error);
  }
}

/**
 * Get all food classification history
 */
export function getClassificationHistory(): FoodClassification[] {
  try {
    const data = localStorage.getItem(CLASSIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading classification history:', error);
    return [];
  }
}

/**
 * Save a viewed restaurant to history
 */
export function saveViewedRestaurant(restaurant: Omit<ViewedRestaurant, 'id' | 'timestamp'>): void {
  try {
    const history = getViewedRestaurantsHistory();
    
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
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving restaurant to history:', error);
  }
}

/**
 * Get all viewed restaurants history
 */
export function getViewedRestaurantsHistory(): ViewedRestaurant[] {
  try {
    const data = localStorage.getItem(RESTAURANTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading restaurant history:', error);
    return [];
  }
}

/**
 * Clear all classification history
 */
export function clearClassificationHistory(): void {
  try {
    localStorage.removeItem(CLASSIFICATIONS_KEY);
  } catch (error) {
    console.error('Error clearing classification history:', error);
  }
}

/**
 * Clear all restaurant history
 */
export function clearRestaurantHistory(): void {
  try {
    localStorage.removeItem(RESTAURANTS_KEY);
  } catch (error) {
    console.error('Error clearing restaurant history:', error);
  }
}

/**
 * Clear all history
 */
export function clearAllHistory(): void {
  clearClassificationHistory();
  clearRestaurantHistory();
}

/**
 * Delete a specific classification by id
 */
export function deleteClassification(id: string): void {
  try {
    const history = getClassificationHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(CLASSIFICATIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting classification:', error);
  }
}

/**
 * Delete a specific restaurant by id
 */
export function deleteViewedRestaurant(id: string): void {
  try {
    const history = getViewedRestaurantsHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting restaurant:', error);
  }
}
