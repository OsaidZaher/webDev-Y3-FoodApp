import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantDetails } from '@/lib/google-places';

/**
 * GET /api/restaurant-details?placeId=xxx
 * Fetches detailed information about a specific restaurant
 * This endpoint is publicly accessible to allow guest users to view details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
      return NextResponse.json(
        { success: false, error: 'Place ID is required' },
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

    // Fetch restaurant details
    const details = await getRestaurantDetails(placeId, apiKey);

    return NextResponse.json({
      success: true,
      details,
    });
  } catch (error) {
    console.error('Error in restaurant-details API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
