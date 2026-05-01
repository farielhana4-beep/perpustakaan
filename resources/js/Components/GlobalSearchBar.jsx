import { Link } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'

const EMPTY_RESULTS = {
  books: [],
  users: [],
  borrowings: [],
}

export default function GlobalSearchBar({ role = 'member' }) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState(EMPTY_RESULTS)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!search?.trim()) {
        setResults(EMPTY_RESULTS)
        setLoading(false)
        return
      }

      const controller = new AbortController()
      setLoading(true)

      try {
        const response = await fetch(`/search/global?search=${encodeURIComponent(search)}`, {
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        })

        const payload = await response.json()
        setResults({
          books: payload?.books ?? [],
          users: payload?.users ?? [],
          borrowings: payload?.borrowings ?? [],
        })
        setOpen(true)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setResults(EMPTY_RESULTS)
        }
      } finally {
        setLoading(false)
      }

      return () => controller.abort()
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  const totalResults = useMemo(
    () => (results?.books?.length ?? 0) + (results?.users?.length ?? 0) + (results?.borrowings?.length ?? 0),
    [results]
  )

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-slate-400">Search</span>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value ?? '')
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search books, users, borrowings..."
          className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        {loading && <span className="text-xs font-semibold text-sky-600">Searching...</span>}
      </div>

      {open && ((search?.trim() ?? '') || loading) && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 w-full max-h-80 overflow-y-auto rounded-xl bg-white shadow-lg">
          {loading ? (
            <div className="space-y-3 p-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-4 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : totalResults > 0 ? (
            <div className="border border-slate-200 p-2">
              <Section
                title="Books"
                items={results?.books ?? []}
                render={(item) => (
                  <LinkItem
                    href={role === 'member' ? `/member/catalog/${item.id}` : '/admin/books'}
                    title={item.title}
                    meta={`${item.author} • Stock ${item.stock}`}
                    onClick={() => setOpen(false)}
                  />
                )}
              />

              {role !== 'member' && (
                <Section
                  title="Users"
                  items={results?.users ?? []}
                  render={(item) => (
                    <LinkItem
                      href="/admin/users"
                      title={item.name}
                      meta={`${item.email} • ${item.role}`}
                      onClick={() => setOpen(false)}
                    />
                  )}
                />
              )}

              <Section
                title="Borrowings"
                items={results?.borrowings ?? []}
                render={(item) => (
                  <LinkItem
                    href={role === 'member' ? '/member/history' : '/admin/circulation'}
                    title={item.book?.title ?? 'Borrowing'}
                    meta={`${item.user?.name ?? '-'} • ${item.status}`}
                    onClick={() => setOpen(false)}
                  />
                )}
              />
            </div>
          ) : (
            <p className="p-4 text-sm text-gray-400">No results</p>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, items, render }) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      {items?.length > 0 ? (
        <div className="pb-2">{items.map(render)}</div>
      ) : (
        <p className="p-4 text-sm text-gray-400">No results</p>
      )}
    </div>
  )
}

function LinkItem({ href, title, meta, onClick }) {
  return (
    <Link href={href} onClick={onClick} className="block rounded-xl px-3 py-3 transition hover:bg-slate-50">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{meta}</p>
    </Link>
  )
}
