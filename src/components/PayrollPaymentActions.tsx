'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function PayrollPaymentActions({
  payoutId,
  userId,
  amount,
}: {
  payoutId: string
  userId: string
  amount: number
}) {
  const [mpesaRefCode, setMpesaRefCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async (action: 'PAID' | 'REJECT') => {
    if (action === 'PAID' && !mpesaRefCode) {
      alert('Please enter the M-Pesa transaction payout reference code.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/payroll/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payoutId,
          userId,
          amount,
          mpesaRefCode,
          action,
        }),
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
      <input
        type="text"
        placeholder="M-Pesa Ref (QK998...)"
        value={mpesaRefCode}
        onChange={(e) => setMpesaRefCode(e.target.value.toUpperCase())}
        className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 uppercase w-36"
      />
      <button
        onClick={() => handlePay('PAID')}
        disabled={loading}
        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg text-xs transition flex items-center gap-1 disabled:opacity-50"
      >
        <Check className="w-3.5 h-3.5" /> Mark Paid
      </button>
      <button
        onClick={() => handlePay('REJECT')}
        disabled={loading}
        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-lg text-xs transition flex items-center gap-1 disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" /> Reject
      </button>
    </div>
  )
}
