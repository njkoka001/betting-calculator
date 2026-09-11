import { prisma } from '@/lib/prisma'
import { Users, ShieldCheck, CreditCard, ImageIcon, Wallet, Share2 } from 'lucide-react'

export default async function AdminDashboardPage() {
  const totalUsers = await prisma.user.count({ where: { role: 'USER' } })
  const activePackagesCount = await prisma.userPackage.count({ where: { status: 'ACTIVE' } })
  const pendingPaymentsCount = await prisma.paymentTransaction.count({ where: { status: 'PENDING' } })
  const pendingReviewsCount = await prisma.submission.count({ where: { status: 'PENDING' } })

  const approvedSubmissions = await prisma.submission.findMany({
    where: { status: 'APPROVED' },
    select: { approvedViews: true },
  })
  const totalViewsApproved = approvedSubmissions.reduce((sum, s) => sum + (s.approvedViews || 0), 0)

  const pendingPayouts = await prisma.payout.findMany({
    where: { status: 'PENDING' },
    select: { amount: true },
  })
  const pendingPayrollSum = pendingPayouts.reduce((sum, p) => sum + p.amount, 0)

  // Fetch today's active campaign
  const todayCampaign = await prisma.campaign.findFirst({
    where: { status: 'ACTIVE' },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-xs mt-1">Platform metrics, payment verifications & campaign controls</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalUsers}</div>
          <p className="text-[10px] text-slate-500">{activePackagesCount} Active Subscriptions</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Pending Payments</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{pendingPaymentsCount}</div>
          <p className="text-[10px] text-slate-500">M-Pesa Activation References</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Pending Reviews</span>
            <ImageIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{pendingReviewsCount}</div>
          <p className="text-[10px] text-slate-500">WhatsApp Screenshot Proofs</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Pending Payroll</span>
            <Wallet className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">KSh {pendingPayrollSum.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">{pendingPayouts.length} Withdrawal Requests</p>
        </div>
      </div>

      {/* Active Campaign Box */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" /> Today's Active Campaign
          </h2>
          {todayCampaign && (
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              ACTIVE ({todayCampaign.campaignDate})
            </span>
          )}
        </div>

        {todayCampaign ? (
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
            <img src={todayCampaign.product.image} alt="" className="w-20 h-20 object-cover rounded-xl shrink-0" />
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">{todayCampaign.product.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{todayCampaign.promoText}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No active campaign set for today.</p>
        )}
      </div>
    </div>
  )
}
