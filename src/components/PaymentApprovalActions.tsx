'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function PaymentApprovalActions({
  paymentId,
  userId,
  packageId,
}: {
  paymentId: string
  userId: string
  packageId: string
}) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (action: 'VERIFY' | 'REJECT') => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/payments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, userId, packageId, action }),
      })
      if (res.ok) {
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => handleAction('VERIFY')}
        disabled={loading}
        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-xs transition flex items-center gap-1 disabled:opacity-50"
      >
        <Check className="w-3.5 h-3.5" /> Approve & Activate
      </button>
      <button
        onClick={() => handleAction('REJECT')}
        disabled={loading}
        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-lg text-xs transition flex items-center gap-1 disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" /> Reject
      </button>
    </div>
  )
}
