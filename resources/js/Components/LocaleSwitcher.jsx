import { router, usePage } from '@inertiajs/react'
import { useEffect, useMemo, useRef, useState } from 'react'

const FALLBACK_LOCALES = ['id', 'en']

const LANGUAGE_MAP = {
  id: {
    native: 'Bahasa Indonesia',
    translated: 'Indonesian',
    flag: '🇮🇩',
  },
  en: {
    native: 'English',
    translated: 'English',
    flag: '🇺🇸',
  },
}

function normalizeLocale(value) {
  return typeof value === 'string'
    ? value
    : typeof value?.code === 'string'
      ? value.code
      : 'id'
}

function buildOption(locale, currentLocale) {
  const normalizedLocale = normalizeLocale(locale)
  const language = LANGUAGE_MAP[normalizedLocale] ?? {
    native: normalizedLocale.toUpperCase(),
    translated: normalizedLocale.toUpperCase(),
    flag: '🌐',
  }

  return {
    value: normalizedLocale,
    label: normalizedLocale === currentLocale ? language.native : language.translated,
    flag: language.flag,
  }
}

export default function LocaleSwitcher({ className = '', locale: localeProp, availableLocales: availableLocalesProp }) {
  const page = usePage()
  const { locale: pageLocale = 'id', app = {}, locales: pageLocales = FALLBACK_LOCALES, availableLocales: pageAvailableLocales } = page.props
  const localeValue = localeProp ?? app?.locale ?? pageLocale
  const localesValue = availableLocalesProp ?? pageAvailableLocales ?? pageLocales
  const normalizedLocale = normalizeLocale(localeValue)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const localeOptions = useMemo(() => {
    const source = Array.isArray(localesValue) && localesValue.length > 0 ? localesValue : FALLBACK_LOCALES

    return source
      .map((value) => buildOption(value, normalizedLocale))
      .filter((option) => option && typeof option.value === 'string')
  }, [localesValue, normalizedLocale])

  const currentOption = localeOptions.find((option) => option.value === normalizedLocale) ?? buildOption(normalizedLocale, normalizedLocale)

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
        aria-label="Language"
        className="flex w-full items-center justify-between gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none">{currentOption.flag}</span>
          <span className="hidden sm:inline">{currentOption.label}</span>
          <span className="sm:hidden">{normalizedLocale.toUpperCase()}</span>
        </span>
        <span className={`text-xs text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>

      <div
        className={[
          'absolute right-0 z-40 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition-all duration-200',
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
            <span className="text-base leading-none">{option.flag}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
