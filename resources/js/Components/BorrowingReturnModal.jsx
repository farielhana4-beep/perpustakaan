import { usePage } from '@inertiajs/react'

export default function BorrowingReturnModal({
  borrowing,
  quantity,
  setQuantity,
  onClose,
  onPartialReturn,
  onReturnAll,
  processing = false,
}) {
  const page = usePage()
  const { t = {} } = page.props

  if (!borrowing) {
    return null
  }

  const remaining = Number(borrowing.remaining ?? borrowing.quantity - (borrowing.returned_quantity ?? 0))
  const safeRemaining = Number.isFinite(remaining) && remaining > 0 ? remaining : 0
  const title = borrowing.book?.title || borrowing.title || t?.circulation?.title

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">{t?.actions?.return_all}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{title}</h2>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>{t?.form?.quantity}: {borrowing.quantity}</p>
              <p>{t?.circulation?.returned_qty}: {borrowing.returned_quantity ?? 0}</p>
              <p>{t?.circulation?.remaining}: {safeRemaining}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {t?.actions?.close}
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">{t?.form?.quantity}</label>
          <input
            type="number"
            min="1"
            max={safeRemaining || 1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {t?.actions?.cancel}
          </button>
          <button
            type="button"
            onClick={onPartialReturn}
            disabled={processing || safeRemaining <= 0}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {t?.actions?.return_some}
          </button>
          <button
            type="button"
            onClick={onReturnAll}
            disabled={processing || safeRemaining <= 0}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {t?.actions?.return_all}
          </button>
        </div>
      </div>
    </div>
  )
}
