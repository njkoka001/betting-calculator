'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied Text!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" /> Copy Promo Text
        </>
      )}
    </button>
  )
}
