const STYLES = {
  borrowed: 'border-blue-200 bg-blue-50 text-blue-700',
  overdue: 'border-red-200 bg-red-50 text-red-700',
  returned: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  lost: 'border-slate-200 bg-slate-100 text-slate-700',
}

const LABELS = {
  borrowed: 'Borrowed',
  overdue: 'Overdue',
  returned: 'Returned',
  lost: 'Lost',
}

export default function StatusBadge({ status, className = '' }) {
  const style = STYLES[status] ?? STYLES.lost
  const label = LABELS[status] ?? status

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${style} ${className}`}>{label}</span>
}
