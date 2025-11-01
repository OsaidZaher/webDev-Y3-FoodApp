/**
 * API Route: POST /api/recognize-food
 * Analyzes an uploaded image to identify food items using Google Cloud Vision API
 */

import { NextRequest, NextResponse } from 'next/server';
import { recognizeFood, fileToBase64 } from '@/lib/google-vision';

export async function POST(request: NextRequest) {
  try {
    // Check if credentials are configured
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return NextResponse.json(
        { error: 'Google Cloud credentials not configured. Please set GOOGLE_APPLICATION_CREDENTIALS in .env.local' },
        { status: 500 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 4MB)
    const maxSize = 4 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 4MB.' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);

    // Call Google Cloud Vision API
    const result = await recognizeFood(base64Image);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to analyze image. Please try another image.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      foodName: result.foodName,
      confidence: result.confidence,
      labels: result.labels,
    });
  } catch (error) {
    console.error('Error in recognize-food API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the image' },
      { status: 500 }
    );
  }
}
