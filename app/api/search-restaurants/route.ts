import { NextRequest, NextResponse } from 'next/server';
import { searchRestaurants } from '@/lib/google-places';

/**
 * POST /api/search-restaurants
 * Searches for restaurants based on food name and user location
 * This endpoint is publicly accessible to allow guest users to search
 * Supports pagination with pageToken parameter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { foodName, location, radius, pageSize, pageToken } = body;

    // Validate required fields
    if (!foodName) {
      return NextResponse.json(
        { success: false, error: 'Food name is required' },
        { status: 400 }
      );
    }

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Valid location coordinates are required' },
        { status: 400 }
      );
    }

    // Get Google Places API key from environment
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_PLACES_API_KEY is not set');
      return NextResponse.json(
        { success: false, error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // Search for restaurants with pagination support
    const result = await searchRestaurants(
      foodName,
      location,
      apiKey,
      radius || 5000,
      pageSize || 15,
      pageToken
    );

    return NextResponse.json({
      success: true,
      restaurants: result.restaurants,
      count: result.restaurants.length,
      nextPageToken: result.nextPageToken,
      hasMore: !!result.nextPageToken,
    });
  } catch (error) {
    console.error('Error in search-restaurants API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        restaurants: [],
        count: 0,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}
