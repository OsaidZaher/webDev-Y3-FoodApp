import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

export interface RecipeResult {
  success: boolean;
  foodName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: {
    item: string;
    amount: string;
    unit: string;
  }[];
  steps: {
    stepNumber: number;
    instruction: string;
    tip?: string;
  }[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
  };
  tags: string[];
}

/**
 * POST /api/generate-recipe
 * Generate a recipe from food name or image analysis
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

    const { foodName, imageBase64 } = await request.json();

    if (!foodName && !imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Food name or image is required' },
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

    let identifiedFood = foodName;

    // If image is provided, first identify the food
    if (imageBase64 && !foodName) {
      const visionResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify this food item in the image. Respond with ONLY the name of the food dish, nothing else.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 100,
      });

      identifiedFood = visionResponse.choices[0]?.message?.content?.trim() || 'Unknown Food';
    }

    // Generate the recipe
    const prompt = `You are a professional chef and nutritionist. Create a detailed recipe for "${identifiedFood}".

Provide a comprehensive recipe with the following structure in JSON format:
{
  "foodName": "exact name of the dish",
  "description": "A brief appetizing description of the dish (2-3 sentences)",
  "prepTime": "preparation time (e.g., '15 mins')",
  "cookTime": "cooking time (e.g., '30 mins')",
  "servings": number of servings,
  "difficulty": "Easy" or "Medium" or "Hard",
  "ingredients": [
    { "item": "ingredient name", "amount": "quantity", "unit": "measurement unit" }
  ],
  "steps": [
    { "stepNumber": 1, "instruction": "detailed step instruction", "tip": "optional helpful tip" }
  ],
  "nutrition": {
    "calories": estimated calories per serving (number),
    "protein": "amount in grams (e.g., '25g')",
    "carbs": "amount in grams",
    "fat": "amount in grams",
    "fiber": "amount in grams",
    "sugar": "amount in grams",
    "sodium": "amount in mg"
  },
  "tags": ["array of relevant tags like 'vegetarian', 'quick', 'healthy', etc."]
}

Ensure the recipe is:
1. Accurate and authentic to the dish
2. Practical with clear measurements
3. Includes helpful cooking tips
4. Has realistic nutritional estimates

Respond with ONLY valid JSON, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef and nutritionist. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let recipe: RecipeResult;
    try {
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsed = JSON.parse(cleanedResponse);
      recipe = {
        success: true,
        ...parsed,
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid response format from AI');
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error in generate recipe API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
