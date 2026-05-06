import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AuthLayout from '../../Layouts/AuthLayout'

export default function Login() {
  const { t = {} } = usePage().props
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const submit = (e) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <AuthLayout>
      <Head title={t?.auth?.sign_in} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">{t?.common?.library_system}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{t?.auth?.sign_in}</h1>
        <p className="mt-2 text-sm text-slate-600">{t?.auth?.sign_in_hint}</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label={t?.form?.email} error={errors.email}>
          <input className="input" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
        </Field>
        <Field label={t?.form?.password} error={errors.password}>
          <input className="input" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
          {t?.auth?.remember_me}
        </label>
        <button type="submit" disabled={processing} className="w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60">
          {processing ? t?.common?.signing_in : t?.auth?.sign_in}
        </button>
      </form>

      <div className="mt-4 text-right">
        <Link href="/forgot-password" className="text-sm font-medium text-sky-500 hover:text-sky-600">
          {t?.auth?.forgot_password}
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        {t?.auth?.new_here}{' '}
        <Link href="/register" className="font-semibold text-sky-700 hover:text-sky-800">
          {t?.auth?.create_account}
        </Link>
      </p>

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:0.75rem;padding:0.75rem 1rem;outline:none;transition:all .15s ease}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </AuthLayout>
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
