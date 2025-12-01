"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Inline SVG Icons
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
        enabled ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25" : "bg-zinc-700"
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  )
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [location, setLocation] = useState(true)
  const [history, setHistory] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pb-16 md:pb-0">
        {/* Ambient background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center space-y-6">
          {/* Animated loader */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 animate-pulse" />
            <div className="absolute inset-2 rounded-xl bg-[#0a0a0f] flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-violet-400" />
            </div>
            {/* Orbiting particles */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-violet-400 rounded-full" />
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "4s", animationDirection: "reverse" }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1.5 h-1.5 bg-fuchsia-400 rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">Loading your account</p>
            <p className="text-sm text-zinc-500">Just a moment...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24 md:pb-8">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/8 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <div className="relative border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
              <p className="text-sm text-zinc-400">Manage your profile and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Card */}
        <div className="group relative rounded-3xl overflow-hidden animate-fade-in" style={{ animationDelay: "0ms" }}>
          {/* Gradient border */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/20 rounded-3xl" />
          <div className="absolute inset-px bg-[#12121a] rounded-3xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-start gap-5 mb-8">
              {/* Avatar with gradient ring */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl blur-md opacity-50" />
                <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl p-0.5">
                  <div className="w-full h-full bg-[#12121a] rounded-[14px] flex items-center justify-center">
                    <UserIcon className="w-10 h-10 md:w-12 md:h-12 text-violet-400" />
                  </div>
                </div>
                {/* Sparkle badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center ring-2 ring-[#12121a]">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 pt-1">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{session?.user?.name || "User"}</h2>
                <p className="text-sm md:text-base text-zinc-400 mb-3">{session?.user?.email}</p>
                {/* Verified badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs md:text-sm font-medium text-emerald-400">Verified Account</span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="border-t border-white/[0.06] pt-6">
              <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-violet-400" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-zinc-500" />
                    <span className="text-zinc-400">Name</span>
                  </div>
                  <span className="font-medium text-white">{session?.user?.name || "Not set"}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <MailIcon className="w-5 h-5 text-zinc-500" />
                    <span className="text-zinc-400">Email</span>
                  </div>
                  <span className="font-medium text-white">{session?.user?.email}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-zinc-500" />
                    <span className="text-zinc-400">Member since</span>
                  </div>
                  <span className="font-medium text-white">November 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="group relative rounded-3xl overflow-hidden animate-fade-in" style={{ animationDelay: "100ms" }}>
          {/* Gradient border on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-fuchsia-500/0 group-hover:from-violet-500/20 group-hover:to-fuchsia-500/20 rounded-3xl transition-all duration-500" />
          <div className="absolute inset-px bg-[#12121a] rounded-3xl" />

          <div className="relative p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-violet-400" />
              Preferences
            </h3>

            <div className="space-y-1">
              {/* Email Notifications */}
              <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-200 -mx-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <BellIcon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm md:text-base">Email Notifications</p>
                    <p className="text-xs md:text-sm text-zinc-500">Receive updates about new restaurants</p>
                  </div>
                </div>
                <ToggleSwitch enabled={notifications} onChange={setNotifications} />
              </div>

              {/* Location Services */}
              <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-200 -mx-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm md:text-base">Location Services</p>
                    <p className="text-xs md:text-sm text-zinc-500">Use my location for better results</p>
                  </div>
                </div>
                <ToggleSwitch enabled={location} onChange={setLocation} />
              </div>

              {/* Save History */}
              <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-200 -mx-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <ClockIcon className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm md:text-base">Save Search History</p>
                    <p className="text-xs md:text-sm text-zinc-500">Keep track of your searches</p>
                  </div>
                </div>
                <ToggleSwitch enabled={history} onChange={setHistory} />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="group relative rounded-3xl overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
          {/* Red gradient border */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/10 rounded-3xl" />
          <div className="absolute inset-px bg-[#12121a] rounded-3xl" />

          <div className="relative p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold text-red-400 mb-6 flex items-center gap-2">
              <TrashIcon className="w-5 h-5" />
              Danger Zone
            </h3>

            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="group/btn relative w-full py-3.5 px-6 rounded-xl font-semibold text-sm md:text-base overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 shadow-lg shadow-red-500/25" />
                <span className="relative flex items-center justify-center gap-2 text-white">
                  <LogOutIcon className="w-5 h-5" />
                  Sign Out
                </span>
              </button>

              <button className="group/btn relative w-full py-3.5 px-6 rounded-xl font-semibold text-sm md:text-base overflow-hidden transition-all duration-300 border-2 border-red-500/30 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10">
                <span className="flex items-center justify-center gap-2 text-red-400">
                  <TrashIcon className="w-5 h-5" />
                  Delete Account
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
