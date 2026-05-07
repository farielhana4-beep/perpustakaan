import { usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const TONES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
}

export default function FlashAlert({ tone = 'success', message }) {
  const { t = {} } = usePage().props
  const [open, setOpen] = useState(Boolean(message))

  useEffect(() => {
    setOpen(Boolean(message))

    if (!message) {
      return
    }

    const timeout = window.setTimeout(() => setOpen(false), 4500)
    return () => window.clearTimeout(timeout)
  }, [message])

  if (!message || !open) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg shadow-slate-950/5 backdrop-blur transition-all ${TONES[tone]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="leading-6">{message}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t?.buttons?.close}
          className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] opacity-70 transition hover:bg-white/60 hover:opacity-100"
        >
          x
        </button>
      </div>
    </div>
  )
}
