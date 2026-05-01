import { Head, Link, router, usePage } from '@inertiajs/react'
import { EmptyState, TableSkeleton } from '../../../Components/DataStates'
import FilterToolbar from '../../../Components/FilterToolbar'
import Pagination from '../../../Components/Pagination'
import useIndexFilters from '../../../Hooks/useIndexFilters'
import AdminLayout from '../../../Layouts/AdminLayout'

const defaultFilters = {
  search: '',
  role: '',
  sort: 'latest',
}

export default function Index(props) {
  const { flash = {} } = usePage().props
  const { users = { data: [] }, filters = {}, roles = [] } = props ?? {}
  const safeUsers = users ?? { data: [], links: [] }
  const safeRoles = roles ?? []
  const usersData = safeUsers?.data ?? []

  const { data, setData, applyFilters, resetFilters, isLoading } = useIndexFilters({
    url: '/admin/users',
    defaults: defaultFilters,
    filters,
  })
  console.log('DATA:', safeUsers)

  if (!safeUsers || !safeUsers.data) {
    return <div>Loading...</div>
  }

  const handleDelete = (user) => {
    if (!window.confirm(`Delete "${user.name}"?`)) return
    router.delete(`/admin/users/${user.id}`)
  }

  return (
    <AdminLayout>
      <Head title="Users" />
      <div className="mx-auto max-w-7xl">
        {flash.success && <Flash>{flash.success}</Flash>}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Users</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
              {isLoading && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Updating...</span>}
            </div>
            <p className="mt-2 text-sm text-slate-600">Create, filter, and manage accounts for every library role.</p>
          </div>

          <Link
            href="/admin/users/create"
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Add User
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
            placeholder="Search name or email..."
            value={data.search}
            onChange={(e) => setData('search', e.target.value)}
            className="w-72 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />

          <select
            value={data.role}
            onChange={(e) => setData('role', e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            {safeRoles.map((role) => (
              <option key={role.value || 'all'} value={role.value}>
                {role.label}
              </option>
            ))}
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

        {isLoading && usersData.length === 0 ? (
          <TableSkeleton rows={6} columns={4} />
        ) : usersData?.length === 0 ? (
          <>
            <EmptyState title="No users found" description="Try another keyword, role, or reset the filters." />
            <div className="py-10 text-center text-gray-400">No data found</div>
          </>
        ) : (
          <>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                <p>
                  Showing <span className="font-semibold text-slate-700">{safeUsers.from ?? 0}</span> to{' '}
                  <span className="font-semibold text-slate-700">{safeUsers.to ?? 0}</span> of{' '}
                  <span className="font-semibold text-slate-700">{safeUsers.total ?? usersData.length}</span> users
                </p>
              </div>

              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th align="right">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {usersData?.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <Td>
                        <HighlightedText text={user.name} search={data.search} />
                      </Td>
                      <Td>
                        <HighlightedText text={user.email} search={data.search} />
                      </Td>
                      <Td>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                          {(user.role ?? '-').replace('_', ' ')}
                        </span>
                      </Td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
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

            <Pagination links={safeUsers.links ?? []} />
          </>
        )}
      </div>
    </AdminLayout>
  )
}

function Flash({ children }) {
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
