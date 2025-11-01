# 🍕 Food Discovery Application

A Next.js-powered web application that helps users discover restaurants serving their favorite foods. Upload a photo, take a picture, or manually search to find nearby restaurants using Google Cloud Vision API and Google Places API.

## ✨ Features

### 🔍 Three Input Methods
- **📸 Image Upload**: Drag-and-drop or click to upload food images
- **📷 Camera Capture**: Take photos directly from your device
- **⌨️ Manual Entry**: Type food names directly

### 🤖 AI-Powered Food Recognition
- Automatic food identification using Google Cloud Vision API
- Confidence scores and alternative labels
- Editable results before searching

### 🍽️ Restaurant Search
- Find nearby restaurants serving identified foods
- Uses real-time geolocation (with fallback to default location)
- Configurable search radius (default: 5km)

### 📊 Smart Sorting
- **Rating**: Sort by highest-rated restaurants
- **Price (Low to High)**: Find budget-friendly options
- **Price (High to Low)**: Discover premium dining

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on phones, tablets, and desktops
- Modern, clean UI with Tailwind CSS

### 🎯 Additional Features
- Distance calculation from user location
- Restaurant ratings and reviews count
- Price level indicators
- Open/closed status badges
- Direct Google Maps integration
- Professional error handling

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**: 
  - Google Cloud Vision API (food recognition)
  - Google Places API (restaurant search)
- **State Management**: React hooks (useState, useEffect)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18.x or higher installed
- npm or yarn package manager
- Google Cloud account with billing enabled
- API keys for:
  - Google Cloud Vision API
  - Google Places API

## 🔑 Getting API Keys

### Google Cloud Vision API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Cloud Vision API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### Google Places API

1. In the same Google Cloud project
2. Enable the **Places API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
3. You can use the same API key or create a new one:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key" (if creating new)
   - Copy your API key

**Note**: Both APIs require billing to be enabled on your Google Cloud account.

## 🚀 Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd webdev_proj
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   GOOGLE_CLOUD_VISION_API_KEY=your_actual_vision_api_key
   GOOGLE_PLACES_API_KEY=your_actual_places_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
webdev_proj/
├── app/
│   ├── api/
│   │   ├── recognize-food/
│   │   │   └── route.ts          # Food recognition API endpoint
│   │   └── search-restaurants/
│   │       └── route.ts          # Restaurant search API endpoint
│   ├── components/
│   │   ├── FoodInput.tsx         # Input interface component
│   │   ├── RestaurantCard.tsx    # Restaurant card component
│   │   └── RestaurantList.tsx    # Restaurant list with sorting
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── lib/
│   ├── google-vision.ts          # Vision API helpers
│   └── google-places.ts          # Places API helpers
├── types/
│   └── index.ts                  # TypeScript interfaces
├── .env.example                  # Environment variables template
├── .env.local                    # Your API keys (git-ignored)
├── package.json
└── README.md
```

## 🎮 Usage

### Method 1: Upload Image
1. Click the "Upload Image" box or drag & drop an image
2. Wait for AI to identify the food
3. Edit the food name if needed
4. Click "Search" to find restaurants

### Method 2: Take Photo
1. Click the "Take Photo" box
2. Allow camera permissions
3. Take a photo of your food
4. Confirm or edit the identified food
5. Click "Search"

### Method 3: Manual Entry
1. Type the food name in the text input
2. Click "Search"
3. View restaurant results

### Sorting Results
- Use the dropdown menu to sort by:
  - Rating (High to Low)
  - Price (Low to High)
  - Price (High to Low)

### View on Maps
- Click "View on Maps" on any restaurant card
- Opens Google Maps with the restaurant location

## 🧪 Testing Checklist

- [x] Image upload works and identifies food
- [x] Camera capture works (on supported devices)
- [x] Manual text input searches successfully
- [x] Restaurant results display correctly
- [x] All three sorting options function properly
- [x] Responsive design on mobile, tablet, desktop
- [x] Error states display for invalid inputs
- [x] Loading states show during API calls
- [x] Geolocation works with permission/fallback
- [x] Google Maps integration opens correctly

## 🔧 Configuration

### Search Radius
Default search radius is 5000 meters (5km). To change:

Edit `app/page.tsx`:
```typescript
radius: '5000', // Change to desired radius in meters
```

### Default Location
Default fallback location is New York City. To change:

Edit `lib/google-places.ts`:
```typescript
export function getDefaultLocation(): UserLocation {
  return {
    lat: 40.7128,  // Your latitude
    lng: -74.0060, // Your longitude
  };
}
```

## 🐛 Troubleshooting

### "API key not configured" error
- Ensure `.env.local` file exists in the root directory
- Verify API keys are correctly set
- Restart the development server after adding keys

### "Failed to analyze image" error
- Check that Vision API is enabled in Google Cloud Console
- Verify billing is enabled on your Google Cloud account
- Ensure image size is under 4MB
- Try a different image format (JPEG, PNG, WebP)

### No restaurants found
- Check that Places API is enabled
- Verify billing is enabled
- Try a more common food name
- Increase search radius
- Check your location permissions

### Geolocation not working
- Allow location permissions in your browser
- Application will use default location (NYC) as fallback
- Check browser console for specific errors

## 📝 API Endpoints

### POST `/api/recognize-food`
Analyzes uploaded images to identify food items.

**Request**: 
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` (File)

**Response**:
```json
{
  "foodName": "Pizza",
  "confidence": 0.95,
  "labels": ["Food", "Pizza", "Italian Cuisine"]
}
```

### GET `/api/search-restaurants`
Searches for restaurants based on food and location.

**Query Parameters**:
- `food`: Food name (required)
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `radius`: Search radius in meters (optional, default: 5000)

**Response**:
```json
{
  "restaurants": [...],
  "status": "success",
  "count": 10
}
```

## 🚀 Building for Production

```bash
npm run build
npm start
```

## 🔒 Security Notes

- Never commit `.env.local` to version control
- API keys are server-side only (Next.js API routes)
- Consider implementing rate limiting for production
- Add API key restrictions in Google Cloud Console

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

This is a learning project. Feel free to fork and modify for your own use.

## 📧 Support

For issues related to:
- **Google APIs**: Check [Google Cloud Documentation](https://cloud.google.com/docs)
- **Next.js**: Visit [Next.js Documentation](https://nextjs.org/docs)

## 🎉 Acknowledgments

- Powered by Google Cloud Vision API
- Powered by Google Places API
- Built with Next.js and Tailwind CSS

---

**Enjoy discovering new restaurants! 🍕🍜🍔**

