'use client'

import { useState } from 'react'
import { PlusCircle, Sparkles } from 'lucide-react'

export default function CampaignCreationForm({ products }: { products: any[] }) {
  const [productId, setProductId] = useState(products[0]?.id || '')
  const [campaignDate, setCampaignDate] = useState('2026-09-09')
  const [promoText, setPromoText] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, campaignDate, promoText }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create campaign')
      }

      setMsg('Campaign scheduled successfully!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      setMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 space-y-4 shadow">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-400" /> Create Daily Campaign
        </h2>
        <p className="text-xs text-slate-400">Select product & set daily advertising copy</p>
      </div>

      {msg && <div className="text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">{msg}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Select Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl font-medium text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (KSh {p.price})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Campaign Date (YYYY-MM-DD)</label>
          <input
            type="text"
            required
            value={campaignDate}
            onChange={(e) => setCampaignDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Shareable Promo Text</label>
          <textarea
            required
            rows={5}
            placeholder="Enter promotional copy for users to copy & share to WhatsApp..."
            value={promoText}
            onChange={(e) => setPromoText(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Publishing Campaign...' : 'Publish Daily Campaign'} <Sparkles className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
