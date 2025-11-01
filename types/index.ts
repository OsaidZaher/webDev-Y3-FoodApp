// TypeScript interfaces for the Food Discovery Application

/**
 * Restaurant data structure from Google Places API
 */
export interface Restaurant {
  id: string;
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number; // in meters
  photos?: string[]; // Photo references or URLs
  opening_hours?: {
    open_now?: boolean;
  };
  user_ratings_total?: number;
}

/**
 * Food recognition result from Google Cloud Vision API
 */
export interface FoodRecognitionResult {
  foodName: string;
  confidence?: number;
  labels?: string[];
  success: boolean;
}

/**
 * Request payload for food recognition API
 */
export interface RecognizeFoodRequest {
  image: File | string; // File object or base64 string
}

/**
 * Response from restaurant search API
 */
export interface RestaurantSearchResponse {
  restaurants: Restaurant[];
  status: string;
  error?: string;
}

/**
 * Search parameters for restaurant query
 */
export interface SearchParams {
  food: string;
  lat: number;
  lng: number;
  radius?: number;
}

/**
 * User location data
 */
export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

/**
 * Sorting options for restaurant list
 */
export type SortOption = 'price-low' | 'price-high' | 'rating';

/**
 * Application state interface
 */
export interface AppState {
  foodName: string;
  recognizedFood: FoodRecognitionResult | null;
  restaurants: Restaurant[];
  userLocation: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  sortBy: SortOption;
}

/**
 * Google Cloud Vision API Label Detection Response
 */
export interface VisionApiLabel {
  description: string;
  score: number;
  topicality?: number;
}

export interface VisionApiResponse {
  responses: Array<{
    labelAnnotations?: VisionApiLabel[];
    error?: {
      code: number;
      message: string;
      status: string;
    };
  }>;
}

/**
 * Google Places API Response Types
 */
export interface PlacesApiGeometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export interface PlacesApiPhoto {
  height: number;
  width: number;
  photo_reference: string;
  html_attributions: string[];
}

export interface PlacesApiResult {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  formatted_address?: string;
  vicinity?: string;
  geometry: PlacesApiGeometry;
  photos?: PlacesApiPhoto[];
  opening_hours?: {
    open_now?: boolean;
  };
  user_ratings_total?: number;
}

export interface PlacesApiResponse {
  results: PlacesApiResult[];
  status: string;
  error_message?: string;
}