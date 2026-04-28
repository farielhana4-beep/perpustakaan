import { Head, Link } from '@inertiajs/react'
import AdminLayout from '../../Layouts/AdminLayout'
import StatusBadge from '../../Components/StatusBadge'
import { formatCurrency } from '../../Support/currency'

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  )
}

export default function Dashboard({ stats, recentBorrowings, settings }) {
  const currency = settings?.currency ?? 'IDR'

  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Dashboard</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Library Overview</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Track catalog, members, and circulation activity from one control panel.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Books" value={stats.books} hint="Available titles in the catalog" />
          <StatCard label="Categories" value={stats.categories} hint="Organized subject groups" />
          <StatCard label="Users" value={stats.users} hint="All registered accounts" />
          <StatCard label="Borrowings" value={stats.borrowings} hint="Active and historical records" />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Borrowings</h2>
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
                        <StatusBadge status={item.status} />
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

        <div className="flex justify-end">
          <Link
            href="/admin/circulation"
            className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Open Circulation
          </Link>
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
