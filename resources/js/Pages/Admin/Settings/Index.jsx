import { Head, useForm, usePage } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../../Layouts/AdminLayout'

const TABS = ['branding', 'borrowing_rules', 'localization']
const FALLBACK_LOCALES = [
  { value: 'id', label: 'ID' },
  { value: 'en', label: 'EN' },
]

export default function Index({ settings, currencies, locales }) {
  const { t = {} } = usePage().props
  const [activeTab, setActiveTab] = useState('branding')
  const safeSettings = settings ?? {}
  const safeCurrencies = Array.isArray(currencies) && currencies.length > 0 ? currencies : ['IDR']
  const safeLocales = useMemo(() => {
    if (!Array.isArray(locales) || locales.length === 0) {
      return FALLBACK_LOCALES
    }

    return locales
      .map((locale) => {
        if (typeof locale === 'string') {
          return { value: locale, label: locale.toUpperCase() }
        }

        if (typeof locale === 'object' && locale !== null) {
          const value = typeof locale.value === 'string'
            ? locale.value
            : typeof locale.code === 'string'
              ? locale.code
              : null

          if (!value) {
            return null
          }

          return {
            value,
            label: typeof locale.label === 'string' ? locale.label : value.toUpperCase(),
          }
        }

        return null
      })
      .filter(Boolean)
  }, [locales])

  const { data, setData, put, processing, errors } = useForm({
    library_name: safeSettings?.library_name ?? '',
    default_locale: typeof safeSettings?.default_locale === 'string' ? safeSettings.default_locale : 'id',
    fine_per_day: safeSettings?.fine_per_day ?? 1000,
    max_borrow_days: safeSettings?.max_borrow_days ?? 7,
    currency: safeSettings?.currency ?? 'IDR',
    max_books_per_user: safeSettings?.max_books_per_user ?? 3,
    library_logo: null,
    library_favicon: null,
  })

  const logoPreview = useObjectUrl(data.library_logo, safeSettings?.library_logo_url)
  const faviconPreview = useObjectUrl(data.library_favicon, safeSettings?.library_favicon_url)

  const brandTitle = data.library_name || safeSettings?.library_name || t?.common?.library_system || t?.common?.library_portal || 'Library'

  const submit = (event) => {
    event.preventDefault()
    put('/admin/settings', { preserveScroll: true })
  }

  return (
    <AdminLayout>
      <Head title={t?.settings?.title} />

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">{t?.settings?.title}</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">{t?.settings?.library_settings}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{t?.settings?.branding_hint}</p>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-8 lg:border-l lg:border-t-0">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{t?.settings?.branding}</p>
                <div className="mt-4 flex items-center gap-4">
                  {logoPreview ? (
                    <img src={logoPreview} alt={brandTitle} className="h-16 w-16 rounded-2xl object-contain ring-1 ring-slate-200" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                      {brandTitle?.charAt(0)?.toUpperCase() || 'L'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{brandTitle}</p>
                    <p className="text-xs text-slate-500">{t?.settings?.library_name_hint}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <MiniStat label={t?.settings?.logo ?? 'Logo'} value={safeSettings?.library_logo ? t?.settings?.upload_logo : t?.empty?.no_data ?? '-'} />
                  <MiniStat label={t?.settings?.favicon ?? 'Favicon'} value={safeSettings?.library_favicon ? t?.settings?.upload_favicon : t?.empty?.no_data ?? '-'} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={submit} className="space-y-6">
          <div className="flex flex-wrap gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  activeTab === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {t?.settings?.[tab] ?? tab}
              </button>
            ))}
          </div>

          {activeTab === 'branding' && (
            <section className="grid gap-6 xl:grid-cols-2">
              <Panel title={t?.settings?.branding} description={t?.settings?.branding_hint}>
                <Field label={t?.settings?.library_name} error={errors.library_name}>
                  <input className="input" value={data.library_name} onChange={(event) => setData('library_name', event.target.value)} placeholder={t?.settings?.library_name_hint} />
                </Field>

                <Field label={t?.settings?.logo} error={errors.library_logo}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(event) => setData('library_logo', event.target.files?.[0] ?? null)}
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </Field>

                <Field label={t?.settings?.favicon} error={errors.library_favicon}>
                  <input
                    type="file"
                    accept="image/x-icon,image/png,image/svg+xml"
                    onChange={(event) => setData('library_favicon', event.target.files?.[0] ?? null)}
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </Field>
              </Panel>

              <Panel title={t?.settings?.branding} description={t?.settings?.logo_hint}>
                <UploadPreview label={t?.settings?.logo} preview={logoPreview} hint={t?.settings?.logo_hint} />
                <UploadPreview label={t?.settings?.favicon} preview={faviconPreview} hint={t?.settings?.favicon_hint} compact />
              </Panel>
            </section>
          )}

          {activeTab === 'borrowing_rules' && (
            <section className="grid gap-6 xl:grid-cols-2">
              <Panel title={t?.settings?.borrowing_rules} description={t?.settings?.configure_rules}>
                <Field label={t?.form?.fine_per_day} error={errors.fine_per_day}>
                  <input className="input" type="number" min="0" value={data.fine_per_day} onChange={(event) => setData('fine_per_day', event.target.value)} />
                </Field>

                <Field label={t?.form?.max_borrow_days} error={errors.max_borrow_days}>
                  <input className="input" type="number" min="1" value={data.max_borrow_days} onChange={(event) => setData('max_borrow_days', event.target.value)} />
                </Field>

                <Field label={t?.form?.max_books_per_user} error={errors.max_books_per_user}>
                  <input className="input" type="number" min="1" value={data.max_books_per_user} onChange={(event) => setData('max_books_per_user', event.target.value)} />
                </Field>
              </Panel>

              <Panel title={t?.settings?.currency} description={t?.settings?.configure_rules}>
                <Field label={t?.form?.currency} error={errors.currency}>
                  <select className="input" value={data.currency} onChange={(event) => setData('currency', event.target.value)}>
                    {safeCurrencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">{t?.settings?.borrowing_rules}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t?.circulation?.max_active_books
                      ?.replace('{books}', data.max_books_per_user ?? 3)
                      ?.replace('{days}', data.max_borrow_days ?? 7)}
                  </p>
                </div>
              </Panel>
            </section>
          )}

          {activeTab === 'localization' && (
            <section className="grid gap-6 xl:grid-cols-2">
              <Panel title={t?.settings?.localization} description={t?.settings?.library_name_hint}>
                <Field label={t?.settings?.default_locale} error={errors.default_locale}>
                  <select className="input" value={data.default_locale} onChange={(event) => setData('default_locale', event.target.value)}>
                    {safeLocales.map((locale) => (
                      <option key={locale.value} value={locale.value}>
                        {locale.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">{t?.settings?.library_name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t?.settings?.library_name_hint}</p>
                </div>
              </Panel>

              <Panel title={t?.settings?.localization} description={t?.settings?.library_name_hint}>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">{t?.locale?.english}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t?.locale?.indonesian}</p>
                </div>
              </Panel>
            </section>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? t?.common?.saving : t?.settings?.save_button}
            </button>
          </div>
        </form>
      </div>

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:1rem;padding:0.85rem 1rem;outline:none;transition:all .15s ease;background:white}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </AdminLayout>
  )
}

function useObjectUrl(file, fallback) {
  const [preview, setPreview] = useState(fallback ?? null)

  useEffect(() => {
    if (!file) {
      setPreview(fallback ?? null)
      return undefined
    }

    const nextUrl = URL.createObjectURL(file)
    setPreview(nextUrl)

    return () => URL.revokeObjectURL(nextUrl)
  }, [file, fallback])

  return preview
}

function Panel({ title, description, children }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function UploadPreview({ label, preview, hint, compact = false }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${compact ? 'mt-4' : ''}`}>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-4 flex items-center gap-4">
        {preview ? (
          <img src={preview} alt={label} className={compact ? 'h-12 w-12 rounded-xl object-contain' : 'h-20 w-20 rounded-2xl object-contain'} />
        ) : (
          <div className={compact ? 'flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white' : 'flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white'}>
            {label?.charAt(0)?.toUpperCase() || 'L'}
          </div>
        )}
        <p className="text-sm leading-6 text-slate-500">{hint}</p>
      </div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}
