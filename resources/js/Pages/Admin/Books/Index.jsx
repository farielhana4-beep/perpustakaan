import { Head, Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/AdminLayout'

export default function Index({ books }) {
  const { flash = {} } = usePage().props

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
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Books</h1>
            <p className="mt-2 text-sm text-slate-600">Manage title, author, category, and stock.</p>
          </div>

          <Link
            href="/admin/books/create"
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Add Book
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-14 text-center text-sm text-slate-500">
                      No books yet.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
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
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{book.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{book.author}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{book.category?.name ?? '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{book.stock}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
