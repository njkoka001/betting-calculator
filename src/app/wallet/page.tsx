import { redirect } from 'next/navigation'
import { getFullCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, CreditCard, AlertCircle } from 'lucide-react'
import PayoutButton from '@/components/PayoutButton'

export default async function WalletPage() {
  const user = await getFullCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all wallet transaction entries for user
  const transactions = await prisma.walletTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate current balance
  const currentBalance = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  // Fetch pending payouts
  const pendingPayouts = await prisma.payout.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Wallet Balance Hero Card */}
      <div className="bg-gradient-to-tr from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl font-bold">Trendmark Wallet Ledger</h1>
          </div>
          <span className="bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-semibold px-3 py-1 rounded-full">
            M-Pesa: {user.mpesaNumber}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
              Available Balance
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-400">
              KSh {currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <PayoutButton currentBalance={currentBalance} mpesaNumber={user.mpesaNumber} />
        </div>
      </div>

      {/* Payout History & Pending Payouts */}
      {pendingPayouts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Payout Requests
          </h2>

          <div className="divide-y divide-slate-100">
            {pendingPayouts.map((po) => (
              <div key={po.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800">Payout Request: KSh {po.amount.toFixed(2)}</span>
                  <p className="text-slate-500 text-[10px]">Submitted: {new Date(po.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                  po.status === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800'
                    : po.status === 'PENDING'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {po.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet Ledger Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900">Transaction History</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 space-y-2">
            <Wallet className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No earnings or payout transactions recorded yet.</p>
            <p className="text-[10px] text-slate-400">Complete today's campaign to earn rewards.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5">
                      {tx.amount > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <ArrowDownRight className="w-3.5 h-3.5" /> REWARD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                          <ArrowUpRight className="w-3.5 h-3.5" /> PAYOUT
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 font-medium text-slate-800">{tx.description}</td>
                    <td className="py-3.5 text-slate-500 text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`py-3.5 text-right font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {tx.amount > 0 ? `+KSh ${tx.amount.toFixed(2)}` : `-KSh ${Math.abs(tx.amount).toFixed(2)}`}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-700">
                      KSh {tx.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
