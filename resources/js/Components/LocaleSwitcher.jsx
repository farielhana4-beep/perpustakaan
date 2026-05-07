import { router, usePage } from '@inertiajs/react'
import { useEffect } from 'react'

export default function LocaleSwitcher({ className = '' }) {
  const { locale = 'id', t = {}, locales = ['id', 'en'] } = usePage().props

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedLocale = window.localStorage.getItem('locale')

    if (storedLocale && locales.includes(storedLocale) && storedLocale !== locale) {
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

    window.localStorage.setItem('locale', locale)
  }, [locale, locales])

  const handleChange = (event) => {
    const nextLocale = event.target.value

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
      value={locale}
      onChange={handleChange}
      className={className}
    >
      {locales.map((value) => (
        <option key={value} value={value}>
          {value.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
