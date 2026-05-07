import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { EmptyState, TableSkeleton } from '../../../Components/DataStates'
import Pagination from '../../../Components/Pagination'
import useIndexFilters from '../../../Hooks/useIndexFilters'
import MemberLayout from '../../../Layouts/MemberLayout'

const defaultFilters = {
  search: '',
  category: '',
  low_stock: false,
}

export default function Index({ books, categories, filters }) {
  const page = usePage()
  const { flash = {}, t = {}, locale = 'id' } = page.props
  const { data, setData, applyFilters, resetFilters, isLoading } = useIndexFilters({
    url: '/member/catalog',
    defaults: defaultFilters,
    filters,
  })
  const [selectedBook, setSelectedBook] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const borrowOne = (book) => {
    router.post('/member/borrowings', { book_id: book.id, quantity: 1 }, { preserveScroll: true })
  }

  const openQuantityModal = (book) => {
    setSelectedBook(book)
    setQuantity(1)
  }

  const closeQuantityModal = () => {
    setSelectedBook(null)
  }

  const borrowMany = () => {
    if (!selectedBook) return

    router.post(
      '/member/borrowings',
      {
        book_id: selectedBook.id,
        quantity: Number(quantity) || 1,
      },
      {
        preserveScroll: true,
        onSuccess: closeQuantityModal,
      },
    )
  }

  return (
    <MemberLayout>
      <Head title={t?.catalog?.title} />
      <div className="mx-auto max-w-7xl space-y-6">
        {flash.success && <Banner tone="success">{flash.success}</Banner>}
        {flash.error && <Banner tone="error">{flash.error}</Banner>}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">{t?.nav?.catalog}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">{t?.books?.title}</h1>
                {isLoading && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{t?.common?.updating}</span>}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <input
                className="input w-72"
                placeholder={t?.form?.search_title_author_isbn}
                value={data.search}
                onChange={(e) => setData('search', e.target.value)}
              />
              <select className="input w-56" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                <option value="">{t?.form?.all_categories}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(data.low_stock)}
                  onChange={(e) => setData('low_stock', e.target.checked)}
                />
                {t?.catalog?.low_stock_only}
              </label>
              <button type="button" onClick={() => applyFilters()} className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
                {t?.buttons?.apply}
              </button>
              <button type="button" onClick={resetFilters} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                {t?.buttons?.reset}
              </button>
            </div>
          </div>
        </section>

        {isLoading && books.data.length === 0 ? (
          <TableSkeleton rows={6} columns={3} />
        ) : books.data.length === 0 ? (
          <EmptyState title={t?.books?.no_books_found} description={t?.books?.try_other_filter} />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {books.data.map((book) => (
                <article key={book.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:scale-[1.01] hover:shadow-md">
                  <Link href={`/member/catalog/${book.id}`} className="block">
                    <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                      {book.image_url ? (
                        <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                          {t?.catalog?.no_cover}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="space-y-4 p-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                          {book.category?.name ?? t?.catalog?.no_category}
                        </p>
                        {book.is_low_stock && <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">{t?.dashboard?.low_stock}</span>}
                      </div>
                      <Link href={`/member/catalog/${book.id}`} className="mt-2 block">
                        <h2 className="text-xl font-bold text-slate-900">{book.title}</h2>
                      </Link>
                      <p className="mt-2 text-sm text-slate-600">{book.author}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                      <span className="text-slate-500">{t?.form?.stock}</span>
                      <span className={`font-semibold ${book.stock < 5 ? 'text-red-600' : 'text-slate-900'}`}>{book.stock}</span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <button type="button" onClick={() => borrowOne(book)} disabled={book.stock <= 0} className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300">
                        {t?.buttons?.borrow_one}
                      </button>
                      <button type="button" onClick={() => openQuantityModal(book)} disabled={book.stock <= 0} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">
                        {t?.buttons?.borrow_more}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Pagination links={books.links} />
          </>
        )}
      </div>

      {selectedBook && (
        <BorrowModal
          book={selectedBook}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={closeQuantityModal}
          onSubmit={borrowMany}
          t={t}
        />
      )}

      <style>{`.input{border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.12)}`}</style>
    </MemberLayout>
  )
}

function BorrowModal({ book, quantity, setQuantity, onClose, onSubmit, t }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">{t?.buttons?.borrow_more}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{book.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{t?.books?.stock_available} {book.stock}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
            {t?.buttons?.close}
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">{t?.form?.quantity}</label>
          <input type="number" min="1" max={book.stock} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input w-full" />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            {t?.buttons?.cancel}
          </button>
          <button type="button" onClick={onSubmit} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
            {t?.buttons?.borrow}
          </button>
        </div>
      </div>
    </div>
  )
}

function Banner({ tone, children }) {
  const styles =
    tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-700'

  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${styles}`}>{children}</div>
}
