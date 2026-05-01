import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/AdminLayout'

export default function Edit({ book, categories }) {
  const { flash = {} } = usePage().props
  const { data, setData, post, processing, errors } = useForm({
    title: book.title || '',
    author: book.author || '',
    isbn: book.isbn || '',
    category_id: book.category_id || '',
    stock: book.stock || 0,
    image: null,
    _method: 'put',
  })

  const submit = (e) => {
    e.preventDefault()
    post(`/admin/books/${book.id}`, {
      forceFormData: true,
    })
  }

  return (
    <AdminLayout>
      <Head title={`Edit ${book.title}`} />

      <div className="mx-auto max-w-3xl">
        {flash.success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {flash.success}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Books</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Edit Book</h1>
          </div>

          <Link
            href="/admin/books"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back
          </Link>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[140px_1fr] md:items-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {book.image_url ? (
                <img src={book.image_url} alt={book.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm font-semibold text-slate-400">
                  No cover image
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="input"
                  name="title"
                />
                {errors.title && <div className="mt-2 text-sm text-red-500">{errors.title}</div>}
              </div>

              <div>
                <input
                  type="text"
                  value={data.author}
                  onChange={(e) => setData('author', e.target.value)}
                  className="input"
                  name="author"
                />
                {errors.author && <div className="mt-2 text-sm text-red-500">{errors.author}</div>}
              </div>

              <div>
                <input
                  type="text"
                  value={data.isbn}
                  onChange={(e) => setData('isbn', e.target.value)}
                  className="input"
                  name="isbn"
                />
                {errors.isbn && <div className="mt-2 text-sm text-red-500">{errors.isbn}</div>}
              </div>

              <div>
                <select
                  value={data.category_id}
                  onChange={(e) => setData('category_id', e.target.value)}
                  className="input"
                  name="category_id"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <div className="mt-2 text-sm text-red-500">{errors.category_id}</div>}
              </div>

              <div>
                <input
                  type="number"
                  value={data.stock}
                  onChange={(e) => setData('stock', e.target.value)}
                  className="input"
                  name="stock"
                />
                {errors.stock && <div className="mt-2 text-sm text-red-500">{errors.stock}</div>}
              </div>

              <div>
                <input
                  type="file"
                  onChange={(e) => setData('image', e.target.files[0])}
                  className="input"
                  name="image"
                />
                {errors.image && <div className="mt-2 text-sm text-red-500">{errors.image}</div>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="rounded-xl bg-sky-500 px-4 py-2 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Update Book
          </button>
        </form>
      </div>

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </AdminLayout>
  )
}
