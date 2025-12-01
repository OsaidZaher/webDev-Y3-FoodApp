"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

// Inline SVG Icons
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const ChefHatIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
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

const LogInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
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

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const authenticatedNavItems = [
    { name: "Home", path: "/dashboard", icon: HomeIcon },
    { name: "Search", path: "/search", icon: SearchIcon },
    { name: "Recommendations", path: "/recommendations", icon: StarIcon },
    { name: "History", path: "/history", icon: HistoryIcon },
    { name: "Account", path: "/account", icon: UserIcon },
  ]

  const unauthenticatedNavItems = [{ name: "Search", path: "/search", icon: SearchIcon }]

  const navItems = session ? authenticatedNavItems : unauthenticatedNavItems

  const isActive = (path: string) => pathname === path

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-white/[0.08]" />

        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="relative flex justify-around items-center h-16 px-2 safe-area-bottom">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                href={item.path}
                className="group relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300"
              >
                {/* Active indicator glow */}
                {active && (
                  <div className="absolute inset-x-2 top-0 h-8 bg-gradient-to-b from-violet-500/20 to-transparent rounded-b-xl" />
                )}

                <div
                  className={`relative p-2 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30"
                      : "group-hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      active ? "text-white" : "text-zinc-400 group-hover:text-white"
                    }`}
                  />
                </div>

                <span
                  className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${
                    active ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}

          {!session && (
            <Link
              href="/login"
              className="group relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300"
            >
              <div className="relative p-2 rounded-xl transition-all duration-300 group-hover:bg-white/5">
                <LogInIcon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-[10px] font-medium mt-1 text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300">
                Sign In
              </span>
            </Link>
          )}
        </div>
      </nav>

      {/* Desktop Top Navigation */}
      <nav className="hidden md:block sticky top-0 z-50">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.08]" />

        {/* Gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href={session ? "/dashboard" : "/"} className="group flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <ChefHatIcon className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-full flex items-center justify-center ring-2 ring-[#0a0a0f]">
                  <SparklesIcon className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                FoodFinder
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="flex items-center gap-1 bg-white/[0.03] rounded-2xl p-1.5 border border-white/[0.06]">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      active ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {/* Active background */}
                    {active && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-xl" />
                        <div className="absolute inset-0 rounded-xl border border-violet-500/30" />
                      </>
                    )}

                    {/* Hover background */}
                    {!active && (
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors duration-300" />
                    )}

                    <Icon
                      className={`relative w-4 h-4 transition-colors duration-300 ${
                        active ? "text-violet-400" : "group-hover:text-violet-400"
                      }`}
                    />
                    <span className="relative">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/20">
                    <UserIcon className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-sm text-zinc-300 font-medium max-w-[120px] truncate">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
                >
                  <LogOutIcon className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  <LogInIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="group relative px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 shadow-lg shadow-violet-500/25" />
                  <span className="relative">Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for bottom nav on mobile */}
      <div className="md:hidden h-16" />
    </>
  )
}
