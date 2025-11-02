import { NextRequest, NextResponse } from 'next/server';
import { searchRestaurants } from '@/lib/google-places';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/search-restaurants
 * Searches for restaurants based on food name and user location
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { foodName, location, radius } = body;

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

    // Search for restaurants
    const restaurants = await searchRestaurants(
      foodName,
      location,
      apiKey,
      radius || 5000
    );

    return NextResponse.json({
      success: true,
      restaurants,
      count: restaurants.length,
    });
  } catch (error) {
    console.error('Error in search-restaurants API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        restaurants: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
