import { Head, Link, router, usePage } from '@inertiajs/react'
import { EmptyState, TableSkeleton } from '../../../Components/DataStates'
import FilterToolbar from '../../../Components/FilterToolbar'
import Pagination from '../../../Components/Pagination'
import useIndexFilters from '../../../Hooks/useIndexFilters'
import AdminLayout from '../../../Layouts/AdminLayout'

const defaultFilters = {
  search: '',
  sort: 'latest',
}

export default function Index(props) {
  const { flash = {} } = usePage().props
  const { categories = { data: [] }, filters = {} } = props ?? {}
  const safeCategories = categories ?? { data: [], links: [] }
  const categoriesData = safeCategories?.data ?? []

  const { data, setData, applyFilters, resetFilters, isLoading } = useIndexFilters({
    url: '/admin/categories',
    defaults: defaultFilters,
    filters,
  })
  console.log('DATA:', safeCategories)

  if (!safeCategories || !safeCategories.data) {
    return <div>Loading...</div>
  }

  const handleDelete = (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return
    router.delete(`/admin/categories/${category.id}`)
  }

  return (
    <AdminLayout>
      <Head title="Categories" />

      <div className="mx-auto max-w-7xl">
        {flash.success && <Alert>{flash.success}</Alert>}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Library</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
              {isLoading && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Updating...</span>}
            </div>
            <p className="mt-2 text-sm text-slate-600">Organize your catalog into clean, searchable groups.</p>
          </div>

          <Link href="/admin/categories/create" className="btn-primary">
            Add Category
          </Link>
        </div>

        <FilterToolbar
          actions={
            <>
              <button type="button" onClick={() => applyFilters()} className="btn-apply">
                Apply
              </button>
              <button type="button" onClick={resetFilters} className="btn-reset">
                Reset
              </button>
            </>
          }
        >
          <input
            placeholder="Search category..."
            value={data.search}
            onChange={(e) => setData('search', e.target.value)}
            className="w-72 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />

          <select
            value={data.sort}
            onChange={(e) => setData('sort', e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </FilterToolbar>

        {isLoading && categoriesData.length === 0 ? (
          <TableSkeleton rows={6} columns={4} />
        ) : categoriesData?.length === 0 ? (
          <>
            <EmptyState title="No categories found" description="Try a different keyword or reset the filters." />
            <div className="py-10 text-center text-gray-400">No data found</div>
          </>
        ) : (
          <>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                <p>
                  Showing <span className="font-semibold text-slate-700">{safeCategories.from ?? 0}</span> to{' '}
                  <span className="font-semibold text-slate-700">{safeCategories.to ?? 0}</span> of{' '}
                  <span className="font-semibold text-slate-700">{safeCategories.total ?? categoriesData.length}</span> categories
                </p>
              </div>

              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <Th>Name</Th>
                    <Th>Slug</Th>
                    <Th>Books</Th>
                    <Th align="right">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categoriesData?.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50">
                      <Td>
                        <HighlightedText text={category.name} search={data.search} />
                      </Td>
                      <Td>{category.slug}</Td>
                      <Td>{category.books_count}</Td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/categories/${category.id}/edit`} className="btn-secondary">
                            Edit
                          </Link>
                          <button type="button" onClick={() => handleDelete(category)} className="btn-danger">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination links={safeCategories.links ?? []} />
          </>
        )}
      </div>

      <SharedStyles />
    </AdminLayout>
  )
}

function Alert({ children }) {
  return (
    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      {children}
    </div>
  )
}

function Th({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return <th className={`px-6 py-4 ${alignClass} text-xs font-semibold uppercase tracking-[0.2em] text-slate-500`}>{children}</th>
}

function Td({ children }) {
  return <td className="px-6 py-4 text-sm text-slate-700">{children}</td>
}

function HighlightedText({ text, search }) {
  const safeText = text ?? ''

  if (!search) {
    return safeText
  }

  const index = safeText.toLowerCase().indexOf(search.toLowerCase())

  if (index === -1) {
    return safeText
  }

  return (
    <>
      {safeText.slice(0, index)}
      <mark className="rounded bg-amber-100 px-1 text-slate-900">{safeText.slice(index, index + search.length)}</mark>
      {safeText.slice(index + search.length)}
    </>
  )
}

function SharedStyles() {
  return (
    <style>{`.btn-primary{border-radius:0.75rem;background:#0284c7;padding:0.75rem 1.25rem;font-size:0.875rem;font-weight:600;color:#fff;transition:all .15s ease}.btn-primary:hover{background:#0369a1}.btn-secondary{border-radius:0.5rem;border:1px solid #cbd5e1;padding:.5rem 1rem;font-size:.875rem;font-weight:600;color:#334155;transition:all .15s ease}.btn-secondary:hover{background:#f8fafc}.btn-danger{border-radius:0.5rem;border:1px solid #fecaca;padding:.5rem 1rem;font-size:.875rem;font-weight:600;color:#dc2626;transition:all .15s ease}.btn-danger:hover{background:#fef2f2}.btn-apply{border-radius:0.75rem;background:#0ea5e9;padding:.5rem 1rem;font-size:.875rem;font-weight:600;color:#fff;transition:all .15s ease}.btn-apply:hover{background:#0284c7}.btn-reset{border-radius:0.75rem;border:1px solid #cbd5e1;padding:.5rem 1rem;font-size:.875rem;font-weight:600;color:#334155;transition:all .15s ease}.btn-reset:hover{background:#f8fafc}`}</style>
  )
}
