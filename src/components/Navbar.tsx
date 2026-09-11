'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  Smartphone, 
  Award, 
  Wallet, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Share2
} from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              T
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">TRENDMARK</span>
              <span className="block text-[10px] uppercase font-bold text-sky-600 tracking-wider">Electronics & Ads</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-sky-600 transition-colors flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" /> Products
            </Link>
            <Link href="/packages" className="hover:text-sky-600 transition-colors flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Packages
            </Link>
            {user && (
              <>
                <Link href="/campaign" className="hover:text-sky-600 transition-colors flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <Share2 className="w-4 h-4 animate-pulse" /> Today's Campaign
                </Link>
                <Link href="/wallet" className="hover:text-sky-600 transition-colors flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> My Wallet
                </Link>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-amber-200 transition">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Admin Portal
              </Link>
            )}
          </nav>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-xl font-medium text-xs transition">
                  <UserIcon className="w-4 h-4 text-slate-600" /> {user.fullName.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 p-2 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-slate-700 hover:text-sky-600 text-sm font-semibold px-3 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-sky-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">
            Products & Electronics
          </Link>
          <Link href="/packages" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">
            Activation Packages
          </Link>
          {user && (
            <>
              <Link href="/campaign" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-600 font-bold">
                Today's Daily Campaign 🔥
              </Link>
              <Link href="/wallet" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">
                My Wallet & Earnings
              </Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">
                My Profile
              </Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-800 font-bold bg-amber-50 px-3 rounded-lg">
              🛡️ Admin Control Panel
            </Link>
          )}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-red-600 font-semibold flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 border rounded-xl font-semibold text-slate-700">
                  Sign In
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 bg-sky-600 text-white font-semibold rounded-xl">
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
