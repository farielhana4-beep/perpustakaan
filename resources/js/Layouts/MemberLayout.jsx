import { Link, router, usePage } from '@inertiajs/react'

function NavItem({ href, active, children }) {
  return (
    <Link
      href={href}
      className={[
        'block rounded-xl px-4 py-3 text-sm font-medium transition',
        active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

export default function MemberLayout({ children }) {
  const { url, props } = usePage()
  const user = props.auth?.user

  const logout = (e) => {
    e.preventDefault()
    router.post('/logout')
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="border-r border-slate-800 bg-slate-950 px-5 py-6 text-white md:w-72">
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
          className="mt-8 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
