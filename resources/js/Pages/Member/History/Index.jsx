import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { EmptyState, TableSkeleton } from '../../../Components/DataStates'
import BorrowingReturnModal from '../../../Components/BorrowingReturnModal'
import Pagination from '../../../Components/Pagination'
import useIndexFilters from '../../../Hooks/useIndexFilters'
import MemberLayout from '../../../Layouts/MemberLayout'
import StatusBadge from '../../../Components/StatusBadge'
import { formatCurrency } from '../../../Support/currency'

const defaultFilters = {
  status: '',
}

export default function Index({ borrowings, settings, filters, statusOptions }) {
  const { flash = {} } = usePage().props
  const currency = settings?.currency ?? 'IDR'
  const [returningBorrowing, setReturningBorrowing] = useState(null)
  const [returnQuantity, setReturnQuantity] = useState(1)
  const { data, setData, applyFilters, resetFilters, isLoading } = useIndexFilters({
    url: '/member/history',
    defaults: defaultFilters,
    filters,
    debounceKeys: [],
  })

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
      `/member/borrowings/${returningBorrowing.id}/return`,
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

    router.post(`/member/borrowings/${returningBorrowing.id}/return-all`, {}, { preserveScroll: true, onSuccess: closeReturnModal })
  }

  return (
    <MemberLayout>
      <Head title="Borrowing History" />
      <div className="mx-auto max-w-7xl space-y-6">
        <FlashBanner tone="success" message={flash.success} />
        <FlashBanner tone="error" message={flash.error} />

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">History</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">Borrowing History</h1>
                {isLoading && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Updating...</span>}
              </div>
              <p className="mt-2 text-sm text-slate-600">Review borrowed books, returned dates, overdue status, and fine totals.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                {statusOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => applyFilters()}
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {isLoading && borrowings.data.length === 0 ? (
          <TableSkeleton rows={6} columns={10} />
        ) : borrowings.data.length === 0 ? (
          <EmptyState title="No borrowing history yet" description="Borrowings will appear here once you start using the catalog." />
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                <p>
                  Showing <span className="font-semibold text-slate-700">{borrowings.from}</span> to{' '}
                  <span className="font-semibold text-slate-700">{borrowings.to}</span> of{' '}
                  <span className="font-semibold text-slate-700">{borrowings.total}</span> history items
                </p>
              </div>
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <Th>Book</Th>
                    <Th>Qty</Th>
                    <Th>Returned Qty</Th>
                    <Th>Remaining</Th>
                    <Th>Status</Th>
                    <Th>Borrowed</Th>
                    <Th>Due</Th>
                    <Th>Returned At</Th>
                    <Th>Fine</Th>
                    <Th align="right">Action</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {borrowings.data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <Td>{item.book?.title}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>{item.returned_quantity ?? 0}</Td>
                      <Td>{item.remaining ?? item.quantity - (item.returned_quantity ?? 0)}</Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status} />
                          {item.status === 'overdue' && <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">Warning</span>}
                        </div>
                      </Td>
                      <Td>{formatDate(item.borrowed_at)}</Td>
                      <Td>{formatDate(item.due_date)}</Td>
                      <Td>{item.returned_at ? formatDate(item.returned_at) : '-'}</Td>
                      <Td>{formatCurrency(item.fine_amount, currency)}</Td>
                      <Td align="right">
                        {(item.status === 'borrowed' || item.status === 'overdue') && (
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openReturnModal(item)}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                              Return Some
                            </button>
                            <button
                              type="button"
                              onClick={() => router.post(`/member/borrowings/${item.id}/return-all`, {}, { preserveScroll: true })}
                              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                            >
                              Return All
                            </button>
                          </div>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <Pagination links={borrowings.links} />
          </>
        )}
      </div>

      <BorrowingReturnModal
        borrowing={returningBorrowing}
        quantity={returnQuantity}
        setQuantity={setReturnQuantity}
        onClose={closeReturnModal}
        onPartialReturn={submitPartialReturn}
        onReturnAll={submitReturnAll}
      />
    </MemberLayout>
  )
}

function FlashBanner({ tone, message }) {
  if (!message) return null

  const styles =
    tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-700'

  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${styles}`}>{message}</div>
}

function Th({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'

  return (
    <th className={`px-6 py-4 ${alignClass} text-xs font-semibold uppercase tracking-[0.2em] text-slate-500`}>
      {children}
    </th>
  )
}

function Td({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'

  return <td className={`px-6 py-4 ${alignClass} text-sm text-slate-700`}>{children}</td>
}

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
