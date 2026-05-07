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
        'block rounded-xl px-4 py-3 text-sm font-medium transition',
        active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

export default function MemberLayout({ children }) {
  const page = usePage()
  const url = page?.props?.url || ''
  const { auth, notifications = [], t = {} } = page.props
  const user = auth?.user

  const logout = (e) => {
    e.preventDefault()
    router.post('/logout')
  }
  const isActive = (path) => url?.startsWith(path) || false

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <BrandSync />
      <aside className="border-r border-slate-800 bg-slate-900 px-5 py-6 text-white md:w-72">
        <div className="mb-10">
          <BrandMark dark />
          {user && <p className="mt-3 text-sm text-slate-400">{user.name}</p>}
        </div>

        <nav className="space-y-2">
          <NavItem href="/member/dashboard" active={url === '/member/dashboard'}>
            {t?.nav?.dashboard}
          </NavItem>
          <NavItem href="/member/catalog" active={isActive('/member/catalog')}>
            {t?.nav?.catalog}
          </NavItem>
          <NavItem href="/member/history" active={isActive('/member/history')}>
            {t?.nav?.history}
          </NavItem>
        </nav>

        <button
          type="button"
          onClick={logout}
          className="mt-8 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
        >
          {t?.nav?.logout}
        </button>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">{t?.common?.member_workspace}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{t?.common?.library_portal}</h2>
            </div>

            <div className="flex flex-1 flex-col gap-3 xl:max-w-4xl xl:flex-row xl:items-center xl:justify-end">
              <GlobalSearchBar role={user?.role} />

              <div className="flex items-center justify-end gap-3">
                <LocaleSwitcher className="min-w-[9.5rem]" />
                <NotificationBell notifications={notifications} />
                <ProfileMenu settingsHref="/profile" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
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
