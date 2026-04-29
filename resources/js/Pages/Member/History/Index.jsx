import { Head, router, usePage } from '@inertiajs/react'
import MemberLayout from '../../../Layouts/MemberLayout'
import StatusBadge from '../../../Components/StatusBadge'
import { formatCurrency } from '../../../Support/currency'

export default function Index({ borrowings, settings }) {
  const { flash = {} } = usePage().props
  const currency = settings?.currency ?? 'IDR'

  return (
    <MemberLayout>
      <Head title="Borrowing History" />
      <div className="mx-auto max-w-7xl space-y-6">
        <FlashBanner tone="success" message={flash.success} />
        <FlashBanner tone="error" message={flash.error} />

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">History</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Borrowing History</h1>
          <p className="mt-2 text-sm text-slate-600">Review all returned, overdue, and lost borrowings.</p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <Th>Book</Th>
                <Th>Qty</Th>
                <Th>Status</Th>
                <Th>Borrowed</Th>
                <Th>Due</Th>
                <Th>Returned</Th>
                <Th>Fine</Th>
                <Th align="right">Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {borrowings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-14 text-center text-sm text-slate-500">
                    No borrowing history yet.
                  </td>
                </tr>
              ) : (
                borrowings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <Td>{item.book?.title}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>
                      <StatusBadge status={item.status} />
                    </Td>
                    <Td>{formatDate(item.borrowed_at)}</Td>
                    <Td>{formatDate(item.due_date)}</Td>
                    <Td>{item.returned_at ? formatDate(item.returned_at) : '-'}</Td>
                    <Td>{formatCurrency(item.fine_amount, currency)}</Td>
                    <Td align="right">
                      {(item.status === 'borrowed' || item.status === 'overdue') && (
                        <button
                          type="button"
                          onClick={() => router.post(`/member/borrowings/${item.id}/return`)}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                          Return
                        </button>
                      )}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
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
