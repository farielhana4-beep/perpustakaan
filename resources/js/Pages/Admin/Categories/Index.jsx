import { Head, Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/AdminLayout'

export default function Index({ categories }) {
  const { flash = {} } = usePage().props

  const handleDelete = (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return
    router.delete(`/admin/categories/${category.id}`)
  }

  return (
    <AdminLayout>
      <Head title="Categories" />
      <div className="mx-auto max-w-7xl">
        {flash.success && <Alert>{flash.success}</Alert>}
        <Header
          title="Categories"
          subtitle="Organize your catalog into clean groups."
          actionHref="/admin/categories/create"
          actionLabel="Add Category"
        />
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
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
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-14 text-center text-sm text-slate-500">
                    No categories yet.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <Td>{category.name}</Td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <SharedStyles />
    </AdminLayout>
  )
}

function Header({ title, subtitle, actionHref, actionLabel }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Library</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      </div>
      <Link href={actionHref} className="btn-primary">
        {actionLabel}
      </Link>
    </div>
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

function SharedStyles() {
  return (
    <style>{`.btn-primary{border-radius:0.75rem;background:#0284c7;padding:0.75rem 1.25rem;font-size:0.875rem;font-weight:600;color:#fff;transition:all .15s ease}.btn-primary:hover{background:#0369a1}.btn-secondary{border-radius:0.5rem;border:1px solid #cbd5e1;padding:.5rem 1rem;font-size:.875rem;font-weight:600;color:#334155;transition:all .15s ease}.btn-secondary:hover{background:#f8fafc}.btn-danger{border-radius:0.5rem;border:1px solid #fecaca;padding:.5rem 1rem;font-size:.875rem;font-weight:600;color:#dc2626;transition:all .15s ease}.btn-danger:hover{background:#fef2f2}`}</style>
  )
}
