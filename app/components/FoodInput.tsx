"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { FoodRecognitionResult } from "@/types"

interface FoodInputProps {
  onFoodRecognized: (result: FoodRecognitionResult) => void
  onFoodManualInput: (foodName: string) => void
  onImageSelected?: (imageDataUrl: string) => void
  isLoading: boolean
}

// Inline SVG Icons
const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
)

const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)

export default function FoodInput({ onFoodRecognized, onFoodManualInput, onImageSelected, isLoading }: FoodInputProps) {
  const [inputMode, setInputMode] = useState<"upload" | "manual">("upload")
  const [manualInput, setManualInput] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB")
      return
    }

    setError(null)

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setSelectedImage(dataUrl)
      if (onImageSelected) {
        onImageSelected(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUploadAndRecognize = async () => {
    if (!selectedImage) {
      setError("Please select an image first")
      return
    }

    setError(null)

    try {
      const base64Data = selectedImage.split(",")[1]

      const response = await fetch("/api/recognize-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Data }),
      })

      if (!response.ok) {
        throw new Error("Failed to recognize food")
      }

      const result: FoodRecognitionResult = await response.json()

      if (!result.success) {
        setError("Could not identify the food. Please try a different image or enter manually.")
        return
      }

      onFoodRecognized(result)
    } catch (err) {
      setError("Error recognizing food. Please try again.")
      console.error(err)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!manualInput.trim()) {
      setError("Please enter a food name")
      return
    }

    setError(null)
    onFoodManualInput(manualInput.trim())
  }

  const handleClear = () => {
    setSelectedImage(null)
    setManualInput("")
    setError(null)
    stopCamera()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      setStream(mediaStream)
      setShowCamera(true)
      setError(null)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 100)
    } catch (err) {
      setError("Could not access camera. Please check permissions or use file upload.")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)
    setSelectedImage(imageDataUrl)
    if (onImageSelected) {
      onImageSelected(imageDataUrl)
    }
    stopCamera()
  }

  return (
    <div className="relative rounded-3xl overflow-hidden">
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-violet-500/30 rounded-3xl" />

      <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
          <button
            onClick={() => setInputMode("upload")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              inputMode === "upload"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <UploadIcon className="w-4 h-4" />
            Upload Photo
          </button>
          <button
            onClick={() => setInputMode("manual")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              inputMode === "manual"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <EditIcon className="w-4 h-4" />
            Type Food Name
          </button>
        </div>

        {/* Upload Mode */}
        {inputMode === "upload" && (
          <div className="space-y-4">
            {/* Camera View */}
            {showCamera && (
              <div className="relative bg-black rounded-2xl overflow-hidden border border-white/[0.08]">
                <video ref={videoRef} autoPlay playsInline className="w-full max-h-96 object-cover" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    onClick={capturePhoto}
                    className="bg-white text-gray-900 p-4 rounded-full shadow-lg hover:scale-110 transition-all"
                    disabled={isLoading}
                  >
                    <CameraIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-red-500/90 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-lg hover:bg-red-500 transition-all flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <XIcon className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

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
                    className={`block w-full p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 ${
                      selectedImage
                        ? "border-violet-500/50 bg-violet-500/5"
                        : "border-white/[0.1] hover:border-violet-500/50 hover:bg-violet-500/5"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {selectedImage ? (
                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <img
                            src={selectedImage || "/placeholder.svg"}
                            alt="Selected food"
                            className="max-h-48 mx-auto rounded-xl shadow-2xl shadow-violet-500/20"
                          />
                          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
                        </div>
                        <p className="text-sm text-white/50">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/[0.08]">
                          <UploadIcon className="w-8 h-8 text-violet-400" />
                        </div>
                        <p className="text-white font-semibold">Click to upload food photo</p>
                        <p className="text-sm text-white/40">or drag and drop</p>
                        <p className="text-xs text-white/30">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>

                {!selectedImage && (
                  <div className="text-center">
                    <button
                      onClick={startCamera}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CameraIcon className="w-5 h-5 text-violet-400" />
                      Take Photo with Camera
                    </button>
                  </div>
                )}
              </>
            )}

            {!showCamera && (
              <div className="flex gap-3">
                <button
                  onClick={handleUploadAndRecognize}
                  disabled={!selectedImage || isLoading}
                  className="flex-1 relative group overflow-hidden rounded-xl py-3.5 px-6 font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),transparent_60%)]" />
                  {isLoading ? (
                    <span className="relative flex items-center justify-center gap-2">
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                      Recognizing...
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      <SparklesIcon className="w-5 h-5" />
                      Recognize Food
                    </span>
                  )}
                </button>
                {selectedImage && (
                  <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="px-5 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <XIcon className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Input Mode */}
        {inputMode === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label htmlFor="manual-food-input" className="block text-sm font-medium text-white/70 mb-2">
                What food are you looking for?
              </label>
              <input
                id="manual-food-input"
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g., Pizza, Burger, Sushi, Shawarma..."
                disabled={isLoading}
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!manualInput.trim() || isLoading}
                className="flex-1 relative group overflow-hidden rounded-xl py-3.5 px-6 font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),transparent_60%)]" />
                {isLoading ? (
                  <span className="relative flex items-center justify-center gap-2">
                    <LoaderIcon className="w-5 h-5 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    <SendIcon className="w-4 h-4" />
                    Search Restaurants
                  </span>
                )}
              </button>
              {manualInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="px-5 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <XIcon className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
