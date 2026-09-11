import { prisma } from '@/lib/prisma'
import PaymentApprovalActions from '@/components/PaymentApprovalActions'
import { CreditCard, CheckCircle2, XCircle } from 'lucide-react'

export default async function AdminPaymentsPage() {
  const pendingPayments = await prisma.paymentTransaction.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch package map for displaying package names
  const packages = await prisma.package.findMany()
  const packageMap = new Map(packages.map((p) => [p.id, p]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Payment Verification Queue</h1>
        <p className="text-slate-400 text-xs mt-1">Verify submitted M-Pesa reference codes and activate user accounts</p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-sm space-y-4">
        {pendingPayments.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No payment transactions pending verification.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Package</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">M-Pesa Ref</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {pendingPayments.map((pm) => {
                  const pkg = packageMap.get(pm.packageId)

                  return (
                    <tr key={pm.id} className="hover:bg-slate-700/30">
                      <td className="py-3.5">
                        <span className="font-bold text-white block">{pm.user.fullName}</span>
                        <span className="text-[10px] text-slate-400">{pm.user.phone}</span>
                      </td>
                      <td className="py-3.5 font-semibold text-sky-400">
                        {pkg?.name || 'Package'}
                      </td>
                      <td className="py-3.5 font-black text-white">
                        KSh {pm.amount}
                      </td>
                      <td className="py-3.5 font-mono text-emerald-400 font-bold tracking-wider">
                        {pm.transactionReference}
                      </td>
                      <td className="py-3.5 text-slate-400 text-[10px]">
                        {new Date(pm.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          pm.status === 'VERIFIED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : pm.status === 'REJECTED'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {pm.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {pm.status === 'PENDING' && (
                          <PaymentApprovalActions paymentId={pm.id} userId={pm.userId} packageId={pm.packageId} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
