import { Head, router, useForm, usePage } from '@inertiajs/react'
import { CardSkeleton, EmptyState } from '../../../Components/DataStates'
import FilterToolbar from '../../../Components/FilterToolbar'
import BorrowingReturnModal from '../../../Components/BorrowingReturnModal'
import Pagination from '../../../Components/Pagination'
import StatusBadge from '../../../Components/StatusBadge'
import useIndexFilters from '../../../Hooks/useIndexFilters'
import AdminLayout from '../../../Layouts/AdminLayout'
import { formatCurrency } from '../../../Support/currency'
import { useState } from 'react'

const defaultFilters = {
  search: '',
  status: '',
  date: '',
  sort: 'latest',
}

export default function Index(props) {
  const { flash = {} } = usePage().props
  const {
    books = [],
    members = [],
    borrowings = { data: [] },
    filters = {},
    statusOptions = [],
    summary = {},
    settings = {},
  } = props ?? {}
  const safeBooks = books ?? []
  const safeMembers = members ?? []
  const safeBorrowings = borrowings ?? { data: [], links: [] }
  const safeStatusOptions = statusOptions ?? []
  const borrowingsData = safeBorrowings?.data ?? []
  const [returningBorrowing, setReturningBorrowing] = useState(null)
  const [returnQuantity, setReturnQuantity] = useState(1)

  const form = useForm({
    user_id: '',
    book_id: '',
    quantity: 1,
  })
  const {
    data: filterData,
    setData: setFilterData,
    applyFilters,
    resetFilters,
    isLoading,
  } = useIndexFilters({
    url: '/admin/circulation',
    defaults: defaultFilters,
    filters,
  })
  if (!safeBorrowings || !safeBorrowings.data) {
    return <div>Loading...</div>
  }

  const currency = settings?.currency ?? 'IDR'
  const selectedBook = safeBooks.find((book) => String(book.id) === String(form.data.book_id))
  const maxQuantity = selectedBook?.stock ?? 1

  const openReturnModal = (item) => {
    setReturningBorrowing(item)
    setReturnQuantity(Math.max(1, Number(item.remaining ?? item.quantity - (item.returned_quantity ?? 0)) || 1))
  }

  const closeReturnModal = () => {
    setReturningBorrowing(null)
    setReturnQuantity(1)
  }

  const submitPartialReturn = () => {
    if (!returningBorrowing) {
      return
    }

    router.post(
      `/admin/borrowings/${returningBorrowing.id}/return`,
      { quantity: Number(returnQuantity) || 1 },
      {
        preserveScroll: true,
        onSuccess: closeReturnModal,
      },
    )
  }

  const submitReturnAll = () => {
    if (!returningBorrowing) {
      return
    }

    router.post(`/admin/borrowings/${returningBorrowing.id}/return-all`, {}, { preserveScroll: true, onSuccess: closeReturnModal })
  }

  const submit = (e) => {
    e.preventDefault()
    form.post('/admin/borrowings')
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
                  {safeMembers.map((member) => (
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
                  {safeBooks.map((book) => (
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
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Records</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">Circulation History</h2>
                  {isLoading && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Updating...</span>}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <FilterToolbar
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => applyFilters()}
                      className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Reset
                    </button>
                  </>
                }
              >
                <input
                  placeholder="Search user or book..."
                  value={filterData.search}
                  onChange={(e) => setFilterData('search', e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:w-64"
                />

                <select
                  value={filterData.status}
                  onChange={(e) => setFilterData('status', e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                >
                  {safeStatusOptions.map((option) => (
                    <option key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setFilterData('status', 'overdue')
                    applyFilters({ ...filterData, status: 'overdue' })
                  }}
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Overdue Only
                </button>

                <input
                  type="date"
                  value={filterData.date}
                  onChange={(e) => setFilterData('date', e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />

                <select
                  value={filterData.sort}
                  onChange={(e) => setFilterData('sort', e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </FilterToolbar>
            </div>

            <div className="space-y-3">
              {isLoading && borrowingsData.length === 0 ? (
                <CardSkeleton items={4} />
              ) : borrowingsData?.length === 0 ? (
                <>
                  <EmptyState title="No circulation records found" description="Try another status, date, or keyword." />
                  <div className="py-10 text-center text-gray-400">No data found</div>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-700">{safeBorrowings.from ?? 0}</span> to{' '}
                    <span className="font-semibold text-slate-700">{safeBorrowings.to ?? 0}</span> of{' '}
                    <span className="font-semibold text-slate-700">{safeBorrowings.total ?? borrowingsData.length}</span> records
                  </div>

                  {borrowingsData?.map((item) => (
                    <BorrowingCard
                      key={item.id}
                      item={item}
                      currency={currency}
                      search={filterData.search}
                      onOpenReturnModal={openReturnModal}
                    />
                  ))}

                  <Pagination links={safeBorrowings.links ?? []} />
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      <BorrowingReturnModal
        borrowing={returningBorrowing}
        quantity={returnQuantity}
        setQuantity={setReturnQuantity}
        onClose={closeReturnModal}
        onPartialReturn={submitPartialReturn}
        onReturnAll={submitReturnAll}
      />

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.9rem;padding:0.8rem 1rem;outline:none;transition:all .15s ease;background:white}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </AdminLayout>
  )
}

function BorrowingCard({ item, currency, search, onOpenReturnModal }) {
  const remaining = item.remaining ?? item.quantity - (item.returned_quantity ?? 0)

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-900">
            <HighlightedText text={item.book?.title ?? '-'} search={search} />
          </p>
          <p className="mt-1 text-sm text-slate-600">
            <HighlightedText text={item.user?.name ?? '-'} search={search} />
          </p>
          <p className="mt-1 text-xs text-slate-500">{item.user?.email ?? '-'}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Qty {item.quantity}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Returned {item.returned_quantity ?? 0}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Remaining {remaining}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={item.status} />
            {item.status === 'overdue' && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Warning</span>}
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
              onClick={() => onOpenReturnModal(item)}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
              Return Some
            </button>
            <button
              type="button"
              onClick={() => router.post(`/admin/borrowings/${item.id}/return-all`, {}, { preserveScroll: true })}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Return All
            </button>
            <button
              type="button"
              onClick={() => router.post(`/admin/borrowings/${item.id}/lost`, {}, { preserveScroll: true })}
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

function HighlightedText({ text, search }) {
  const safeText = text ?? ''

  if (!search) {
    return safeText
  }

  const index = safeText.toLowerCase().indexOf(search.toLowerCase())

  if (index === -1) {
    return safeText
  }

  return (
    <>
      {safeText.slice(0, index)}
      <mark className="rounded bg-amber-100 px-1 text-slate-900">{safeText.slice(index, index + search.length)}</mark>
      {safeText.slice(index + search.length)}
    </>
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
