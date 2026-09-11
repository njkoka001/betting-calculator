import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trendmark Electronics & WhatsApp Ad Rewards',
  description: 'Shop quality electronics and earn rewards by sharing daily product campaigns on WhatsApp Status.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50/50">{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs text-center">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p className="font-semibold text-slate-200">Trendmark Electronics & Rewards Platform © 2026</p>
            <p>Quality Gadgets • Genuine Ads • Verified M-Pesa Payouts</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
