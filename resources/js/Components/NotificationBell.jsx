import { useState } from 'react'

export default function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        Notifications
        {notifications.length > 0 && (
          <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-100 px-2 text-xs font-bold text-red-600">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">No alerts right now.</div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="border-b border-slate-100 px-4 py-4 last:border-b-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                    <span className={badgeClass(notification.status)}>{labelFor(notification.status)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
                  {notification.due_date && <p className="mt-2 text-xs text-slate-400">Due {notification.due_date}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function badgeClass(status) {
  if (status === 'overdue') return 'rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600'
  if (status === 'due_soon') return 'rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700'
  return 'rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700'
}

function labelFor(status) {
  if (status === 'overdue') return 'Overdue'
  if (status === 'due_soon') return 'Due Soon'
  return 'Alert'
}
