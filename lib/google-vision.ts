/**
 * Google Cloud Vision API Helper Functions
 * Handles image analysis and food recognition using Google Cloud Vision API
 * Uses Service Account authentication
 */

import { VisionApiResponse, VisionApiLabel, FoodRecognitionResult } from '@/types';

/**
 * Analyzes an image using Google Cloud Vision API to detect food items
 * @param imageBase64 - Base64 encoded image string
 * @returns Promise with food recognition result
 */
export async function recognizeFood(
  imageBase64: string
): Promise<FoodRecognitionResult> {
  try {
    // Import the Vision client dynamically (server-side only)
    const vision = await import('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();

    // Perform multiple detection types for better food recognition
    const [labelResult] = await client.labelDetection({
      image: { content: imageBase64 },
    });

    // Also try web detection for better food identification
    const [webResult] = await client.webDetection({
      image: { content: imageBase64 },
    });

    // Also try object localization
    const [objectResult] = await client.objectLocalization({
      image: { content: imageBase64 },
    });

    const labels = labelResult.labelAnnotations || [];
    const webEntities = webResult.webDetection?.webEntities || [];
    const localizedObjects = objectResult.localizedObjectAnnotations || [];

    // Transform labels to our VisionApiLabel format
    const transformedLabels: VisionApiLabel[] = labels.map((label) => ({
      description: label.description || '',
      score: label.score || 0,
      topicality: label.topicality || undefined,
    }));

    // Extract web entities (often more specific than labels)
    const webEntityLabels: VisionApiLabel[] = webEntities
      .filter((entity) => entity.description && entity.score)
      .map((entity) => ({
        description: entity.description || '',
        score: entity.score || 0,
      }));

    // Extract localized objects
    const objectLabels: VisionApiLabel[] = localizedObjects
      .filter((obj) => obj.name && obj.score)
      .map((obj) => ({
        description: obj.name || '',
        score: obj.score || 0,
      }));

    // Combine all sources, but prioritize label detection over web entities
    // Web entities can be too specific (brand names) or too obscure
    const allLabels = [...transformedLabels, ...objectLabels, ...webEntityLabels];
    const foodLabel = extractFoodLabel(allLabels, transformedLabels);

    return {
      foodName: foodLabel.name,
      confidence: foodLabel.confidence,
      labels: transformedLabels.slice(0, 5).map((label) => label.description),
      success: true,
    };
  } catch (error) {
    console.error('Error recognizing food:', error);
    return {
      foodName: '',
      success: false,
      labels: [],
    };
  }
}

/**
 * Extracts the most likely food-related label from Vision API results
 * @param labels - Array of labels from Vision API (combined from all sources)
 * @param originalLabels - Original label annotations for fallback
 * @returns Object with food name and confidence score
 */
function extractFoodLabel(
  labels: VisionApiLabel[],
  originalLabels: VisionApiLabel[]
): {
  name: string;
  confidence: number;
} {
  // Very generic terms to skip (expanded list)
  const veryGenericTerms = [
    'food', 'dish', 'cuisine', 'meal', 'ingredient', 'tableware', 'dishware', 
    'recipe', 'plate', 'bowl', 'cooking', 'eating', 'dining', 'lunch', 'dinner',
    'breakfast', 'snack', 'produce', 'cookware', 'serveware', 'baked goods',
    'natural foods', 'whole food', 'vegan nutrition', 'vegetarian food',
    'comfort food', 'superfood', 'animal product', 'poultry', 
    'dairy', 'cookware and bakeware'
  ];
  
  // Moderately generic terms (acceptable but not ideal)
  const moderatelyGenericTerms = [
    'finger food', 'fast food', 'junk food', 'staple food', 'side dish',
    'main course', 'appetizer', 'dessert', 
  ];

  // Common food categories (good level of specificity)
  const goodSpecificityTerms = [
    'burger', 'pizza', 'pasta', 'noodles', 'rice', 'soup', 'salad',
    'sandwich', 'wrap', 'taco', 'kebab', 'curry', 'stew', 'sushi',
    'bread', 'pastry', 'cake', 'meat', 'seafood', 'vegetable', 'fruit'
  ];

  // Overly specific/obscure terms to avoid (brand names, regional variants, technical terms)
  const tooSpecificTerms = [
    'mcdonald', 'kfc', 'subway', 'domino', 'pizza hut', 'taco bell',
    'wendy', 'burger king', 'starbucks', 'dunkin', 'chipotle'
  ];

  // Food-specific dishes (ideal specificity)
  const specificFoodIndicators = [
    'shawarma', 'kebab', 'biryani', 'falafel', 'hummus', 'burrito', 'quesadilla',
    'lasagna', 'ramen', 'pho', 'pad thai', 'tikka', 'tandoori', 'gyro',
    'baklava', 'tiramisu', 'croissant', 'baguette', 'pretzel', 'bagel',
    'donut', 'muffin', 'scone', 'waffle', 'pancake', 'crepe', 'omelet',
    'frittata', 'quiche', 'risotto', 'paella', 'goulash', 'schnitzel',
    'tempura', 'sashimi', 'nigiri', 'maki', 'dim sum', 'dumpling',
    'spring roll', 'samosa', 'pakora', 'empanada', 'pierogi', 'ravioli',
    'gnocchi', 'tortellini', 'cannoli', 'eclair', 'macaron', 'tart',
    'tacos', 'enchilada', 'nachos', 'fajita', 'chalupa', 'tostada'
  ];

  // Helper function to check if a label is too specific (brand names, obscure terms)
  const isTooSpecific = (label: string): boolean => {
    const lowerLabel = label.toLowerCase();
    return tooSpecificTerms.some(term => lowerLabel.includes(term));
  };

  // Helper function to check if a label contains specific food terms
  const containsSpecificFood = (label: string): boolean => {
    const lowerLabel = label.toLowerCase();
    return specificFoodIndicators.some(food => lowerLabel.includes(food));
  };

  // Helper function to check if label is a good common food category
  const isGoodSpecificity = (label: string): boolean => {
    const lowerLabel = label.toLowerCase();
    return goodSpecificityTerms.some(food => lowerLabel === food || lowerLabel.includes(food + ' '));
  };

  // Helper function to calculate specificity score (higher = more specific)
  const getSpecificityScore = (label: string): number => {
    const lowerLabel = label.toLowerCase();
    
    // Skip brand names and overly specific terms
    if (isTooSpecific(lowerLabel)) {
      return 0;
    }
    
    // Highest priority: specific dish names (shawarma, biryani, etc.)
    if (containsSpecificFood(lowerLabel)) {
      return 1000;
    }
    
    // High priority: good common food categories (burger, pizza, etc.)
    if (isGoodSpecificity(lowerLabel)) {
      return 500;
    }
    
    // Very generic terms get lowest score
    if (veryGenericTerms.some(term => lowerLabel === term)) {
      return 1;
    }
    
    // Moderately generic terms get low-medium score
    if (moderatelyGenericTerms.some(term => lowerLabel.includes(term))) {
      return 10;
    }
    
    // Multi-word labels are often more specific (but not always better)
    const wordCount = label.split(' ').length;
    if (wordCount >= 3) {
      return 80;
    }
    if (wordCount === 2) {
      return 100;
    }
    
    // Single word labels that aren't in any list get decent score
    return 50;
  };

  // Score and sort all labels by specificity and confidence
  const scoredLabels = labels
    .map(label => ({
      ...label,
      specificityScore: getSpecificityScore(label.description),
      combinedScore: getSpecificityScore(label.description) * label.score
    }))
    .filter(label => label.specificityScore > 1) // Filter out very generic and too specific terms
    .sort((a, b) => b.combinedScore - a.combinedScore);

  // Return the most specific label
  if (scoredLabels.length > 0) {
    const bestLabel = scoredLabels[0];
    return {
      name: bestLabel.description,
      confidence: bestLabel.score,
    };
  }

  // Fallback: try to find ANY food-related term from original labels
  const anyFoodLabel = originalLabels.find(label => {
    const lower = label.description.toLowerCase();
    return !veryGenericTerms.slice(0, 7).includes(lower); // Only skip the most generic
  });

  if (anyFoodLabel) {
    return {
      name: anyFoodLabel.description,
      confidence: anyFoodLabel.score * 0.5, // Lower confidence for fallback
    };
  }

  // Last resort: use the highest confidence label from original
  if (originalLabels.length > 0) {
    return {
      name: originalLabels[0].description,
      confidence: originalLabels[0].score * 0.3,
    };
  }

  // Default fallback
  return {
    name: 'Unknown food item',
    confidence: 0,
  };
}

/**
 * Converts a File object to base64 string
 * @param file - File object to convert
 * @returns Promise with base64 string (without data URL prefix)
 */
export async function fileToBase64(file: File): Promise<string> {
  // Convert File to Buffer, then to base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString('base64');
}

/**
 * Validates if the file is an image
 * @param file - File to validate
 * @returns True if file is an image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

/**
 * Validates image size (max 4MB for Vision API)
 * @param file - File to validate
 * @returns True if file size is acceptable
 */
export function isValidImageSize(file: File): boolean {
  const maxSize = 4 * 1024 * 1024; // 4MB
  return file.size <= maxSize;
}