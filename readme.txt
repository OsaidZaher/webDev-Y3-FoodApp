================================================================================
                        FOOD FINDER WEB APPLICATION
                    Configuration and Deployment Guide
================================================================================

PROJECT INFORMATION
-------------------
Project Name: Food Finder App (webdev_proj)
GitHub Repository: https://github.com/OsaidZaher/webDev-Y3-FoodApp
Branch: main
Framework: Next.js 16.0.1 with TypeScript
Database: PostgreSQL with Prisma ORM

================================================================================
                              PREREQUISITES
================================================================================

Before installing, ensure you have the following installed:

1. Node.js (version 18.x or higher)
   - Download from: https://nodejs.org/

2. PostgreSQL Database (version 14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Or use a cloud service like Supabase, Neon, or Railway

3. Git (for cloning the repository)
   - Download from: https://git-scm.com/

================================================================================
                           INSTALLATION STEPS
================================================================================

STEP 1: Clone the Repository
-----------------------------
Open a terminal and run:

    git clone https://github.com/OsaidZaher/webDev-Y3-FoodApp.git
    cd webDev-Y3-FoodApp

STEP 2: Install Dependencies
-----------------------------
Run the following command to install all required packages:

    npm install

STEP 3: Set Up Environment Variables
--------------------------------------
Create a file named ".env" in the root directory with the following content:

    # Database Connection (PostgreSQL)
    DATABASE_URL="postgresql://username:password@localhost:5432/foodfinder_db"

    # NextAuth.js Configuration
    NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"
    NEXTAUTH_URL="http://localhost:3000"

    # Google Cloud Vision API (for food image recognition)
    GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"

    # Google Places API (for restaurant search)
    GOOGLE_PLACES_API_KEY="your-google-places-api-key"

    # OpenAI API (for recipe generation)
    OPENAI_API_KEY="your-openai-api-key"

IMPORTANT: Replace the placeholder values with your actual API keys and credentials.

STEP 4: Set Up the Database
----------------------------
Option A - Using Prisma (Recommended):

    # Generate Prisma client
    npx prisma generate

    # Create database tables
    npx prisma migrate dev --name init

    # (Optional) Open Prisma Studio to view/manage data
    npx prisma studio

Option B - Using SQL Script:

    # Connect to PostgreSQL and run the schema.sql file
    psql -U your_username -d foodfinder_db -f database/schema.sql

STEP 5: Run the Application
----------------------------
Development mode (with hot reload):

    npm run dev

Production mode:

    npm run build
    npm run start

The application will be available at: http://localhost:3000

================================================================================
                            API KEYS REQUIRED
================================================================================

1. GOOGLE CLOUD VISION API
   - Used for: Food image recognition
   - Get it from: https://console.cloud.google.com/
   - Enable: Cloud Vision API
   - Create a service account and download the JSON credentials file

2. GOOGLE PLACES API
   - Used for: Restaurant search functionality
   - Get it from: https://console.cloud.google.com/
   - Enable: Places API (New)

3. OPENAI API
   - Used for: AI-powered recipe generation
   - Get it from: https://platform.openai.com/api-keys

4. DATABASE URL
   - Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   - Example: postgresql://postgres:mypassword@localhost:5432/foodfinder_db

================================================================================
                           APPLICATION FEATURES
================================================================================

1. USER AUTHENTICATION
   - Sign up with email and password
   - Login/Logout functionality
   - Password change capability
   - JWT-based session management

2. FOOD IMAGE RECOGNITION
   - Upload food images
   - AI-powered food identification using Google Cloud Vision

3. RESTAURANT SEARCH
   - Search restaurants by food type
   - Location-based results using Google Places API
   - View restaurant details, ratings, and reviews

4. RECIPE GENERATION
   - AI-generated recipes using OpenAI
   - Includes ingredients, steps, and nutritional information

5. USER DASHBOARD
   - Personalized recommendations
   - Search history tracking

================================================================================
                           PROJECT STRUCTURE
================================================================================

webdev_proj/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── recognize-food/# Food recognition endpoint
│   │   ├── search-restaurants/ # Restaurant search
│   │   └── generate-recipe/   # Recipe generation
│   ├── components/        # React components
│   ├── dashboard/         # User dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Registration page
│   ├── search/           # Food search page
│   └── recipe/           # Recipe page
├── lib/                   # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   ├── google-vision.ts  # Vision API integration
│   └── google-places.ts  # Places API integration
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema file
├── database/             # Database scripts
│   └── schema.sql        # SQL schema for manual setup
├── components/           # Shared UI components
├── types/                # TypeScript type definitions
└── public/               # Static assets

================================================================================
                          TROUBLESHOOTING
================================================================================

Issue: "Cannot connect to database"
Solution: 
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env file is correct
- Check if the database exists

Issue: "NEXTAUTH_SECRET is not set"
Solution:
- Generate a secret: openssl rand -base64 32
- Add it to your .env file

Issue: "Google API errors"
Solution:
- Verify API keys are correct
- Ensure APIs are enabled in Google Cloud Console
- Check that the service account JSON file path is correct

Issue: "Module not found"
Solution:
- Run: npm install
- Delete node_modules and package-lock.json, then run npm install again

================================================================================
                            DEPLOYMENT
================================================================================

For production deployment (e.g., Vercel):

1. Push your code to GitHub
2. Connect your repository to Vercel (https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

Environment variables needed in production:
- DATABASE_URL (use a production PostgreSQL database)
- NEXTAUTH_SECRET
- NEXTAUTH_URL (your production URL)
- GOOGLE_APPLICATION_CREDENTIALS (or use service account)
- GOOGLE_PLACES_API_KEY
- OPENAI_API_KEY

================================================================================
                              CONTACT
================================================================================

GitHub: https://github.com/OsaidZaher/webDev-Y3-FoodApp

================================================================================
