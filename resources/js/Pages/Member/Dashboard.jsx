import { Head, router, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import BorrowingReturnModal from '../../Components/BorrowingReturnModal'
import MemberLayout from '../../Layouts/MemberLayout'
import StatusBadge from '../../Components/StatusBadge'
import { formatCurrency } from '../../Support/currency'

export default function Dashboard({ borrowings, alerts, settings, stats }) {
  const page = usePage()
  const { t = {}, locale = 'id', flash = {} } = page.props
  const currency = settings?.currency ?? 'IDR'
  const [returningBorrowing, setReturningBorrowing] = useState(null)
  const [returnQuantity, setReturnQuantity] = useState(1)

  const openReturnModal = (item) => {
    setReturningBorrowing(item)
    setReturnQuantity(Math.max(1, Number(item.remaining ?? item.quantity - (item.returned_quantity ?? 0)) || 1))
  }

  const closeReturnModal = () => {
    setReturningBorrowing(null)
    setReturnQuantity(1)
  }

  const submitPartialReturn = () => {
    if (!returningBorrowing) return

    router.post(
      `/member/borrowings/${returningBorrowing.id}/return`,
      { quantity: Number(returnQuantity) || 1 },
      { preserveScroll: true, onSuccess: closeReturnModal },
    )
  }

  const submitReturnAll = () => {
    if (!returningBorrowing) return

    router.post(`/member/borrowings/${returningBorrowing.id}/return-all`, {}, { preserveScroll: true, onSuccess: closeReturnModal })
  }

  return (
    <MemberLayout>
      <Head title={t?.dashboard?.title} />
      <div className="mx-auto max-w-7xl space-y-6">
        {flash.success && <Banner tone="success">{flash.success}</Banner>}
        {flash.error && <Banner tone="error">{flash.error}</Banner>}

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">{t?.common?.member_area}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{t?.member?.reading_activity}</h1>
          <p className="mt-3 text-slate-600">{t?.dashboard?.track_activity}</p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label={t?.dashboard?.active_borrowed} value={stats.active} tone="emerald" />
          <StatCard label={t?.dashboard?.overdue} value={stats.overdue} tone="red" />
          <StatCard label={t?.dashboard?.total_fine} value={formatCurrency(stats.fine, currency)} tone="sky" />
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {alerts.length === 0 ? (
            <EmptyCard title={t?.member?.no_active_borrowings} description={t?.member?.borrow_from_catalog} />
          ) : (
            alerts.map((item) => (
              <div key={item.id} className={`rounded-2xl border p-6 shadow-sm ${item.status === 'overdue' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t?.form?.quantity} {item.quantity}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t?.circulation?.returned_qty} {item.returned_quantity ?? 0}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t?.circulation?.remaining} {item.remaining ?? item.quantity - (item.returned_quantity ?? 0)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge status={item.status} />
                      <span className={item.status === 'overdue' ? 'rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600' : 'rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'}>
                        {item.status === 'overdue' ? t?.dashboard?.warning : t?.dashboard?.due_soon}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>{t?.circulation?.due} {item.due_date}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>{item.days_left < 0 ? `${t?.dashboard?.warning} ${Math.abs(item.days_left)} ${t?.dashboard?.left}` : `${t?.dashboard?.left}: ${item.days_left}`}</p>
                  <p>{t?.circulation?.fine}: {formatCurrency(item.fine_amount, currency)}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => openReturnModal(item)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                    {t?.actions?.return_some}
                  </button>
                  <button type="button" onClick={() => router.post(`/member/borrowings/${item.id}/return-all`, {}, { preserveScroll: true })} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600">
                    {t?.actions?.return_all}
                  </button>
                  <Link href="/member/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                    {t?.nav?.catalog}
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{t?.member?.latest_borrowings}</h2>
              <p className="mt-1 text-sm text-slate-500">{t?.dashboard?.live_circulation}</p>
            </div>
            <Link href="/member/history" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              {t?.actions?.view_history}
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {borrowings.length === 0 ? (
              <EmptyCard title={t?.dashboard?.no_borrowing_data} description={t?.dashboard?.no_borrowing_activity} />
            ) : (
              borrowings.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.book.title}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t?.form?.quantity} {item.quantity}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t?.circulation?.returned_qty} {item.returned_quantity ?? 0}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t?.circulation?.remaining} {item.remaining ?? item.quantity - (item.returned_quantity ?? 0)}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge status={item.status} />
                        {item.status === 'overdue' && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">{t?.dashboard?.warning}</span>}
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{t?.circulation?.borrowed} {formatDate(item.borrowed_at, locale)}</p>
                      <p>{t?.circulation?.due} {formatDate(item.due_date, locale)}</p>
                      <p>{t?.circulation?.fine} {formatCurrency(item.fine_amount, currency)}</p>
                    </div>
                  </div>
                  {(item.status === 'borrowed' || item.status === 'overdue') && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => openReturnModal(item)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        {t?.actions?.return_some}
                      </button>
                      <button type="button" onClick={() => router.post(`/member/borrowings/${item.id}/return-all`, {}, { preserveScroll: true })} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600">
                        {t?.actions?.return_all}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <BorrowingReturnModal
          borrowing={returningBorrowing}
          quantity={returnQuantity}
          setQuantity={setReturnQuantity}
          onClose={closeReturnModal}
          onPartialReturn={submitPartialReturn}
          onReturnAll={submitReturnAll}
        />
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

function StatCard({ label, value, tone }) {
  const tones = {
    emerald: 'from-emerald-50 to-white text-emerald-600',
    red: 'from-red-50 to-white text-red-600',
    sky: 'from-sky-50 to-white text-sky-600',
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${tones[tone]} p-6 shadow-sm`}>
      <p className="text-sm font-semibold uppercase tracking-[0.25em]">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function formatDate(value, locale) {
  if (!value) return '-'

  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
