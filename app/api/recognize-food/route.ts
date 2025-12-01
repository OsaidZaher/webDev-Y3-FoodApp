import { NextRequest, NextResponse } from 'next/server';
import { recognizeFood } from '@/lib/google-vision';

/**
 * POST /api/recognize-food
 * Recognizes food from an uploaded image using Google Cloud Vision API
 * This endpoint is publicly accessible to allow guest users to search
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validate base64 string
    if (typeof image !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // Call Google Vision API
    const result = await recognizeFood(image);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Could not recognize food in the image',
          foodName: '',
          labels: []
        },
        { status: 200 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in recognize-food API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        foodName: '',
        labels: []
      },
      { status: 500 }
    );
  }
}
