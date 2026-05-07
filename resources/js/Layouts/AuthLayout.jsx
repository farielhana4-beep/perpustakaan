import { usePage } from '@inertiajs/react'
import BrandMark from '../Components/BrandMark'
import BrandSync from '../Components/BrandSync'
import FlashAlert from '../Components/FlashAlert'
import LocaleSwitcher from '../Components/LocaleSwitcher'

export default function AuthLayout({ children }) {
  const { flash = {} } = usePage().props

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e2e8f0_0%,_#f8fafc_45%,_#ffffff_100%)] px-4 py-10">
      <BrandSync />
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
          <div className="flex items-center justify-between gap-4">
            <BrandMark compact />
            <LocaleSwitcher className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold tracking-[0.2em] text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
          </div>

          <div className="mt-5">
            <FlashAlert tone="success" message={flash.success} />
            <FlashAlert tone="error" message={flash.error} />
            <FlashAlert tone="warning" message={flash.status} />
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
