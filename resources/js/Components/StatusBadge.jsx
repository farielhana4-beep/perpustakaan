const STYLES = {
  borrowed: 'bg-blue-100 text-blue-600',
  overdue: 'bg-amber-100 text-amber-700',
  returned: 'bg-green-100 text-green-600',
  lost: 'bg-red-100 text-red-600',
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

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${style} ${className}`}>{label}</span>
}
