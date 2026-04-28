import { Link, router, usePage } from '@inertiajs/react'

function NavItem({ href, active, children }) {
  return (
    <Link
      href={href}
      className={[
        'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-slate-800/95 text-white shadow-inner shadow-black/20 ring-1 ring-white/10'
          : 'text-slate-300 hover:bg-white/5 hover:text-white hover:shadow-sm',
      ].join(' ')}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-60 transition group-hover:opacity-100" />
      <span>{children}</span>
    </Link>
  )
}

function roleLabel(role) {
  return (
    {
      super_admin: 'Super Admin',
      pustakawan: 'Pustakawan',
      member: 'Member',
    }[role] ?? role
  )
}

export default function AdminLayout({ children }) {
  const { url, props } = usePage()
  const user = props.auth?.user

  const handleLogout = () => {
    router.post('/logout')
  }

  const canSeeUsers = user?.role === 'super_admin'
  const canSeeCirculation = user?.role === 'super_admin' || user?.role === 'pustakawan'
  const canSeeSettings = user?.role === 'super_admin'

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="border-r border-white/10 bg-slate-900/95 text-white backdrop-blur md:w-80">
        <div className="flex min-h-screen flex-col p-5">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.25)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Library</p>
            <h1 className="mt-2 text-2xl font-bold">Perpus Admin</h1>
            <p className="mt-2 text-sm text-slate-300">Manage books, categories, and circulation.</p>
          </div>

          <nav className="space-y-2">
            <NavItem href="/admin/dashboard" active={url === '/admin/dashboard'}>
              Dashboard
            </NavItem>
            <NavItem href="/admin/books" active={url.startsWith('/admin/books')}>
              Books
            </NavItem>
            <NavItem href="/admin/categories" active={url.startsWith('/admin/categories')}>
              Categories
            </NavItem>
            {canSeeCirculation && (
              <NavItem href="/admin/circulation" active={url.startsWith('/admin/circulation') || url.startsWith('/admin/borrowings')}>
                Circulation
              </NavItem>
            )}
            {canSeeUsers && (
              <NavItem href="/admin/users" active={url.startsWith('/admin/users')}>
                Users
              </NavItem>
            )}
            {canSeeSettings && (
              <NavItem href="/admin/settings" active={url.startsWith('/admin/settings')}>
                Settings
              </NavItem>
            )}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 shadow-sm transition hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Admin Workspace</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">Dashboard</h2>
            </div>

            {user && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-slate-900 text-sm font-bold text-white flex items-center justify-center">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{roleLabel(user.role)}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
