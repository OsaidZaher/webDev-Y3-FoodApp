"use client"

import { Upload, Sparkles, MapPin } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload or Search",
    description: "Upload a photo of food or manually enter what you are craving",
  },
  {
    icon: Sparkles,
    title: "AI Recognition",
    description: "Our AI identifies the food and finds matching restaurants nearby",
  },
  {
    icon: MapPin,
    title: "Discover & Enjoy",
    description: "Browse restaurant options and find your perfect meal",
  },
]

export default function HowItWorks() {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-6">How it works</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-4">
              <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              {index + 1}. {step.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
