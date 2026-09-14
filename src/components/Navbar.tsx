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

            {/* Promoter Hub Dropdown */}
            <div className="relative group">
              <button className="hover:text-sky-600 transition-colors flex items-center gap-1 text-slate-700 py-1">
                <span>Promoter Hub</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">24h</span>
              </button>
              
              <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 transform origin-top-left group-hover:scale-100 scale-95">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Promoter Tools
                </div>
                <Link href="/campaign" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">Today's Ad <span className="bg-emerald-50 text-emerald-600 text-[9px] px-1 rounded">Active</span></div>
                    <span className="text-[10px] text-slate-400 font-normal">24h rotating product ad</span>
                  </div>
                </Link>
                <Link href="/campaign/submit" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Submit Proof</div>
                    <span className="text-[10px] text-slate-400 font-normal">Auto-OCR views & rewards</span>
                  </div>
                </Link>
                <Link href="/wallet" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Wallet & Payouts</div>
                    <span className="text-[10px] text-slate-400 font-normal">Instant M-Pesa withdrawals</span>
                  </div>
                </Link>
              </div>
            </div>

            {user && (
              <Link href="/wallet" className="hover:text-sky-600 transition-colors flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> My Wallet
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-amber-200 transition">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Admin Portal
              </Link>
            )}
          </nav>

          {/* User Auth Buttons & User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-xl font-medium text-xs transition">
                  <UserIcon className="w-4 h-4 text-slate-600" />
                  <span>{user.fullName.split(' ')[0]}</span>
                </button>

                {/* User Profile Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 transform origin-top-right group-hover:scale-100 scale-95">
                  <div className="p-2.5 border-b border-slate-100">
                    <p className="font-bold text-xs text-slate-900">{user.fullName}</p>
                    <p className="text-[10px] text-slate-500 capitalize">Role: {user.role.toLowerCase()}</p>
                  </div>
                  <div className="py-1 space-y-0.5 text-xs">
                    <Link href="/profile" className="block px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      My Profile
                    </Link>
                    <Link href="/campaign" className="block px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      Today's Campaign
                    </Link>
                    <Link href="/wallet" className="block px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                      Wallet Ledger
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-3 py-2 rounded-lg bg-amber-50 text-amber-900 font-bold">
                        Admin Portal
                      </Link>
                    )}
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-semibold text-xs flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
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
