import { Head, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/AdminLayout'

export default function Index({ settings, currencies }) {
  const { flash = {} } = usePage().props
  const { data, setData, put, processing, errors } = useForm({
    fine_per_day: settings?.fine_per_day ?? 1000,
    max_borrow_days: settings?.max_borrow_days ?? 7,
    currency: settings?.currency ?? 'IDR',
    max_books_per_user: settings?.max_books_per_user ?? 3,
  })

  const submit = (e) => {
    e.preventDefault()
    put('/admin/settings')
  }

  return (
    <AdminLayout>
      <Head title="Settings" />
      <div className="mx-auto max-w-3xl space-y-6">
        {flash.success && <Banner tone="success">{flash.success}</Banner>}
        {flash.error && <Banner tone="error">{flash.error}</Banner>}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Settings</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Library Settings</h1>
          <p className="mt-2 text-sm text-slate-600">Configure borrow rules, fine, and display currency.</p>
        </section>

        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5">
            <Field label="Fine per day" error={errors.fine_per_day}>
              <input
                className="input"
                type="number"
                min="0"
                value={data.fine_per_day}
                onChange={(e) => setData('fine_per_day', e.target.value)}
              />
            </Field>
            <Field label="Max borrow days" error={errors.max_borrow_days}>
              <input
                className="input"
                type="number"
                min="1"
                value={data.max_borrow_days}
                onChange={(e) => setData('max_borrow_days', e.target.value)}
              />
            </Field>
            <Field label="Currency" error={errors.currency}>
              <select className="input" value={data.currency} onChange={(e) => setData('currency', e.target.value)}>
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Max books per user" error={errors.max_books_per_user}>
              <input
                className="input"
                type="number"
                min="1"
                value={data.max_books_per_user}
                onChange={(e) => setData('max_books_per_user', e.target.value)}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="mt-6 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.9rem;padding:0.8rem 1rem;outline:none;transition:all .15s ease;background:white}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </AdminLayout>
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

function Banner({ tone, children }) {
  const styles =
    tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-700'

  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${styles}`}>{children}</div>
}
