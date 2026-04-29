import { useState } from 'react'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import MemberLayout from '../../../Layouts/MemberLayout'

export default function Index({ books, categories, filters }) {
  const { flash = {} } = usePage().props
  const form = useForm({ search: filters.search ?? '', category: filters.category ?? '' })
  const [selectedBook, setSelectedBook] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const submit = (e) => {
    e.preventDefault()
    router.get('/member/catalog', form.data, { preserveState: true, replace: true })
  }

  const borrowOne = (book) => {
    router.post('/member/borrowings', { book_id: book.id, quantity: 1 }, { preserveScroll: true })
  }

  const openQuantityModal = (book) => {
    setSelectedBook(book)
    setQuantity(1)
  }

  const closeQuantityModal = () => {
    setSelectedBook(null)
  }

  const borrowMany = () => {
    if (!selectedBook) {
      return
    }

    router.post(
      '/member/borrowings',
      {
        book_id: selectedBook.id,
        quantity: Number(quantity) || 1,
      },
      {
        preserveScroll: true,
        onSuccess: closeQuantityModal,
      },
    )
  }

  return (
    <MemberLayout>
      <Head title="Catalog" />
      <div className="mx-auto max-w-7xl space-y-6">
        {flash.success && <Banner tone="success">{flash.success}</Banner>}
        {flash.error && <Banner tone="error">{flash.error}</Banner>}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
            <button className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
              Filter
            </button>
          </form>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm md:col-span-2 xl:col-span-3">
              <p className="font-semibold text-slate-900">No books found</p>
              <p className="mt-2 text-sm text-slate-500">Try changing your search or category filter.</p>
            </div>
          ) : (
            books.map((book) => (
              <article
                key={book.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href={`/member/catalog/${book.id}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                    {book.image_url ? (
                      <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                        No cover
                      </div>
                    )}
                  </div>
                </Link>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                      {book.category?.name ?? 'Uncategorized'}
                    </p>
                    <Link href={`/member/catalog/${book.id}`} className="mt-2 block">
                      <h2 className="text-xl font-bold text-slate-900">{book.title}</h2>
                    </Link>
                    <p className="mt-2 text-sm text-slate-600">{book.author}</p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">Stock</span>
                    <span className="font-semibold text-slate-900">{book.stock}</span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => borrowOne(book)}
                      disabled={book.stock <= 0}
                      className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Pinjam 1
                    </button>
                    <button
                      type="button"
                      onClick={() => openQuantityModal(book)}
                      disabled={book.stock <= 0}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      Pinjam Banyak
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {selectedBook && (
        <BorrowModal
          book={selectedBook}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={closeQuantityModal}
          onSubmit={borrowMany}
        />
      )}

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.12)}`}</style>
    </MemberLayout>
  )
}

function BorrowModal({ book, quantity, setQuantity, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">Pinjam Banyak</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{book.title}</h2>
            <p className="mt-1 text-sm text-slate-600">Stock tersedia: {book.stock}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Quantity</label>
          <input
            type="number"
            min="1"
            max={book.stock}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Borrow
          </button>
        </div>
      </div>
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
