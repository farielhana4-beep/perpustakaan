import { usePage } from '@inertiajs/react'

const STYLES = {
  pending: 'bg-slate-100 text-slate-600',
  borrowed: 'bg-blue-100 text-blue-600',
  overdue: 'bg-amber-100 text-amber-700',
  returned: 'bg-green-100 text-green-600',
  lost: 'bg-red-100 text-red-600',
}

export default function StatusBadge({ status, className = '' }) {
  const page = usePage()
  const { t = {} } = page.props
  const style = STYLES[status] ?? STYLES.lost
  const statusLabels = {
    pending: t?.status?.pending,
    borrowed: t?.status?.borrowed,
    overdue: t?.status?.overdue,
    returned: t?.status?.returned,
    lost: t?.status?.lost,
  }
  const label = statusLabels[status] ?? status

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${style} ${className}`}>{label}</span>
}
