import { useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import MemberLayout from '../../../Layouts/MemberLayout'

export default function Show({ book }) {
  const { flash = {} } = usePage().props
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)

  const borrowOne = () => {
    router.post('/member/borrowings', { book_id: book.id, quantity: 1 }, { preserveScroll: true })
  }

  const submitMany = () => {
    router.post(
      '/member/borrowings',
      {
        book_id: book.id,
        quantity: Number(quantity) || 1,
      },
      {
        preserveScroll: true,
        onSuccess: () => setOpen(false),
      },
    )
  }

  return (
    <MemberLayout>
      <Head title={book.title} />
      <div className="mx-auto max-w-5xl space-y-6">
        {flash.success && <Banner tone="success">{flash.success}</Banner>}
        {flash.error && <Banner tone="error">{flash.error}</Banner>}

        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[320px_1fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {book.image_url ? (
              <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                No cover
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              {book.category?.name ?? 'Uncategorized'}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">{book.title}</h1>
            <p className="mt-3 text-slate-600">By {book.author}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Meta label="ISBN" value={book.isbn ?? '-'} />
              <Meta label="Stock" value={book.stock} />
              <Meta label="Availability" value={book.stock > 0 ? 'Available' : 'Unavailable'} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={borrowOne}
                disabled={book.stock <= 0}
                className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Pinjam 1
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={book.stock <= 0}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                Pinjam Banyak
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
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
                onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitMany}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Borrow
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.12)}`}</style>
    </MemberLayout>
  )
}

function Meta({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
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
