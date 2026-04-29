import { Head, router, Link, usePage } from '@inertiajs/react'
import MemberLayout from '../../Layouts/MemberLayout'
import StatusBadge from '../../Components/StatusBadge'
import { formatCurrency } from '../../Support/currency'

export default function Dashboard({ borrowings, alerts, settings }) {
  const { flash = {} } = usePage().props
  const currency = settings?.currency ?? 'IDR'

  return (
    <MemberLayout>
      <Head title="Member Dashboard" />
      <div className="mx-auto max-w-7xl space-y-6">
        {flash.success && <Banner tone="success">{flash.success}</Banner>}
        {flash.error && <Banner tone="error">{flash.error}</Banner>}

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Member Dashboard</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Your Reading Activity</h1>
          <p className="mt-3 text-slate-600">
            Track active borrowings, due dates, and fines in one place.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {alerts.length === 0 ? (
            <EmptyCard title="No active borrowings" description="Borrow a book from the catalog to get started." />
          ) : (
                alerts.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Qty {item.quantity}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>Due date</p>
                    <p className="font-semibold text-slate-900">{item.due_date}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>Days left: {item.days_left}</p>
                  <p>Fine: {formatCurrency(item.fine_amount, currency)}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => router.post(`/member/borrowings/${item.id}/return`)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    Return Book
                  </button>
                  <Link
                    href="/member/catalog"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Browse Catalog
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Current Borrowings</h2>
            <Link
              href="/member/history"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              View History
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {borrowings.length === 0 ? (
              <EmptyCard title="Nothing borrowed yet" description="Visit the catalog to borrow books." />
            ) : (
                borrowings.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{item.book.title}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Qty {item.quantity}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>Borrowed {formatDate(item.borrowed_at)}</p>
                      <p>Due {formatDate(item.due_date)}</p>
                      <p>Fine {formatCurrency(item.fine_amount, currency)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </MemberLayout>
  )
}

function EmptyCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
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

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
