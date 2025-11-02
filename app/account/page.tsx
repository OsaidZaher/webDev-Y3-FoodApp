'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16 md:pb-0">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">👤</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Account Settings 👤
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
          <div className="flex items-start gap-4 md:gap-6 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-3xl md:text-4xl">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {session?.user?.name || 'User'}
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-2">
                {session?.user?.email}
              </p>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs md:text-sm font-medium">
                ✓ Verified Account
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{session?.user?.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member since:</span>
                <span className="font-medium text-gray-900">November 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900 text-sm md:text-base">Email Notifications</p>
                <p className="text-xs md:text-sm text-gray-500">Receive updates about new restaurants</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900 text-sm md:text-base">Location Services</p>
                <p className="text-xs md:text-sm text-gray-500">Use my location for better results</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 text-sm md:text-base">Save Search History</p>
                <p className="text-xs md:text-sm text-gray-500">Keep track of your searches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border-2 border-red-200">
          <h3 className="text-lg md:text-xl font-semibold text-red-600 mb-4">
            Danger Zone
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-all text-sm md:text-base"
            >
              Sign Out
            </button>
            <button className="w-full border-2 border-red-300 text-red-600 py-3 px-6 rounded-lg font-semibold hover:bg-red-50 transition-all text-sm md:text-base">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
