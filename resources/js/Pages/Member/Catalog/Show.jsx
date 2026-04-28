import { Head, router, usePage } from '@inertiajs/react'
import MemberLayout from '../../../Layouts/MemberLayout'

export default function Show({ book }) {
  const { flash = {} } = usePage().props

  const borrow = () => {
    router.post('/member/borrowings', { book_id: book.id })
  }

  return (
    <MemberLayout>
      <Head title={book.title} />
      <div className="mx-auto max-w-4xl space-y-6">
        {flash.success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{flash.success}</div>}
        {flash.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{flash.error}</div>}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
          <button
            onClick={borrow}
            disabled={book.stock <= 0}
            className="mt-8 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
          >
            {book.stock > 0 ? 'Borrow Book' : 'Unavailable'}
          </button>
        </div>
      </div>
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
