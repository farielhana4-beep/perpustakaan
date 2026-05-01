import { Head, Link, router, usePage } from '@inertiajs/react'
import { EmptyState, TableSkeleton } from '../../../Components/DataStates'
import FilterToolbar from '../../../Components/FilterToolbar'
import Pagination from '../../../Components/Pagination'
import useIndexFilters from '../../../Hooks/useIndexFilters'
import AdminLayout from '../../../Layouts/AdminLayout'

const defaultFilters = {
  search: '',
  category_id: '',
  stock: '',
  sort: 'latest',
}

export default function Index(props) {
  const { flash = {} } = usePage().props
  const { books = { data: [] }, filters = {}, categories = [] } = props ?? {}
  const safeBooks = books ?? { data: [], links: [] }
  const safeCategories = categories ?? []
  const safeFilters = filters ?? {}
  const booksData = safeBooks?.data ?? []

  const { data, setData, applyFilters, resetFilters, isLoading } = useIndexFilters({
    url: '/admin/books',
    defaults: defaultFilters,
    filters: safeFilters,
  })
  console.log('DATA:', safeBooks)

  if (!safeBooks || !safeBooks.data) {
    return <div>Loading...</div>
  }

  const handleDelete = (book) => {
    if (!window.confirm(`Delete "${book.title}"?`)) return
    router.delete(`/admin/books/${book.id}`)
  }

  return (
    <AdminLayout>
      <Head title="Books" />

      <div className="mx-auto max-w-7xl">
        {flash.success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {flash.success}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Library</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Books</h1>
              {isLoading && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Updating...</span>}
            </div>
            <p className="mt-2 text-sm text-slate-600">Manage title, author, category, and stock with a faster admin workflow.</p>
          </div>

          <Link
            href="/admin/books/create"
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Add Book
          </Link>
        </div>

        <FilterToolbar
          actions={
            <>
              <button
                type="button"
                onClick={() => applyFilters()}
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </>
          }
        >
          <input
            placeholder="Search title, author, or ISBN..."
            value={data.search}
            onChange={(e) => setData('search', e.target.value)}
            className="w-72 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />

          <select
            value={data.category_id}
            onChange={(e) => setData('category_id', e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="">All Category</option>
            {safeCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={data.stock}
            onChange={(e) => setData('stock', e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="">All Stock</option>
            <option value="available">Available</option>
            <option value="low_stock">Low Stock Books</option>
          </select>

          <select
            value={data.sort}
            onChange={(e) => setData('sort', e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </FilterToolbar>

        {isLoading && booksData.length === 0 ? (
          <TableSkeleton rows={6} columns={6} />
        ) : booksData?.length === 0 ? (
          <>
            <EmptyState title="No books found" description="Try another keyword, category, or stock filter." />
            <div className="py-10 text-center text-gray-400">No data found</div>
          </>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                <p>
                  Showing <span className="font-semibold text-slate-700">{safeBooks.from ?? 0}</span> to{' '}
                  <span className="font-semibold text-slate-700">{safeBooks.to ?? 0}</span> of{' '}
                  <span className="font-semibold text-slate-700">{safeBooks.total ?? booksData.length}</span> books
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cover</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Author</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stock</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {booksData?.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="h-16 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {book.image_url ? (
                              <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                No cover
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          <HighlightedText text={book.title} search={data.search} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <HighlightedText text={book.author} search={data.search} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{book.category?.name ?? '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <span className={book.stock > 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-red-600'}>{book.stock}</span>
                            {book.is_low_stock && <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">Low Stock</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/books/${book.id}/edit`}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(book)}
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination links={safeBooks.links ?? []} />
          </>
        )}
      </div>
    </AdminLayout>
  )
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

  const before = safeText.slice(0, index)
  const match = safeText.slice(index, index + search.length)
  const after = safeText.slice(index + search.length)

  return (
    <>
      {before}
      <mark className="rounded bg-amber-100 px-1 text-slate-900">{match}</mark>
      {after}
    </>
  )
}
