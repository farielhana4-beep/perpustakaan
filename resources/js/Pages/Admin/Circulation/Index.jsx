import { Head, router, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/AdminLayout'
import StatusBadge from '../../../Components/StatusBadge'
import { formatCurrency } from '../../../Support/currency'

export default function Index({ books, members, borrowings, filters, statusOptions, summary, settings }) {
  const { flash = {} } = usePage().props
  const form = useForm({
    user_id: '',
    book_id: '',
    quantity: 1,
  })
  const currentStatus = filters?.status ?? ''
  const currency = settings?.currency ?? 'IDR'
  const selectedBook = books.find((book) => String(book.id) === String(form.data.book_id))
  const maxQuantity = selectedBook?.stock ?? 1

  const submit = (e) => {
    e.preventDefault()
    form.post('/admin/borrowings')
  }

  const applyStatus = (status) => {
    router.get('/admin/circulation', { status }, { preserveState: true, replace: true })
  }

  return (
    <AdminLayout>
      <Head title="Circulation" />
      <div className="mx-auto max-w-7xl space-y-6">
        <FlashBanner tone="success" message={flash.success} />
        <FlashBanner tone="error" message={flash.error} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat label="Borrowed" value={summary?.borrowed ?? 0} />
          <Stat label="Overdue" value={summary?.overdue ?? 0} />
          <Stat label="Returned" value={summary?.returned ?? 0} />
          <Stat label="Lost" value={summary?.lost ?? 0} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Circulation</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">Borrow Books</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Max {settings?.max_books_per_user ?? 3} active books per user, due in {settings?.max_borrow_days ?? 7} days.
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <Field label="Member">
                <select
                  className="input"
                  value={form.data.user_id}
                  onChange={(e) => form.setData('user_id', e.target.value)}
                >
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                {form.errors.user_id && <p className="mt-2 text-sm text-red-600">{form.errors.user_id}</p>}
              </Field>
              <Field label="Book">
                <select
                  className="input"
                  value={form.data.book_id}
                  onChange={(e) => {
                    form.setData('book_id', e.target.value)
                    form.setData('quantity', 1)
                  }}
                >
                  <option value="">Select book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.stock})
                    </option>
                  ))}
                </select>
                {form.errors.book_id && <p className="mt-2 text-sm text-red-600">{form.errors.book_id}</p>}
              </Field>
              <Field label="Quantity">
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={form.data.quantity}
                  onChange={(e) => form.setData('quantity', e.target.value)}
                  className="input"
                />
                <p className="mt-2 text-xs text-slate-500">Max available stock: {selectedBook?.stock ?? '-'}</p>
                {form.errors.quantity && <p className="mt-2 text-sm text-red-600">{form.errors.quantity}</p>}
              </Field>
              <button
                disabled={form.processing}
                className="inline-flex w-fit items-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {form.processing ? 'Saving...' : 'Borrow Book'}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Filter</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Borrowing Status</h2>
              </div>
              <select
                value={currentStatus}
                onChange={(e) => applyStatus(e.target.value)}
                className="input max-w-48"
              >
                {statusOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 space-y-3">
              {borrowings.length === 0 ? (
                <EmptyState title="No circulation records" description="Borrowed books will appear here." />
              ) : (
                borrowings.map((item) => (
                  <BorrowingCard key={item.id} item={item} currency={currency} />
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.9rem;padding:0.8rem 1rem;outline:none;transition:all .15s ease;background:white}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </AdminLayout>
  )
}

function BorrowingCard({ item, currency }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-900">{item.book?.title}</p>
          <p className="mt-1 text-sm text-slate-600">{item.user?.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Qty {item.quantity}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={item.status} />
          </div>
        </div>
        <div className="text-right text-sm text-slate-600">
          <p>Borrowed: {formatDate(item.borrowed_at)}</p>
          <p>Due: {formatDate(item.due_date)}</p>
          <p>Returned: {item.returned_at ? formatDate(item.returned_at) : '-'}</p>
          <p className="font-medium text-slate-900">Fine: {formatCurrency(item.fine_amount, currency)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {(item.status === 'borrowed' || item.status === 'overdue') && (
          <>
            <button
              type="button"
              onClick={() => router.post(`/admin/borrowings/${item.id}/return`)}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
              Return
            </button>
            <button
              type="button"
              onClick={() => router.post(`/admin/borrowings/${item.id}/lost`)}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Mark Lost
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function FlashBanner({ tone, message }) {
  if (!message) {
    return null
  }

  const styles =
    tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-700'

  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${styles}`}>{message}</div>
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  )
}

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
