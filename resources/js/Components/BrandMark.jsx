import { usePage } from '@inertiajs/react'

export default function BrandMark({ compact = false, className = '', dark = false }) {
  const { settings = {}, t = {} } = usePage().props
  const name = settings?.library_name || t?.common?.library_system || t?.common?.library_portal || ''
  const logoUrl = settings?.library_logo_url
  const labelClass = dark ? 'text-slate-200' : 'text-slate-400'
  const titleClass = dark ? 'text-white' : 'text-slate-900'

  if (logoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={logoUrl}
          alt={name}
          className={compact ? 'h-10 w-10 rounded-xl object-contain' : 'h-12 w-12 rounded-2xl object-contain'}
        />
        {!compact && (
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${labelClass}`}>{t?.common?.library_system}</p>
            <h1 className={`text-xl font-bold ${titleClass}`}>{name}</h1>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={compact ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white' : 'flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white'}
      >
        {name?.charAt(0)?.toUpperCase() || 'L'}
      </div>
      {!compact && (
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${labelClass}`}>{t?.common?.library_system}</p>
          <h1 className={`text-xl font-bold ${titleClass}`}>{name}</h1>
        </div>
      )}
    </div>
  )
}
