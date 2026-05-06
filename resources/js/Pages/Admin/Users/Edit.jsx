import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '../../../Layouts/AdminLayout'

export default function Edit({ user }) {
  const page = usePage()
  const { flash = {}, t = {} } = page.props
  const { data, setData, put, processing, errors } = useForm({
    name: user.name ?? '',
    email: user.email ?? '',
    role: user.role ?? 'member',
    password: '',
  })

  const submit = (e) => {
    e.preventDefault()
    put(`/admin/users/${user.id}`)
  }

  return (
    <AdminLayout>
      <Head title={`${t?.users?.edit_title} ${user.name}`} />
      <FormShell
        title={t?.users?.edit_title}
        href="/admin/users"
        flash={flash}
        onSubmit={submit}
        processing={processing}
        errors={errors}
        data={data}
        setData={setData}
        submitLabel={t?.users?.update_button}
        t={t}
      />
    </AdminLayout>
  )
}

function FormShell({ title, href, flash, onSubmit, processing, errors, data, setData, submitLabel, t = {} }) {
  return (
    <div className="mx-auto max-w-2xl">
      {flash.success && <Flash>{flash.success}</Flash>}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">{t?.users?.title}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        </div>
        <Link href={href} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          {t?.buttons?.back}
        </Link>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <Field label={t?.form?.name} error={errors.name}>
            <input className="input" value={data.name} onChange={(e) => setData('name', e.target.value)} />
          </Field>
          <Field label={t?.form?.email} error={errors.email}>
            <input className="input" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
          </Field>
          <Field label={t?.form?.role} error={errors.role}>
            <select className="input" value={data.role} onChange={(e) => setData('role', e.target.value)}>
              <option value="super_admin">{t?.roles?.super_admin}</option>
              <option value="pustakawan">{t?.roles?.pustakawan}</option>
              <option value="member">{t?.roles?.member}</option>
            </select>
          </Field>
          <Field label={t?.form?.password} error={errors.password}>
            <input className="input" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder={t?.users?.leave_blank} />
          </Field>
        </div>
        <button type="submit" disabled={processing} className="mt-6 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60">
          {processing ? t?.common?.updating : submitLabel}
        </button>
      </form>
      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function Flash({ children }) {
  return <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{children}</div>
}
