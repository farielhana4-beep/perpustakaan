import { Link, router, usePage } from '@inertiajs/react'
import BrandMark from '../Components/BrandMark'
import BrandSync from '../Components/BrandSync'
import FlashAlert from '../Components/FlashAlert'
import GlobalSearchBar from '../Components/GlobalSearchBar'
import NotificationBell from '../Components/NotificationBell'
import ProfileMenu from '../Components/ProfileMenu'
import LocaleSwitcher from '../Components/LocaleSwitcher'

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
  const { auth, notifications = [], t = {} } = page.props
  const user = auth?.user

  const handleLogout = () => {
    router.post('/logout')
  }

  const canSeeUsers = user?.role === 'super_admin'
  const canSeeCirculation = user?.role === 'super_admin' || user?.role === 'pustakawan'
  const canSeeSettings = user?.role === 'super_admin'
  const isActive = (path) => url?.startsWith(path) || false

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <BrandSync />
      <aside className="border-r border-white/10 bg-slate-900 text-white backdrop-blur md:w-80">
        <div className="flex min-h-screen flex-col p-5">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.25)]">
            <BrandMark dark />
            <p className="mt-3 text-sm text-slate-300">{t?.common?.manage_library}</p>
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
                <LocaleSwitcher className="min-w-[9.5rem]" />
                <NotificationBell notifications={notifications} />
                <ProfileMenu settingsHref={user?.role === 'super_admin' ? '/admin/settings' : null} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 max-w-7xl space-y-3">
            <FlashAlert tone="success" message={page?.props?.flash?.success} />
            <FlashAlert tone="error" message={page?.props?.flash?.error} />
            <FlashAlert tone="warning" message={page?.props?.flash?.status} />
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
