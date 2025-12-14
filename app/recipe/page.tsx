"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Recipe type definition
interface Recipe {
  success: boolean
  foodName: string
  description: string
  prepTime: string
  cookTime: string
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  ingredients: {
    item: string
    amount: string
    unit: string
  }[]
  steps: {
    stepNumber: number
    instruction: string
    tip?: string
  }[]
  nutrition: {
    calories: number
    protein: string
    carbs: string
    fat: string
    fiber: string
    sugar: string
    sodium: string
  }
  tags: string[]
}

// Inline SVG Icons
const ChefHatIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
    <path d="M6 17h12" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
)

const CameraIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
)

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const FlameIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
)

const LeafIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
)

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export default function RecipeCreatorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [inputMode, setInputMode] = useState<"upload" | "manual">("manual")
  const [manualInput, setManualInput] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

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
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateRecipe = async () => {
    if (inputMode === "manual" && !manualInput.trim()) {
      setError("Please enter a food name")
      return
    }

    if (inputMode === "upload" && !selectedImage) {
      setError("Please select an image first")
      return
    }

    setError(null)
    setIsLoading(true)
    setRecipe(null)

    try {
      const body: { foodName?: string; imageBase64?: string } = {}

      if (inputMode === "manual") {
        body.foodName = manualInput.trim()
      } else if (selectedImage) {
        body.imageBase64 = selectedImage.split(",")[1]
      }

      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate recipe")
      }

      setRecipe(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating recipe")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setRecipe(null)
    setManualInput("")
    setSelectedImage(null)
    setError(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
      case "Medium":
        return "text-amber-400 bg-amber-500/20 border-amber-500/30"
      case "Hard":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      default:
        return "text-white/60 bg-white/10 border-white/20"
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pb-16 md:pb-0 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl shadow-violet-500/20">
              <BookOpenIcon className="w-10 h-10 text-violet-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="absolute -top-2 left-1/2 w-2 h-2 bg-violet-400 rounded-full" />
            </div>
          </div>
          <p className="text-lg text-white/80 font-medium mt-6 tracking-wide">Loading Recipe Creator</p>
          <p className="text-sm text-white/40 mt-1">Just a moment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24 md:pb-8 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/25">
                <BookOpenIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Recipe <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Creator</span>
              </h1>
              <p className="text-white/50 mt-2 text-base md:text-lg max-w-xl">
                Upload a food photo or type a dish name to get a complete recipe with ingredients, steps, and nutritional information
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        {!recipe && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700" style={{ animationDelay: "100ms" }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-violet-600/30 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 overflow-hidden">
                {/* Mode Selector */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-6 max-w-md mx-auto">
                  <button
                    onClick={() => setInputMode("manual")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                      inputMode === "manual"
                        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <SearchIcon className="w-4 h-4" />
                    Type Food Name
                  </button>
                  <button
                    onClick={() => setInputMode("upload")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                      inputMode === "upload"
                        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <CameraIcon className="w-4 h-4" />
                    Upload Image
                  </button>
                </div>

                {/* Manual Input */}
                {inputMode === "manual" && (
                  <div className="max-w-xl mx-auto">
                    <div className="relative">
                      <input
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleGenerateRecipe()}
                        placeholder="Enter a food name (e.g., Spaghetti Carbonara)"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 text-lg"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <SparklesIcon className="w-5 h-5 text-violet-400/50" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                {inputMode === "upload" && (
                  <div className="max-w-xl mx-auto">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />

                    {!selectedImage ? (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video border-2 border-dashed border-white/20 hover:border-violet-500/50 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 group bg-white/[0.02] hover:bg-white/[0.04]"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <UploadIcon className="w-8 h-8 text-violet-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-white/60 font-medium">Click to upload a food image</p>
                          <p className="text-white/30 text-sm mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </button>
                    ) : (
                      <div className="relative aspect-video rounded-2xl overflow-hidden">
                        <img
                          src={selectedImage}
                          alt="Selected food"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-3 right-3 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors duration-300"
                        >
                          <XIcon className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleGenerateRecipe}
                    disabled={isLoading || (inputMode === "manual" ? !manualInput.trim() : !selectedImage)}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {isLoading ? (
                      <>
                        <div className="relative w-5 h-5 animate-spin">
                          <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                        <span className="relative">Generating Recipe...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="relative w-5 h-5" />
                        <span className="relative">Generate Recipe</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-violet-600/30 rounded-3xl blur-xl animate-pulse" />
              <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-12 text-center overflow-hidden">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl animate-pulse" />
                  <div className="absolute inset-[2px] bg-[#0a0a0f] rounded-[22px] flex items-center justify-center">
                    <ChefHatIcon className="w-8 h-8 text-violet-400" />
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50" />
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Creating Your Recipe</h3>
                <p className="text-white/50 text-lg">
                  Our AI chef is crafting the perfect recipe for you...
                </p>

                <div className="mt-8 max-w-xs mx-auto">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recipe Result */}
        {recipe && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
            {/* Recipe Header */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{recipe.foodName}</h2>
                    <p className="text-white/60 text-lg leading-relaxed">{recipe.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {recipe.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-sm text-violet-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <ClockIcon className="w-4 h-4 text-violet-400" />
                      <div className="text-sm">
                        <p className="text-white/40">Prep</p>
                        <p className="text-white font-medium">{recipe.prepTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <FlameIcon className="w-4 h-4 text-orange-400" />
                      <div className="text-sm">
                        <p className="text-white/40">Cook</p>
                        <p className="text-white font-medium">{recipe.cookTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <UsersIcon className="w-4 h-4 text-blue-400" />
                      <div className="text-sm">
                        <p className="text-white/40">Servings</p>
                        <p className="text-white font-medium">{recipe.servings}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getDifficultyColor(recipe.difficulty)}`}>
                      <SparklesIcon className="w-4 h-4" />
                      <span className="font-medium text-sm">{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients & Nutrition */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ingredients */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl blur opacity-30" />
                <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-2xl border border-white/10 p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <LeafIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Ingredients</h3>
                  </div>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span className="text-white/80">
                          <span className="font-medium text-white">{ingredient.amount} {ingredient.unit}</span>{" "}
                          {ingredient.item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Nutrition */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-2xl blur opacity-30" />
                <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-2xl border border-white/10 p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <FlameIcon className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Nutrition per Serving</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-3xl font-bold text-white">{recipe.nutrition.calories}</p>
                      <p className="text-white/40 text-sm">Calories</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-2xl font-bold text-white">{recipe.nutrition.protein}</p>
                      <p className="text-white/40 text-sm">Protein</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-2xl font-bold text-white">{recipe.nutrition.carbs}</p>
                      <p className="text-white/40 text-sm">Carbs</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-2xl font-bold text-white">{recipe.nutrition.fat}</p>
                      <p className="text-white/40 text-sm">Fat</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-2xl font-bold text-white">{recipe.nutrition.fiber}</p>
                      <p className="text-white/40 text-sm">Fiber</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-2xl font-bold text-white">{recipe.nutrition.sodium}</p>
                      <p className="text-white/40 text-sm">Sodium</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cooking Steps */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-3xl blur opacity-30" />
              <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <ChefHatIcon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Instructions</h3>
                </div>

                <div className="space-y-6">
                  {recipe.steps.map((step) => (
                    <div key={step.stepNumber} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                          <span className="text-white font-bold text-sm">{step.stepNumber}</span>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-white/90 text-lg leading-relaxed">{step.instruction}</p>
                        {step.tip && (
                          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <LightbulbIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-amber-200 text-sm">{step.tip}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Completion */}
                <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Ready to serve!</h4>
                    <p className="text-white/50">Enjoy your homemade {recipe.foodName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* New Recipe Button */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium transition-all duration-300"
              >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Create Another Recipe
              </button>
            </div>
          </div>
        )}

        {/* How It Works - when no recipe is displayed */}
        {!recipe && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-fuchsia-600/10 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">How it works</h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: CameraIcon,
                        step: "01",
                        title: "Input Food",
                        description: "Type a food name or upload a photo of a dish you want to recreate",
                        gradient: "from-violet-500 to-indigo-500",
                      },
                      {
                        icon: SparklesIcon,
                        step: "02",
                        title: "AI Generation",
                        description: "Our AI analyzes and creates a detailed recipe with all the information you need",
                        gradient: "from-fuchsia-500 to-pink-500",
                      },
                      {
                        icon: ChefHatIcon,
                        step: "03",
                        title: "Cook & Enjoy",
                        description: "Follow the step-by-step instructions and create your delicious meal at home",
                        gradient: "from-pink-500 to-rose-500",
                      },
                    ].map((item, index) => (
                      <div
                        key={item.step}
                        className="group/card relative"
                        style={{ animationDelay: `${(index + 1) * 100}ms` }}
                      >
                        <div
                          className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-0 group-hover/card:opacity-30 transition-opacity duration-500`}
                        />
                        <div className="relative h-full bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 p-6 transition-all duration-500">
                          <div className="absolute top-4 right-4 text-4xl font-bold text-white/[0.03] select-none">
                            {item.step}
                          </div>

                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-[1px] mb-5 group-hover/card:scale-110 transition-transform duration-500`}
                          >
                            <div className="w-full h-full rounded-2xl bg-[#0a0a0f]/90 flex items-center justify-center">
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          <h3 className="font-semibold text-white text-lg mb-2">
                            {item.title}
                          </h3>
                          <p className="text-white/40 text-sm leading-relaxed group-hover/card:text-white/50 transition-colors duration-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom animation keyframes */}
      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
