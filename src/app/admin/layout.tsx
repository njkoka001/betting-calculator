import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  Share2, 
  CreditCard, 
  Image as ImageIcon, 
  Wallet, 
  ShoppingBag, 
  Settings,
  ShieldCheck
} from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 space-y-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xl shadow">
            A
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-wide">ADMIN PORTAL</h2>
            <span className="text-[10px] text-amber-400 font-semibold uppercase">Trendmark Control</span>
          </div>
        </div>

        <nav className="space-y-1.5 text-xs font-semibold">
          <Link href="/admin" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <LayoutDashboard className="w-4 h-4 text-amber-400" /> Dashboard Overview
          </Link>
          <Link href="/admin/payments" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <CreditCard className="w-4 h-4 text-sky-400" /> Payment Verification
          </Link>
          <Link href="/admin/reviews" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <ImageIcon className="w-4 h-4 text-emerald-400" /> Screenshot Reviews
          </Link>
          <Link href="/admin/payroll" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <Wallet className="w-4 h-4 text-indigo-400" /> Payroll & Payouts
          </Link>
          <Link href="/admin/campaigns" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <Share2 className="w-4 h-4 text-pink-400" /> Daily Campaigns
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <Users className="w-4 h-4 text-slate-400" /> User Directory
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">{children}</main>
    </div>
  )
}
