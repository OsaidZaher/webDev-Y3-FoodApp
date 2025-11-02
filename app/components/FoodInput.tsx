'use client';

import { useState, useRef } from 'react';
import { FoodRecognitionResult } from '@/types';
import { Upload, Camera, X, Loader2, Edit3, Send } from 'lucide-react';

interface FoodInputProps {
  onFoodRecognized: (result: FoodRecognitionResult) => void;
  onFoodManualInput: (foodName: string) => void;
  onImageSelected?: (imageDataUrl: string) => void;
  isLoading: boolean;
}

export default function FoodInput({ onFoodRecognized, onFoodManualInput, onImageSelected, isLoading }: FoodInputProps) {
  const [inputMode, setInputMode] = useState<'upload' | 'manual'>('upload');
  const [manualInput, setManualInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedImage(dataUrl);
      if (onImageSelected) {
        onImageSelected(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndRecognize = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setError(null);

    try {
      // Extract base64 data from data URL
      const base64Data = selectedImage.split(',')[1];

      const response = await fetch('/api/recognize-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Data }),
      });

      if (!response.ok) {
        throw new Error('Failed to recognize food');
      }

      const result: FoodRecognitionResult = await response.json();
      
      if (!result.success) {
        setError('Could not identify the food. Please try a different image or enter manually.');
        return;
      }

      onFoodRecognized(result);
    } catch (err) {
      setError('Error recognizing food. Please try again.');
      console.error(err);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualInput.trim()) {
      setError('Please enter a food name');
      return;
    }

    setError(null);
    onFoodManualInput(manualInput.trim());
  };

  const handleClear = () => {
    setSelectedImage(null);
    setManualInput('');
    setError(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
        audio: false,
      });
      setStream(mediaStream);
      setShowCamera(true);
      setError(null);

      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      setError('Could not access camera. Please check permissions or use file upload.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setSelectedImage(imageDataUrl);
    if (onImageSelected) {
      onImageSelected(imageDataUrl);
    }
    stopCamera();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setInputMode('upload')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            inputMode === 'upload'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Photo
        </button>
        <button
          onClick={() => setInputMode('manual')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            inputMode === 'manual'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Type Food Name
        </button>
      </div>

      {/* Upload Mode */}
      {inputMode === 'upload' && (
        <div className="space-y-4">
          {/* Camera View */}
          {showCamera && (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-96 object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <button
                  onClick={capturePhoto}
                  className="bg-white text-gray-900 p-4 rounded-full shadow-lg hover:bg-gray-100 transition-all"
                  disabled={isLoading}
                >
                  <Camera className="w-6 h-6" />
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center gap-2"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Hidden canvas for capturing photo */}
          <canvas ref={canvasRef} className="hidden" />

          {/* File Input or Image Preview (when camera is not active) */}
          {!showCamera && (
            <>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="food-image-input"
                  disabled={isLoading}
                />
                <label
                  htmlFor="food-image-input"
                  className={`block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
                    selectedImage 
                      ? 'border-orange-400 bg-orange-50' 
                      : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {selectedImage ? (
                    <div className="space-y-2">
                      <img 
                        src={selectedImage} 
                        alt="Selected food" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-gray-700 font-medium">Click to upload food photo</p>
                      <p className="text-sm text-gray-500">or drag and drop</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Camera Button */}
              {!selectedImage && (
                <div className="text-center">
                  <button
                    onClick={startCamera}
                    disabled={isLoading}
                    className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Take Photo with Camera
                  </button>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          {!showCamera && (
            <div className="flex gap-3">
              <button
                onClick={handleUploadAndRecognize}
                disabled={!selectedImage || isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Recognizing...
                  </span>
                ) : (
                  'Recognize Food'
                )}
              </button>
              {selectedImage && (
                <button
                  onClick={handleClear}
                  disabled={isLoading}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Manual Input Mode */}
      {inputMode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label htmlFor="manual-food-input" className="block text-sm font-medium text-gray-700 mb-2">
              What food are you looking for?
            </label>
            <input
              id="manual-food-input"
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g., Pizza, Burger, Sushi, Shawarma..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!manualInput.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Search Restaurants
                </span>
              )}
            </button>
            {manualInput && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
