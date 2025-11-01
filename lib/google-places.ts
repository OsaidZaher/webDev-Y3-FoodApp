/**
 * Google Places API Helper Functions
 * Handles restaurant search using Google Places API
 */

import { PlacesApiResponse, Restaurant, UserLocation } from '@/types';

/**
 * Searches for restaurants serving a specific food using Google Places API (New)
 * @param foodName - Name of the food to search for
 * @param location - User's location coordinates
 * @param apiKey - Google Places API key
 * @param radius - Search radius in meters (default: 5000)
 * @returns Promise with array of restaurants
 */
export async function searchRestaurants(
  foodName: string,
  location: UserLocation,
  apiKey: string,
  radius: number = 5000
): Promise<Restaurant[]> {
  try {
    const query = `${foodName} restaurant`;
    
    // Using the NEW Places API (Text Search)
    const placesApiUrl = 'https://places.googleapis.com/v1/places:searchText';
    
    const requestBody = {
      textQuery: query,
      locationBias: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng
          },
          radius: radius
        }
      },
      maxResultCount: 20,
      languageCode: 'en'
    };

    const response = await fetch(placesApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.priceLevel,places.photos,places.currentOpeningHours,places.userRatingCount,places.id'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Places API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      return [];
    }

    // Transform new Places API results to our Restaurant interface
    const restaurants: Restaurant[] = data.places.map((place: any, index: number) => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        place.location.latitude,
        place.location.longitude
      );

      // Get photo URL if available
      let photoUrl: string | undefined;
      if (place.photos && place.photos.length > 0) {
        const photoName = place.photos[0].name;
        photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
      }

      return {
        id: place.id || `restaurant-${index}`,
        place_id: place.id || `restaurant-${index}`,
        name: place.displayName?.text || 'Unknown Restaurant',
        rating: place.rating,
        price_level: place.priceLevel ? parsePriceLevel(place.priceLevel) : undefined,
        address: place.formattedAddress || 'Address not available',
        location: {
          lat: place.location.latitude,
          lng: place.location.longitude,
        },
        distance: Math.round(distance),
        photos: photoUrl ? [photoUrl] : [],
        opening_hours: place.currentOpeningHours ? {
          open_now: place.currentOpeningHours.openNow
        } : undefined,
        user_ratings_total: place.userRatingCount,
      };
    });

    return restaurants;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
}

/**
 * Converts new Places API price level to numeric value
 * @param priceLevel - Price level string from new API
 * @returns Numeric price level (1-4)
 */
function parsePriceLevel(priceLevel: string): number {
  const priceLevelMap: { [key: string]: number } = {
    'PRICE_LEVEL_FREE': 0,
    'PRICE_LEVEL_INEXPENSIVE': 1,
    'PRICE_LEVEL_MODERATE': 2,
    'PRICE_LEVEL_EXPENSIVE': 3,
    'PRICE_LEVEL_VERY_EXPENSIVE': 4,
  };
  return priceLevelMap[priceLevel] || 2;
}

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lng1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lng2 - Longitude of second point
 * @returns Distance in meters
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Gets user's current location using browser's Geolocation API
 * @returns Promise with user location
 */
export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Returns a default location (New York City) as fallback
 * @returns Default location coordinates
 */
export function getDefaultLocation(): UserLocation {
  // Default to New York City
  return {
    lat: 40.7128,
    lng: -74.0060,
  };
}

/**
 * Formats distance for display
 * @param meters - Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km}km`;
}

/**
 * Formats price level for display
 * @param priceLevel - Price level (1-4)
 * @returns Dollar signs string
 */
export function formatPriceLevel(priceLevel?: number): string {
  if (!priceLevel) return 'N/A';
  return '$'.repeat(priceLevel);
}
