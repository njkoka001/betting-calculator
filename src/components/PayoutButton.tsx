'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react'

export default function PayoutButton({
  currentBalance,
  mpesaNumber,
}: {
  currentBalance: number
  mpesaNumber: string
}) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleRequestPayout = async () => {
    if (currentBalance < 100) {
      setMsg({ type: 'error', text: 'Minimum payout request balance is KSh 100.' })
      return
    }

    setLoading(true)
    setMsg(null)

    try {
      const res = await fetch('/api/wallet/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: currentBalance }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request payout')
      }

      setMsg({ type: 'success', text: 'Payout request submitted to payroll engine!' })
      setTimeout(() => window.location.reload(), 1500)
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleRequestPayout}
        disabled={loading || currentBalance < 100}
        className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-2xl transition shadow shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ArrowUpRight className="w-4 h-4" />
        {loading ? 'Submitting Request...' : 'Withdraw to M-Pesa'}
      </button>

      {msg && (
        <div
          className={`text-[11px] p-2.5 rounded-xl border flex items-center gap-1.5 ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}
    </div>
  )
}
