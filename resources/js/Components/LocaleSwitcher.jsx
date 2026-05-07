import { router, usePage } from '@inertiajs/react'
import { useEffect, useMemo } from 'react'

const FALLBACK_LOCALES = ['id', 'en']

function normalizeLocale(value) {
  return typeof value === 'string'
    ? value
    : typeof value?.code === 'string'
      ? value.code
      : 'id'
}

function normalizeLocaleOption(value) {
  const normalizedLocale = normalizeLocale(value)

  return {
    value: normalizedLocale,
    label: normalizedLocale.toUpperCase(),
  }
}

export default function LocaleSwitcher({ className = '' }) {
  const { locale: localeValue = 'id', t = {}, locales: localesValue = FALLBACK_LOCALES } = usePage().props
  const normalizedLocale = normalizeLocale(localeValue)
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

  const handleChange = (event) => {
    const nextLocale = normalizeLocale(event?.target?.value)

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
    <select
      aria-label={t?.profile?.language ?? 'Language'}
      value={normalizedLocale}
      onChange={handleChange}
      className={className}
    >
      {localeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
