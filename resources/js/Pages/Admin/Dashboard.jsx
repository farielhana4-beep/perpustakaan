import { Head, Link, usePage } from '@inertiajs/react'
import AdminBorrowingChart from '../../Components/AdminBorrowingChart'
import { EmptyState } from '../../Components/DataStates'
import StatusBadge from '../../Components/StatusBadge'
import AdminLayout from '../../Layouts/AdminLayout'
import { formatCurrency } from '../../Support/currency'

function StatCard({ label, value, hint, tone = 'sky' }) {
  const tones = {
    sky: 'from-sky-50 to-white text-sky-600',
    emerald: 'from-emerald-50 to-white text-emerald-600',
    red: 'from-red-50 to-white text-red-600',
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${tones[tone]} p-6 shadow-sm`}>
      <p className="text-sm font-semibold uppercase tracking-[0.25em]">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  )
}

export default function Dashboard({ stats, recentBorrowings, dailyBorrowings, topBooks, lowStockBooks, settings }) {
  const { props } = usePage()
  const currency = settings?.currency ?? 'IDR'
  const isSuperAdmin = props.auth?.user?.role === 'super_admin'

  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Dashboard</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Smart Library Overview</h1>
              <p className="mt-3 max-w-3xl text-slate-600">
                Track live borrowing activity, overdue pressure, low stock alerts, and fine accumulation from one place.
              </p>
            </div>

            {isSuperAdmin && (
              <div className="flex flex-wrap justify-end gap-2">
                <a href="/admin/exports?dataset=books&format=csv" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  Export Books CSV
                </a>
                <a href="/admin/exports?dataset=users&format=xls" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  Export Users Excel
                </a>
                <a href="/admin/exports?dataset=borrowings&format=csv" className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700">
                  Export Borrowings
                </a>
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Books" value={stats.total_books} hint="Catalog titles available now" tone="sky" />
          <StatCard label="Total Users" value={stats.total_users} hint="All registered library accounts" tone="sky" />
          <StatCard label="Active Borrowed" value={stats.total_borrowed} hint="Books currently out" tone="emerald" />
          <StatCard label="Overdue" value={stats.total_overdue} hint="Items needing follow up" tone="red" />
          <StatCard label="Total Fine" value={formatCurrency(stats.total_fine, currency)} hint="Accumulated fine value" tone="red" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Trend</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Daily Borrowings</h2>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Last 14 days</span>
            </div>
            <div className="mt-6">
              <AdminBorrowingChart data={dailyBorrowings} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Popular</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Most Borrowed Books</h2>
              </div>
              <Link href="/admin/books" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Open Books
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {topBooks.length === 0 ? (
                <EmptyState title="No borrowing data yet" description="Borrowing activity will appear here once circulation starts." />
              ) : (
                topBooks.map((book, index) => (
                  <div key={book.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{book.title}</p>
                        <p className="text-sm text-slate-500">{book.author}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{book.total_borrowed ?? 0} borrowed</p>
                      {book.stock < 5 && <span className="mt-1 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Low Stock</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">Attention</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Low Stock Alert</h2>
              </div>
              <Link href="/admin/books?stock=low_stock" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Low Stock Books
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {lowStockBooks.length === 0 ? (
                <EmptyState title="Stock is healthy" description="No books are currently below the low-stock threshold." />
              ) : (
                lowStockBooks.map((book) => (
                  <div key={book.id} className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{book.title}</p>
                        <p className="text-sm text-slate-500">{book.author}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Low Stock</span>
                        <p className="mt-2 text-sm font-semibold text-red-700">{book.stock} left</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Recent Borrowings</h2>
                <p className="mt-1 text-sm text-slate-500">Live circulation activity with overdue visibility and fine totals.</p>
              </div>
              <Link
                href="/admin/circulation?status=overdue"
                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Overdue Only
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <Th>User</Th>
                    <Th>Book</Th>
                    <Th>Status</Th>
                    <Th>Borrowed</Th>
                    <Th>Due</Th>
                    <Th>Fine</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentBorrowings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-500">
                        No borrowing activity yet.
                      </td>
                    </tr>
                  ) : (
                    recentBorrowings.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <Td>{item.user?.name}</Td>
                        <Td className="font-medium text-slate-900">{item.book?.title}</Td>
                        <Td>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={item.status} />
                            {item.status === 'overdue' && <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">Warning</span>}
                          </div>
                        </Td>
                        <Td>{formatDate(item.borrowed_at)}</Td>
                        <Td>{formatDate(item.due_date)}</Td>
                        <Td>{formatCurrency(item.fine_amount, currency)}</Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

function Th({ children }) {
  return <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{children}</th>
}

function Td({ children, className = '' }) {
  return <td className={`px-6 py-4 text-sm text-slate-600 ${className}`}>{children}</td>
}

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
