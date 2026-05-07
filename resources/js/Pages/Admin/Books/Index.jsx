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
  const page = usePage()
  const { flash = {}, t = {} } = page.props
  const { books = { data: [] }, filters = {}, categories = [] } = props ?? {}
  const safeBooks = books ?? { data: [], links: [] }
  const safeCategories = categories ?? []
  const booksData = safeBooks?.data ?? []

  const { data, setData, applyFilters, resetFilters, isLoading } = useIndexFilters({
    url: '/admin/books',
    defaults: defaultFilters,
    filters,
  })

  const handleDelete = (book) => {
    if (!window.confirm(`${t?.buttons?.delete} "${book.title}"?`)) return
    router.delete(`/admin/books/${book.id}`)
  }

  return (
    <AdminLayout>
      <Head title={t?.books?.title} />

      <div className="mx-auto max-w-7xl">
        {flash.success && <Alert>{flash.success}</Alert>}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">{t?.common?.library_system}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{t?.books?.title}</h1>
              {isLoading && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{t?.common?.updating}</span>}
            </div>
            <p className="mt-2 text-sm text-slate-600">{t?.books?.manage}</p>
          </div>

          <Link href="/admin/books/create" className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
            {t?.books?.add_button}
          </Link>
        </div>

        <FilterToolbar
          actions={
            <>
              <button type="button" onClick={() => applyFilters()} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600">
                {t?.buttons?.apply}
              </button>
              <button type="button" onClick={resetFilters} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                {t?.buttons?.reset}
              </button>
            </>
          }
        >
          <input
            placeholder={t?.form?.search_title_author_isbn}
            value={data.search}
            onChange={(e) => setData('search', e.target.value)}
            className="w-72 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />

          <select
            value={data.category_id}
            onChange={(e) => setData('category_id', e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="">{t?.form?.all_categories}</option>
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
            <option value="">{t?.form?.all_stock}</option>
            <option value="available">{t?.status?.available}</option>
            <option value="low_stock">{t?.books?.low_stock}</option>
          </select>

          <select
            value={data.sort}
            onChange={(e) => setData('sort', e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="latest">{t?.books?.latest}</option>
            <option value="oldest">{t?.books?.oldest}</option>
          </select>
        </FilterToolbar>

        {isLoading && booksData.length === 0 ? (
          <TableSkeleton rows={6} columns={6} />
        ) : booksData?.length === 0 ? (
          <>
            <EmptyState title={t?.books?.no_books_found} description={t?.books?.try_other_filter} />
            <div className="py-10 text-center text-gray-400">{t?.empty?.no_data}</div>
          </>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                <p>
                  {t?.books?.showing} <span className="font-semibold text-slate-700">{safeBooks.from ?? 0}</span> {t?.books?.from}{' '}
                  <span className="font-semibold text-slate-700">{safeBooks.to ?? 0}</span> {t?.books?.to}{' '}
                  <span className="font-semibold text-slate-700">{safeBooks.total ?? booksData.length}</span> {t?.books?.books_count}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <Th>{t?.books?.cover_image}</Th>
                      <Th>{t?.form?.title}</Th>
                      <Th>{t?.form?.author}</Th>
                      <Th>{t?.form?.category}</Th>
                      <Th>{t?.form?.stock}</Th>
                      <Th align="right">{t?.table?.actions}</Th>
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
                                {t?.books?.no_cover}
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
                            {book.is_low_stock && <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">{t?.books?.low_stock}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/books/${book.id}/edit`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700">
                              {t?.buttons?.edit}
                            </Link>
                            <button type="button" onClick={() => handleDelete(book)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                              {t?.buttons?.delete}
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

  if (!search) return safeText

  const index = safeText.toLowerCase().indexOf(search.toLowerCase())
  if (index === -1) return safeText

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

function Th({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return <th className={`px-6 py-4 ${alignClass} text-xs font-semibold uppercase tracking-[0.2em] text-slate-500`}>{children}</th>
}

function Alert({ children }) {
  return (
    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      {children}
    </div>
  )
}
