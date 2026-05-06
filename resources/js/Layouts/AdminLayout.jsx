import { Link, router, usePage } from '@inertiajs/react'
import { useEffect } from 'react'
import GlobalSearchBar from '../Components/GlobalSearchBar'
import NotificationBell from '../Components/NotificationBell'

function NavItem({ href, active, children }) {
  return (
    <Link
      href={href}
      className={[
        'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-slate-800/95 text-white shadow-inner shadow-black/20 ring-1 ring-white/10'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-sm',
      ].join(' ')}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-60 transition group-hover:opacity-100" />
      <span>{children}</span>
    </Link>
  )
}

export default function AdminLayout({ children }) {
  const page = usePage()
  const url = page?.props?.url || ''
  const { auth, notifications = [], locale = 'id', t = {} } = page.props
  const user = auth?.user

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', locale)
    }
  }, [locale])

  const handleLogout = () => {
    router.post('/logout')
  }

  const handleLanguageChange = (value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', value)
    }
    router.post(
      '/change-language',
      { locale: value },
      {
        preserveState: true,
        preserveScroll: true,
      },
    )
  }

  const canSeeUsers = user?.role === 'super_admin'
  const canSeeCirculation = user?.role === 'super_admin' || user?.role === 'pustakawan'
  const canSeeSettings = user?.role === 'super_admin'
  const isActive = (path) => url?.startsWith(path) || false

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="border-r border-white/10 bg-slate-900 text-white backdrop-blur md:w-80">
        <div className="flex min-h-screen flex-col p-5">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.25)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">{t?.common?.library_system}</p>
            <h1 className="mt-2 text-2xl font-bold">{t?.common?.perpus_admin}</h1>
            <p className="mt-2 text-sm text-slate-300">{t?.common?.manage_library}</p>
          </div>

          <nav className="space-y-2">
            <NavItem href="/admin/dashboard" active={url === '/admin/dashboard'}>
              {t?.nav?.dashboard}
            </NavItem>
            <NavItem href="/admin/books" active={isActive('/admin/books')}>
              {t?.nav?.books}
            </NavItem>
            <NavItem href="/admin/categories" active={isActive('/admin/categories')}>
              {t?.nav?.categories}
            </NavItem>
            {canSeeCirculation && (
              <NavItem href="/admin/circulation" active={isActive('/admin/circulation') || isActive('/admin/borrowings')}>
                {t?.nav?.circulation}
              </NavItem>
            )}
            {canSeeUsers && (
              <NavItem href="/admin/users" active={isActive('/admin/users')}>
                {t?.nav?.users}
              </NavItem>
            )}
            {canSeeSettings && (
              <NavItem href="/admin/settings" active={isActive('/admin/settings')}>
                {t?.nav?.settings}
              </NavItem>
            )}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 shadow-sm transition hover:bg-white/10 hover:text-white"
          >
            {t?.nav?.logout}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">{t?.common?.admin_workspace}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{t?.nav?.dashboard}</h2>
            </div>

            <div className="flex flex-1 flex-col gap-3 xl:max-w-4xl xl:flex-row xl:items-center xl:justify-end">
              <GlobalSearchBar role={user?.role} />

              <div className="flex items-center justify-end gap-3">
                <select
                  value={locale}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="id">ID</option>
                  <option value="en">EN</option>
                </select>

                <NotificationBell notifications={notifications} />

                {user && (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{t?.roles?.[user.role] ?? user.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
