"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

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

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
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

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
)

const ZapIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
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
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { value: "50K+", label: "Food Items Recognized" },
    { value: "99%", label: "Accuracy Rate" },
    { value: "1M+", label: "Restaurants Listed" },
    { value: "24/7", label: "Available Always" },
  ]

  const steps = [
    {
      icon: CameraIcon,
      step: "01",
      title: "Upload or Search",
      description: "Take a photo of any dish or simply type what you're craving. Our system handles both seamlessly.",
    },
    {
      icon: SparklesIcon,
      step: "02",
      title: "AI Recognition",
      description: "Our advanced AI instantly identifies the food and searches for matching restaurants nearby.",
    },
    {
      icon: MapPinIcon,
      step: "03",
      title: "Discover Nearby",
      description: "Get a curated list of restaurants near you serving exactly what you want to eat.",
    },
  ]

  const features = [
    {
      icon: StarIcon,
      title: "Smart Recommendations",
      description: "Get personalized suggestions based on your search history and preferences",
    },
    {
      icon: MapPinIcon,
      title: "Location-Based Results",
      description: "Find restaurants within your preferred distance with real-time availability",
    },
    {
      icon: SearchIcon,
      title: "Detailed Information",
      description: "View ratings, hours, contact info, photos, and get directions instantly",
    },
    {
      icon: ZapIcon,
      title: "Lightning Fast",
      description: "Get results in seconds with our optimized AI processing pipeline",
    },
    {
      icon: ShieldIcon,
      title: "Privacy First",
      description: "Your data is encrypted and never shared with third parties",
    },
    {
      icon: GlobeIcon,
      title: "Global Coverage",
      description: "Works in over 100 countries with support for local cuisines",
    },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-400/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
          <div className="max-w-7xl mx-auto bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-violet-500/5">
            <div className="flex items-center justify-between h-16 px-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                    <ChefHatIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  FoodFinder
                </span>
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden sm:flex text-muted-foreground hover:text-foreground font-medium transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="group relative px-5 py-2.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-600 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
              <SparklesIcon className="w-4 h-4" />
              AI-Powered Food Discovery
              <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-8 tracking-tight">
              Discover Your Next
              <br />
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Favorite Meal
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Snap a photo of any food and instantly find the best restaurants nearby. Powered by advanced AI
              recognition technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Exploring
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/login"
                className="group w-full sm:w-auto bg-card hover:bg-accent border border-border/50 hover:border-violet-500/30 text-foreground px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div
            className={`mt-20 relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            {/* Gradient Border Container */}
            <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-violet-500/50 via-fuchsia-500/50 to-violet-500/50">
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 overflow-hidden">
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl" />

                <div className="relative grid md:grid-cols-3 gap-6">
                  {/* Preview Card 1 */}
                  <div className="group bg-background/80 backdrop-blur rounded-2xl p-6 border border-border/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
                    <div className="w-full h-36 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
                      <CameraIcon className="w-14 h-14 text-violet-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="h-4 bg-gradient-to-r from-muted to-muted/50 rounded-full w-3/4 mb-3" />
                    <div className="h-3 bg-muted/50 rounded-full w-1/2" />
                  </div>

                  {/* Preview Card 2 - Featured */}
                  <div className="group relative md:transform md:scale-110 md:-my-4 z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl p-6 shadow-2xl shadow-violet-500/25">
                      <div className="w-full h-36 bg-white/20 backdrop-blur rounded-xl mb-5 flex items-center justify-center overflow-hidden">
                        <SearchIcon className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="h-4 bg-white/40 rounded-full w-3/4 mb-3" />
                      <div className="h-3 bg-white/20 rounded-full w-1/2" />
                    </div>
                  </div>

                  {/* Preview Card 3 */}
                  <div className="group bg-background/80 backdrop-blur rounded-2xl p-6 border border-border/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
                    <div className="w-full h-36 bg-gradient-to-br from-fuchsia-100 to-violet-100 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
                      <MapPinIcon className="w-14 h-14 text-fuchsia-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="h-4 bg-gradient-to-r from-muted to-muted/50 rounded-full w-3/4 mb-3" />
                    <div className="h-3 bg-muted/50 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`group relative p-[1px] rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/40 hover:to-fuchsia-500/40 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 h-full text-center">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find your perfect meal in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-[2px]">
              <div className="w-full h-full bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-violet-500/50" />
            </div>

            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-border to-border hover:from-violet-500/50 hover:to-fuchsia-500/50 transition-all duration-500">
                  <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 h-full relative overflow-hidden">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5 transition-all duration-500" />

                    <div className="relative">
                      {/* Icon Container */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="relative w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        {/* Step Number */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-violet-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-violet-600">{step.step}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Powered by Advanced{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                AI Technology
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge image recognition can identify thousands of dishes from cuisines around the world
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-border to-border hover:from-violet-500/50 hover:to-fuchsia-500/50 transition-all duration-500"
              >
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5 transition-all duration-500" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-violet-500/20 group-hover:to-fuchsia-500/20 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-violet-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-500">
            <div className="bg-card/95 backdrop-blur-xl rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-8 shadow-lg shadow-violet-500/30">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Ready to Find Your Next Meal?</h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                  Join thousands of food lovers who use FoodFinder to discover amazing restaurants every day.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/signup"
                    className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center gap-2">
                      Create Free Account
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-emerald-500" />
                    <span>Free to use</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-emerald-500" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-emerald-500" />
                    <span>Instant access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                  <ChefHatIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                FoodFinder
              </span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign Up
              </Link>
              <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                Search
              </Link>
            </div>
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} FoodFinder. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
