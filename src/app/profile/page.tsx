import { redirect } from 'next/navigation'
import { getFullCurrentUser } from '@/lib/auth'
import { User, Phone, MessageSquare, Mail, CreditCard, Shield, CheckCircle2, AlertTriangle, Award } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const user = await getFullCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const activePackage = user.userPackages?.[0]?.package

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      {/* Header Profile Status */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900">{user.fullName}</h1>
          <p className="text-xs text-slate-500 font-medium">Account ID: {user.id.slice(0, 8)}</p>
        </div>

        <div className="flex items-center gap-2">
          {user.profileComplete ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Profile Complete 🟢
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Profile Incomplete 🟠
            </span>
          )}
        </div>
      </div>

      {/* Subscription Package Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-bold">Subscription Package</h2>
          </div>
          {activePackage ? (
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              ACTIVE
            </span>
          ) : (
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
              INACTIVE
            </span>
          )}
        </div>

        {activePackage ? (
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="font-extrabold text-xl">{activePackage.name}</span>
              <span className="text-sm font-semibold text-emerald-400">
                KSh {activePackage.ratePerView.toFixed(2)} / view
              </span>
            </div>
            <p className="text-xs text-slate-400">{activePackage.description}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              You do not have an active package subscription. Select a package to start receiving daily promotional campaigns.
            </p>
            <Link
              href="/packages"
              className="inline-block bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Choose Package Now
            </Link>
          </div>
        )}
      </div>

      {/* Profile Details List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b pb-3 border-slate-100">Account Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> Phone Number (Login)
            </span>
            <p className="font-bold text-slate-800 text-sm">{user.phone}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Number
            </span>
            <p className="font-bold text-slate-800 text-sm">{user.whatsappNumber}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-sky-500" /> M-Pesa Payout Number
            </span>
            <p className="font-bold text-slate-800 text-sm">{user.mpesaNumber}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address
            </span>
            <p className="font-bold text-slate-800 text-sm">{user.email || 'Not Provided'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
