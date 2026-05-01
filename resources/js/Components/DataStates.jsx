export function EmptyState({ title = 'No data found', description = 'Try adjusting your search or filters.' }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((__, columnIndex) => (
                  <td key={columnIndex} className="px-6 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CardSkeleton({ items = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="w-40 space-y-3">
              <div className="h-3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
