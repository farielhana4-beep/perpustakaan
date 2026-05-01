import { Link, router, usePage } from '@inertiajs/react'
import GlobalSearchBar from '../Components/GlobalSearchBar'
import NotificationBell from '../Components/NotificationBell'

function NavItem({ href, active, children }) {
  return (
    <Link
      href={href}
      className={[
        'block rounded-xl px-4 py-3 text-sm font-medium transition',
        active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

export default function MemberLayout({ children }) {
  const { url, props } = usePage()
  const user = props.auth?.user
  const notifications = props.notifications ?? []

  const logout = (e) => {
    e.preventDefault()
    router.post('/logout')
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="border-r border-slate-800 bg-slate-900 px-5 py-6 text-white md:w-72">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Member Area</p>
          <h1 className="mt-2 text-2xl font-bold">Library Portal</h1>
          {user && <p className="mt-2 text-sm text-slate-400">{user.name}</p>}
        </div>

        <nav className="space-y-2">
          <NavItem href="/member/dashboard" active={url === '/member/dashboard'}>
            Dashboard
          </NavItem>
          <NavItem href="/member/catalog" active={url.startsWith('/member/catalog')}>
            Catalog
          </NavItem>
          <NavItem href="/member/history" active={url.startsWith('/member/history')}>
            History
          </NavItem>
        </nav>

        <button
          type="button"
          onClick={logout}
          className="mt-8 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
        >
          Logout
        </button>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Member Workspace</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">Library Portal</h2>
            </div>

            <div className="flex flex-1 flex-col gap-3 xl:max-w-4xl xl:flex-row xl:items-center xl:justify-end">
              <GlobalSearchBar role={user?.role} />

              <div className="flex items-center justify-end gap-3">
                <NotificationBell notifications={notifications} />

                {user && (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
