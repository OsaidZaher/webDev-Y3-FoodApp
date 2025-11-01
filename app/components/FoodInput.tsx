/**
 * FoodInput Component
 * Provides three input methods: camera capture, file upload, and manual text entry
 */

'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { FoodRecognitionResult } from '@/types';

interface FoodInputProps {
  onFoodIdentified: (foodName: string, result: FoodRecognitionResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function FoodInput({ onFoodIdentified, isLoading, setIsLoading }: FoodInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [recognitionResult, setRecognitionResult] = useState<FoodRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles image file upload and sends to recognition API
   */
  const handleImageUpload = async (file: File) => {
    setError(null);
    setIsLoading(true);
    
    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/recognize-food', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      const result: FoodRecognitionResult = {
        foodName: data.foodName,
        confidence: data.confidence,
        labels: data.labels,
        success: true,
      };

      setRecognitionResult(result);
      setManualInput(data.foodName); // Pre-fill the manual input
      
      // Automatically trigger search after food is identified
      onFoodIdentified(data.foodName, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      setPreviewUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles file input change event
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  /**
   * Handles drag and drop events
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      setError('Please drop an image file');
    }
  };

  /**
   * Triggers file input click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Triggers camera input click
   */
  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  /**
   * Handles manual text input submission
   */
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onFoodIdentified(manualInput.trim(), recognitionResult);
      setError(null);
    }
  };

  /**
   * Confirms the identified food and triggers search
   */
  const handleConfirmFood = () => {
    if (manualInput.trim()) {
      onFoodIdentified(manualInput.trim(), recognitionResult);
      setError(null);
    }
  };

  /**
   * Resets the input state
   */
  const handleReset = () => {
    setManualInput('');
    setRecognitionResult(null);
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🍕 Food Discovery
        </h1>
        <p className="text-gray-600">
          Find restaurants serving your favorite foods
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Image Preview and Recognition Result */}
      {previewUrl && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <img
              src={previewUrl}
              alt="Uploaded food"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              {recognitionResult && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Identified as:</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {recognitionResult.foodName}
                  </p>
                  {recognitionResult.confidence && (
                    <p className="text-sm text-gray-500 mt-1">
                      Confidence: {(recognitionResult.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                  {recognitionResult.labels && recognitionResult.labels.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Labels: {recognitionResult.labels.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Upload Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Drag and Drop / File Upload */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <p className="text-sm font-medium text-gray-700">
              Upload Image
            </p>
            <p className="text-xs text-gray-500">
              Click or drag & drop
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </div>

        {/* Camera Capture */}
        <div
          onClick={handleCameraClick}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200 border-gray-300 hover:border-gray-400
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <div className="space-y-2">
            <div className="text-4xl">📷</div>
            <p className="text-sm font-medium text-gray-700">
              Take Photo
            </p>
            <p className="text-xs text-gray-500">
              Use your camera
            </p>
          </div>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Manual Text Input */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-2">
              Or type food name manually:
            </label>
            <div className="flex gap-2">
              <input
                id="foodName"
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g., Pizza, Sushi, Burger..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !manualInput.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          
          {recognitionResult && manualInput && (
            <p className="text-xs text-gray-500">
              💡 Edit the food name above if needed, then click Search
            </p>
          )}
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Analyzing image...</p>
        </div>
      )}
    </div>
  );
}
