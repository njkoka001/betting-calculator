import { prisma } from '@/lib/prisma'
import { Users, Phone, MessageSquare, CreditCard, Award } from 'lucide-react'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      userPackages: {
        where: { status: 'ACTIVE' },
        include: { package: true },
      },
      walletLedger: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">User Directory</h1>
        <p className="text-slate-400 text-xs mt-1">Manage registered members, active package subscriptions, and payout accounts</p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Name</th>
                <th className="pb-3">Phone (Login)</th>
                <th className="pb-3">WhatsApp Number</th>
                <th className="pb-3">M-Pesa Payout</th>
                <th className="pb-3">Active Package</th>
                <th className="pb-3 text-right">Wallet Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {users.map((u) => {
                const activePkg = u.userPackages?.[0]?.package
                const balance = u.walletLedger.reduce((sum, tx) => sum + tx.amount, 0)

                return (
                  <tr key={u.id} className="hover:bg-slate-700/30">
                    <td className="py-3.5">
                      <span className="font-bold text-white block">{u.fullName}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{u.role}</span>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono">{u.phone}</td>
                    <td className="py-3.5 text-emerald-400 font-mono">{u.whatsappNumber}</td>
                    <td className="py-3.5 text-sky-400 font-mono">{u.mpesaNumber}</td>
                    <td className="py-3.5">
                      {activePkg ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {activePkg.name}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">None</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right font-black text-white">
                      KSh {balance.toFixed(2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
