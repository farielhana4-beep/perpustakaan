import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AuthLayout from '../../Layouts/AuthLayout'

export default function Register() {
  const { t = {} } = usePage().props
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post('/register')
  }

  return (
    <AuthLayout>
      <Head title={t?.auth?.register_title ?? t?.auth?.register} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">{t?.common?.library_system}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{t?.auth?.register}</h1>
        <p className="mt-2 text-sm text-slate-600">{t?.auth?.register_hint}</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label={t?.form?.name} error={errors.name}>
          <input className="input" value={data.name} onChange={(e) => setData('name', e.target.value)} />
        </Field>
        <Field label={t?.form?.email} error={errors.email}>
          <input className="input" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
        </Field>
        <Field label={t?.form?.password} error={errors.password}>
          <input className="input" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
        </Field>
        <Field label={t?.form?.confirm_password} error={errors.password_confirmation}>
          <input className="input" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
        </Field>

        <button type="submit" disabled={processing} className="w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
          {processing ? t?.common?.creating_account : t?.auth?.register}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {t?.auth?.already_have_account}{' '}
        <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
          {t?.auth?.login}
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
