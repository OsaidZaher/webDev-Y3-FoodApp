/**
 * API Route: GET /api/search-restaurants
 * Searches for restaurants based on food name and location using Google Places API
 * Query params: ?food=[name]&lat=[latitude]&lng=[longitude]&radius=[meters]
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchRestaurants } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const food = searchParams.get('food');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');

    // Validate required parameters
    if (!food || !lat || !lng) {
      return NextResponse.json(
        { error: 'Missing required parameters: food, lat, lng' },
        { status: 400 }
      );
    }

    // Parse coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude values' },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Latitude or longitude out of valid range' },
        { status: 400 }
      );
    }

    const searchRadius = radius ? parseInt(radius) : 5000;

    // Search for restaurants
    const restaurants = await searchRestaurants(
      food,
      { lat: latitude, lng: longitude },
      apiKey,
      searchRadius
    );

    return NextResponse.json({
      restaurants,
      status: 'success',
      count: restaurants.length,
    });
  } catch (error) {
    console.error('Error in search-restaurants API:', error);
    
    // Check if it's a Places API error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while searching for restaurants' },
      { status: 500 }
    );
  }
}
