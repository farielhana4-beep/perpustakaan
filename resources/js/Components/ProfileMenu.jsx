import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import LocaleSwitcher from './LocaleSwitcher'

export default function ProfileMenu({ settingsHref }) {
  const { auth = {}, t = {} } = usePage().props
  const user = auth?.user
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  if (!user) {
    return null
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow-md"
      >
        <Avatar user={user} />
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">{t?.roles?.[user.role] ?? user.role}</p>
        </div>
      </button>

      <div
        className={[
          'absolute right-0 z-30 mt-3 w-72 origin-top-right rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.14)] transition-all duration-200',
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
        ].join(' ')}
      >
        <div className="border-b border-slate-100 px-3 pb-3">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
        </div>

        <div className="space-y-1 px-1 py-3">
          <MenuLink href="/profile" onClick={() => setOpen(false)}>
            {t?.profile?.my_profile}
          </MenuLink>
          {settingsHref && (
            <MenuLink href={settingsHref} onClick={() => setOpen(false)}>
              {t?.profile?.settings}
            </MenuLink>
          )}
        </div>

        <div className="border-t border-slate-100 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{t?.profile?.language}</p>
          <div className="mt-2">
            <LocaleSwitcher className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
          </div>
        </div>

        <div className="border-t border-slate-100 px-1 pt-3">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              router.post('/logout')
            }}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span>{t?.nav?.logout}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function Avatar({ user }) {
  if (user.avatar_url) {
    return <img src={user.avatar_url} alt={user.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200" />
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white ring-2 ring-slate-200">
      {user.name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  )
}

function MenuLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
    >
      {children}
    </Link>
  )
}
