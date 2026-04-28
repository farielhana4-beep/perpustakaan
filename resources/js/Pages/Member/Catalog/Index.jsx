import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import MemberLayout from '../../../Layouts/MemberLayout'

export default function Index({ books, categories, filters }) {
  const { flash = {} } = usePage().props
  const form = useForm({ search: filters.search ?? '', category: filters.category ?? '' })

  const submit = (e) => {
    e.preventDefault()
    router.get('/member/catalog', form.data, { preserveState: true, replace: true })
  }

  return (
    <MemberLayout>
      <Head title="Catalog" />
      <div className="mx-auto max-w-7xl space-y-6">
        {flash.success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{flash.success}</div>}
        {flash.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{flash.error}</div>}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Book Catalog</h1>
          <form onSubmit={submit} className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <input
              className="input"
              placeholder="Search title, author, ISBN"
              value={form.data.search}
              onChange={(e) => form.setData('search', e.target.value)}
            />
            <select className="input" value={form.data.category} onChange={(e) => form.setData('category', e.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Filter
            </button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm md:col-span-2 xl:col-span-3">
              <p className="font-semibold text-slate-900">No books found</p>
              <p className="mt-2 text-sm text-slate-500">Try changing your search or category filter.</p>
            </div>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href={`/member/catalog/${book.id}`} className="block">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                    {book.category?.name ?? 'Uncategorized'}
                  </p>
                  <h2 className="mt-3 text-xl font-bold text-slate-900">{book.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{book.author}</p>
                </Link>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Stock</span>
                  <span className="font-semibold text-slate-900">{book.stock}</span>
                </div>
                <button
                  type="button"
                  onClick={() => router.post('/member/borrowings', { book_id: book.id })}
                  disabled={book.stock <= 0}
                  className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
                >
                  {book.stock > 0 ? 'Borrow' : 'Unavailable'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.12)}`}</style>
    </MemberLayout>
  )
}
