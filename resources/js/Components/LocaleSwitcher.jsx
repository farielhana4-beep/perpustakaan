import { router, usePage } from '@inertiajs/react'
import { useEffect, useMemo, useRef, useState } from 'react'

const FALLBACK_LOCALES = ['id', 'en']

const LOCALE_META = {
  id: { label: 'Indonesia', icon: '🇮🇩' },
  en: { label: 'English', icon: '🇺🇸' },
}

function normalizeLocale(value) {
  return typeof value === 'string'
    ? value
    : typeof value?.code === 'string'
      ? value.code
      : 'id'
}

function normalizeLocaleOption(value) {
  const normalizedLocale = normalizeLocale(value)
  const meta = LOCALE_META[normalizedLocale] ?? {}

  return {
    value: normalizedLocale,
    label: typeof meta.label === 'string' ? meta.label : normalizedLocale.toUpperCase(),
    icon: typeof meta.icon === 'string' ? meta.icon : '🌐',
  }
}

export default function LocaleSwitcher({ className = '' }) {
  const { locale: localeValue = 'id', t = {}, locales: localesValue = FALLBACK_LOCALES } = usePage().props
  const normalizedLocale = normalizeLocale(localeValue)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const localeOptions = useMemo(() => {
    if (!Array.isArray(localesValue) || localesValue.length === 0) {
      return FALLBACK_LOCALES.map((value) => normalizeLocaleOption(value))
    }

    return localesValue.map((value) => {
      if (typeof value === 'string') {
        return normalizeLocaleOption(value)
      }

      if (typeof value === 'object' && value !== null) {
        const optionValue = normalizeLocale(value)
        const optionLabel = typeof value.label === 'string'
          ? value.label
          : optionValue.toUpperCase()

        return {
          value: optionValue,
          label: optionLabel,
        }
      }

      return normalizeLocaleOption(value)
    })
  }, [localesValue])
  const currentOption = localeOptions.find((option) => option.value === normalizedLocale) ?? normalizeLocaleOption(normalizedLocale)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedLocale = normalizeLocale(window.localStorage.getItem('locale'))

    if (storedLocale !== normalizedLocale && localeOptions.some((option) => option.value === storedLocale)) {
      router.post(
        '/locale',
        { locale: storedLocale },
        {
          preserveScroll: true,
          preserveState: false,
        },
      )
      return
    }

    window.localStorage.setItem('locale', normalizedLocale)
  }, [localeOptions, normalizedLocale])

  useEffect(() => {
    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const handleSelect = (rawLocale) => {
    const nextLocale = normalizeLocale(rawLocale)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', nextLocale)
    }

    router.post(
      '/locale',
      { locale: nextLocale },
        {
          preserveScroll: true,
          preserveState: false,
        },
      )
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t?.profile?.language ?? 'Language'}
        className="flex w-full items-center justify-between gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none">{currentOption.icon}</span>
          <span className="hidden sm:inline">{currentOption.label}</span>
          <span className="sm:hidden">{normalizedLocale.toUpperCase()}</span>
        </span>
        <span className={`text-xs text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>

      <div
        className={[
          'absolute right-0 z-40 mt-2 w-44 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition-all duration-200',
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
        ].join(' ')}
      >
        {localeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setOpen(false)
              handleSelect(option.value)
            }}
            className={[
              'flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition hover:bg-slate-50',
              option.value === normalizedLocale ? 'bg-sky-50 text-sky-700' : 'text-slate-700',
            ].join(' ')}
          >
            <span className="text-base leading-none">{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
