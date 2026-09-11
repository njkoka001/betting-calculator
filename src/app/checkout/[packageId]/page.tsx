'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Smartphone, CreditCard, CheckCircle2, AlertCircle, ArrowRight, Copy, Check } from 'lucide-react'

export default function CheckoutPage({ params }: { params: { packageId: string } }) {
  const router = useRouter()
  const [pkg, setPkg] = useState<any>(null)
  const [mpesaMessage, setMpesaMessage] = useState('')
  const [copiedNumber, setCopiedNumber] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const mpesaNumber = '0734570672'

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        const found = data.packages?.find((p: any) => p.id === params.packageId)
        if (found) setPkg(found)
      })
  }, [params.packageId])

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(mpesaNumber)
      setCopiedNumber(true)
      setTimeout(() => setCopiedNumber(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!mpesaMessage.trim()) {
      setError('Please paste your M-Pesa SMS confirmation message.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/packages/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: params.packageId,
          mpesaMessage: mpesaMessage.trim(),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment proof')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!pkg) {
    return (
      <div className="max-w-md mx-auto py-20 text-center text-slate-500 font-medium">
        Loading package details...
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">Package Activation</span>
          <h1 className="text-2xl font-black text-slate-900">Activate {pkg.name}</h1>
          <p className="text-xs text-slate-500">
            Send KSh {pkg.price} via M-Pesa to the number below and paste your M-Pesa SMS message to unlock daily products.
          </p>
        </div>

        {/* Selected Package Summary */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-sm">
          <div>
            <h2 className="font-extrabold text-lg">{pkg.name}</h2>
            <p className="text-xs text-emerald-400 font-semibold">
              Reward Rate: KSh {pkg.ratePerView.toFixed(2)} / view
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">KSh {pkg.price}</span>
            <span className="block text-[10px] text-slate-400">Activation Fee</span>
          </div>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-extrabold text-lg text-emerald-900">M-Pesa SMS Proof Submitted!</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your M-Pesa payment proof has been submitted for admin verification. Once verified, daily product campaigns will become accessible.
            </p>
            <button
              onClick={() => router.push('/campaign')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow"
            >
              Go to Campaign Page
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: M-Pesa Payment Instructions & Copy Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 space-y-4 text-xs text-sky-950">
              <h3 className="font-bold text-sky-900 text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-600" /> M-Pesa Payment Instructions:
              </h3>
              
              <ol className="list-decimal list-inside space-y-2 leading-relaxed text-slate-700">
                <li>Copy the official M-Pesa recipient phone number below:</li>
              </ol>

              {/* Copyable M-Pesa Number Box */}
              <div className="bg-white border border-sky-300 p-3 rounded-xl flex items-center justify-between shadow-sm">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">M-Pesa Recipient Number</span>
                  <p className="font-mono text-base font-black text-slate-900">{mpesaNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                >
                  {copiedNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Number
                    </>
                  )}
                </button>
              </div>

              <ol start={2} className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-700">
                <li>Go to your phone M-Pesa SIM Toolkit / M-Pesa App.</li>
                <li>Select <strong>Send Money</strong> &gt; Enter Phone Number: <strong className="font-mono text-slate-900">{mpesaNumber}</strong>.</li>
                <li>Enter Amount: <strong className="text-slate-900">KSh {pkg.price}</strong> and enter your PIN.</li>
                <li>After completing payment, copy the full M-Pesa SMS message received and paste it below.</li>
              </ol>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 2: M-Pesa SMS Confirmation Message Paste Box */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paste M-Pesa SMS Confirmation Message Proof
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. QK87123456 Confirmed. Ksh500.00 sent to 0734570672 on 9/9/26 at 11:15 AM..."
                  value={mpesaMessage}
                  onChange={(e) => setMpesaMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-sm transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting SMS Proof...' : 'Submit M-Pesa SMS Proof'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
