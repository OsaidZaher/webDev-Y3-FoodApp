import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

/**
 * POST /api/ai-recommendations
 * Generate AI-powered food recommendations based on user history
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

    const { userHistory, insights } = await request.json();

    if (!userHistory || !insights) {
      return NextResponse.json(
        { success: false, error: 'User history and insights are required' },
        { status: 400 }
      );
    }

    // Get OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // Build the prompt
    const topFoods = insights.topFoodCategories
      .slice(0, 3)
      .map((c: any) => c.name)
      .join(', ');

    const prompt = `You are a food recommendation expert. Based on the user's dining history, suggest similar foods they might enjoy.

User's Top Food Categories: ${topFoods}
Total Searches: ${insights.totalClassifications}
Viewed Restaurants: ${insights.totalViewedRestaurants}
Average Rating Preference: ${insights.averageRating?.toFixed(1) || 'N/A'}
Price Preference: ${insights.preferredPriceLevel ? '$'.repeat(insights.preferredPriceLevel) : 'N/A'}

Task: Recommend 5 food items similar to their favorites. Consider:
- Cuisine type similarities
- Flavor profiles
- Ingredients and preparation methods
- Popular alternatives

Format your response as a JSON array with this structure:
[
  {
    "foodName": "specific food item",
    "reason": "brief explanation why this matches their taste",
    "cuisineType": "cuisine category",
    "confidence": number from 70-100
  }
]

Make recommendations diverse but relevant. Include both close matches and interesting variations.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a culinary expert who understands food preferences and can recommend similar dishes based on user history. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let recommendations;
    try {
      recommendations = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid response format from AI');
    }

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('Error in AI recommendations API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
