'use client'

import { useState } from 'react'
import { Eye, Check, X, Calculator } from 'lucide-react'

export default function ReviewApprovalCard({
  submissionId,
  imageUrl,
  detectedViews,
  userName,
  userPhone,
  packageName,
  rate,
  campaignTitle,
}: {
  submissionId: string
  imageUrl: string
  detectedViews: number
  userName: string
  userPhone: string
  packageName: string
  rate: number
  campaignTitle: string
}) {
  const [approvedViews, setApprovedViews] = useState<number>(detectedViews)
  const [loading, setLoading] = useState(false)

  const rewardAmount = (approvedViews || 0) * rate

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          approvedViews: Number(approvedViews),
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
    <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 space-y-4 shadow flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header Info */}
        <div className="flex justify-between items-start border-b border-slate-700 pb-3">
          <div>
            <h3 className="font-extrabold text-white text-sm">{userName}</h3>
            <span className="text-[10px] text-slate-400 font-medium">{userPhone}</span>
          </div>
          <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-sky-500/30">
            {packageName} (KSh {rate.toFixed(2)}/v)
          </span>
        </div>

        {/* Campaign title */}
        <p className="text-xs text-slate-300 font-semibold line-clamp-1">
          Campaign: {campaignTitle}
        </p>

        {/* Screenshot Image Preview */}
        <div className="h-56 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-700/80">
          <img src={imageUrl} alt="Screenshot proof" className="max-h-full object-contain" />
        </div>

        {/* Views & Reward Calculation Audit */}
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-400" /> Detected OCR Views:
            </span>
            <span className="font-bold text-slate-200">{detectedViews}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> Approved Views:
            </span>
            <input
              type="number"
              value={approvedViews}
              onChange={(e) => setApprovedViews(parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 bg-slate-800 border border-slate-600 rounded-lg text-sm font-black text-white text-right focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm">
            <span className="text-slate-300 font-bold">Calculated Reward:</span>
            <span className="font-black text-emerald-400">
              KSh {rewardAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={() => handleAction('APPROVE')}
          disabled={loading}
          className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <Check className="w-4 h-4" /> Approve & Credit KSh {rewardAmount.toFixed(2)}
        </button>
        <button
          onClick={() => handleAction('REJECT')}
          disabled={loading}
          className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-xl text-xs transition flex items-center gap-1 disabled:opacity-50"
        >
          <X className="w-4 h-4" /> Reject
        </button>
      </div>
    </div>
  )
}
