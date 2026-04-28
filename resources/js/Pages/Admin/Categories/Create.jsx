import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/AdminLayout'

export default function Create() {
  const { flash = {} } = usePage().props
  const { data, setData, post, processing, errors } = useForm({ name: '', slug: '', description: '' })

  const submit = (e) => {
    e.preventDefault()
    post('/admin/categories')
  }

  return (
    <AdminLayout>
      <Head title="Add Category" />
      <SimpleForm title="Add Category" href="/admin/categories" buttonLabel="Save Category" onSubmit={submit} processing={processing} flash={flash} errors={errors} data={data} setData={setData} />
    </AdminLayout>
  )
}

function SimpleForm({ title, href, buttonLabel, onSubmit, processing, flash, errors, data, setData }) {
  return (
    <div className="mx-auto max-w-2xl">
      {flash.success && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{flash.success}</div>}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Categories</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        </div>
        <Link href={href} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">Back</Link>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Name" error={errors.name}>
          <input className="input" value={data.name} onChange={(e) => setData('name', e.target.value)} />
        </Field>
        <Field label="Slug" error={errors.slug}>
          <input className="input" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea className="input min-h-28" value={data.description} onChange={(e) => setData('description', e.target.value)} />
        </Field>
        <button type="submit" disabled={processing} className="mt-6 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60">{processing ? 'Saving...' : buttonLabel}</button>
      </form>
      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
