import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/AdminLayout'

export default function Create({ categories }) {
  const { flash = {} } = usePage().props
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    author: '',
    isbn: '',
    stock: '',
    category_id: '',
    image: null,
  })

  const submit = (e) => {
    e.preventDefault()
    post('/admin/books', { forceFormData: true })
  }

  return (
    <AdminLayout>
      <Head title="Add Book" />

      <div className="mx-auto max-w-3xl">
        {flash.success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {flash.success}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Books</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Add Book</h1>
          </div>

          <Link
            href="/admin/books"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back
          </Link>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5">
            <Field label="Title" error={errors.title}>
              <input value={data.title} onChange={(e) => setData('title', e.target.value)} className="input" />
            </Field>

            <Field label="Author" error={errors.author}>
              <input value={data.author} onChange={(e) => setData('author', e.target.value)} className="input" />
            </Field>

            <Field label="ISBN" error={errors.isbn}>
              <input value={data.isbn} onChange={(e) => setData('isbn', e.target.value)} className="input" />
            </Field>

            <Field label="Category" error={errors.category_id}>
              <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="input">
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Stock" error={errors.stock}>
              <input
                type="number"
                min="0"
                value={data.stock}
                onChange={(e) => setData('stock', e.target.value)}
                className="input"
              />
            </Field>

            <Field label="Cover Image" error={errors.image}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                className="input"
              />
              <p className="mt-2 text-xs text-slate-500">Optional. Stored in `storage/app/public/books`.</p>
            </Field>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={processing}
              className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? 'Saving...' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
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
