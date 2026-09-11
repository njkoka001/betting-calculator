import { prisma } from '@/lib/prisma'
import PayrollPaymentActions from '@/components/PayrollPaymentActions'
import { Wallet, CheckCircle2, Clock } from 'lucide-react'

export default async function AdminPayrollPage() {
  const payouts = await prisma.payout.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Payroll & M-Pesa Payouts</h1>
        <p className="text-slate-400 text-xs mt-1">Process user withdrawal requests and record M-Pesa payout reference numbers</p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-sm space-y-4">
        {payouts.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No payout requests in payroll queue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">User</th>
                  <th className="pb-3">M-Pesa Number</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Requested Date</th>
                  <th className="pb-3">Payout Ref</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {payouts.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-700/30">
                    <td className="py-3.5 font-bold text-white">{po.user.fullName}</td>
                    <td className="py-3.5 font-mono text-emerald-400 font-bold">{po.mpesaNumber}</td>
                    <td className="py-3.5 font-black text-white text-sm">KSh {po.amount.toFixed(2)}</td>
                    <td className="py-3.5 text-slate-400 text-[10px]">
                      {new Date(po.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 font-mono text-slate-300">
                      {po.mpesaRefCode || '—'}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        po.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : po.status === 'REJECTED'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {po.status === 'PENDING' && (
                        <PayrollPaymentActions payoutId={po.id} userId={po.userId} amount={po.amount} />
                      )}
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
