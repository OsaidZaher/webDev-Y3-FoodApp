'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Phone, Globe, Clock, DollarSign, Star, Navigation, Loader2 } from 'lucide-react';
import { RestaurantDetails } from '@/lib/google-places';
import { saveViewedRestaurant } from '@/lib/history';

interface RestaurantModalProps {
  placeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RestaurantModal({ placeId, isOpen, onClose }: RestaurantModalProps) {
  const [details, setDetails] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && placeId) {
      fetchDetails();
    }
  }, [isOpen, placeId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/restaurant-details?placeId=${encodeURIComponent(placeId)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant details');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch details');
      }

      console.log('Restaurant details received:', JSON.stringify(data.details, null, 2));
      console.log('Has geometry?', !!data.details?.geometry);
      console.log('Has location?', !!data.details?.geometry?.location);
      console.log('Location:', data.details?.geometry?.location);
      setDetails(data.details);
      
      // Save to viewed history when details are successfully loaded
      saveViewedRestaurant({
        place_id: placeId,
        name: data.details.name,
        rating: data.details.rating,
        price_level: data.details.price_level,
        address: data.details.address,
        photos: data.details.photos,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading details');
      console.error('Error fetching restaurant details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = () => {
    if (details?.geometry?.location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${details.geometry.location.lat},${details.geometry.location.lng}&destination_place_id=${placeId}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details?.name || '')}&query_place_id=${placeId}`;
      window.open(url, '_blank');
    }
  };

  const handleCall = async (phoneNumber: string) => {
    // Try to initiate call (works on mobile)
    const link = document.createElement('a');
    link.href = `tel:${phoneNumber}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    try {
      link.click();
    } catch (error) {
      // Fallback: copy to clipboard on desktop
      try {
        await navigator.clipboard.writeText(phoneNumber);
        alert(`Phone number copied to clipboard: ${phoneNumber}`);
      } catch (clipboardError) {
        alert(`Phone: ${phoneNumber}`);
      }
    } finally {
      document.body.removeChild(link);
    }
  };

  const renderPriceLevel = (level?: number): string => {
    if (!level) return 'Price not available';
    const prices = ['Free', 'Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
    return `${prices[level]} (${'$'.repeat(level)})`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Restaurant Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-orange-500 animate-spin" />
              <p className="text-gray-600">Loading details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {details && !loading && (
            <div className="space-y-6">
              {/* Restaurant Name & Rating */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{details.name}</h3>
                {details.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold text-gray-900">{details.rating.toFixed(1)}</span>
                    </div>
                    {details.user_ratings_total && (
                      <span className="text-gray-600">({details.user_ratings_total} reviews)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Photos */}
              {details.photos && details.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {details.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`${details.name} photo ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Editorial Summary */}
              {details.editorial_summary && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{details.editorial_summary}</p>
                </div>
              )}

              {/* Key Information */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Price Level */}
                {details.price_level !== undefined && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Price Range</p>
                      <p className="text-sm text-gray-600">{renderPriceLevel(details.price_level)}</p>
                    </div>
                  </div>
                )}

                {/* Opening Hours */}
                {details.opening_hours && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Status</p>
                      <p className={`text-sm font-medium ${details.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                        {details.opening_hours.open_now ? 'Open Now' : 'Closed'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hours of Operation */}
              {details.opening_hours?.weekday_text && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-700" />
                    Hours of Operation
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    {details.opening_hours.weekday_text.map((day, idx) => (
                      <p key={idx} className="text-sm text-gray-700">{day}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Address</p>
                  <p className="text-gray-700">{details.address}</p>
                </div>
              </div>

              {/* Map Preview with Link */}
              {details.geometry?.location && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-700" />
                    Location
                  </h4>
                  <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                    <iframe
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${placeId}&zoom=15`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-3">
                {details.formatted_phone_number && (
                  <button
                    onClick={() => handleCall(details.formatted_phone_number!)}
                    className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                  >
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-700 font-medium">Call</p>
                      <p className="text-sm text-blue-900">{details.formatted_phone_number}</p>
                    </div>
                  </button>
                )}

                {details.website && (
                  <a
                    href={details.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-700 font-medium">Website</p>
                      <p className="text-sm text-green-900 truncate">Visit website</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleGetDirections}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
