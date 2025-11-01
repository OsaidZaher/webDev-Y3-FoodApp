# 🚀 Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Get Google API Keys

### Option A: Use Existing Keys
If you already have Google Cloud API keys, skip to Step 3.

### Option B: Create New Keys
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable these APIs:
   - Cloud Vision API
   - Places API
4. Create API credentials:
   - Click "Create Credentials" > "API Key"
   - Copy the key

## Step 3: Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your keys:
# GOOGLE_CLOUD_VISION_API_KEY=your_actual_key_here
# GOOGLE_PLACES_API_KEY=your_actual_key_here
```

## Step 4: Run the Application
```bash
npm run dev
```

## Step 5: Open in Browser
Navigate to: http://localhost:3000

## 🎉 You're Ready!
- Upload a food image
- Take a photo
- Or type a food name
- Find restaurants near you!

## ⚠️ Troubleshooting

**Issue**: "API key not configured"
**Solution**: Make sure `.env.local` exists in the root directory with your API keys, then restart the dev server.

**Issue**: "No restaurants found"
**Solution**: Try a more common food name (e.g., "pizza", "burger", "sushi").

**Issue**: Geolocation not working
**Solution**: Allow location permissions in your browser. The app will use NYC as fallback if denied.

## 📚 Need More Help?
See the full README.md for detailed documentation.
