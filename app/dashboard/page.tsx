'use client';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Dashboard! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            You've successfully logged in. This is where your food discovery journey begins!
          </p>
          
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Next Steps:
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Upload a photo of food to discover restaurants</li>
              <li>Browse nearby restaurants</li>
              <li>Save your favorite dishes</li>
              <li>Share your culinary adventures</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
              Upload Food Photo 📸
            </button>
            <button className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all">
              Browse Restaurants 🍽️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
