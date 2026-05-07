import { usePage } from '@inertiajs/react'
import { useEffect } from 'react'

function normalizeLocale(value) {
  return typeof value === 'string'
    ? value
    : typeof value?.code === 'string'
      ? value.code
      : 'id'
}

export default function BrandSync() {
  const { settings = {}, t = {}, app = {}, locale: localeValue = 'id' } = usePage().props
  const normalizedLocale = normalizeLocale(app?.locale ?? localeValue)

  useEffect(() => {
    const title = settings?.library_name || t?.common?.library_system || document.title
    document.title = title

    const head = document.head
    let icon = head.querySelector('link[data-dynamic-favicon="true"]')

    if (!icon) {
      icon = document.createElement('link')
      icon.setAttribute('rel', 'icon')
      icon.setAttribute('data-dynamic-favicon', 'true')
      head.appendChild(icon)
    }

    icon.setAttribute('type', 'image/png')
    icon.setAttribute('href', settings?.library_favicon_url || '/favicon.ico')

    document.documentElement.lang = normalizedLocale === 'id' ? 'id' : 'en'
  }, [settings?.library_name, settings?.library_favicon_url, t?.common?.library_system, normalizedLocale])

  return null
}
