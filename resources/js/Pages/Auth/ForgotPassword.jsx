import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AuthLayout from '../../Layouts/AuthLayout'

export default function ForgotPassword() {
  const { flash = {}, t = {} } = usePage().props
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post('/forgot-password')
  }

  return (
    <AuthLayout>
      <Head title={t?.auth?.forgot_password_title} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">{t?.auth?.member_access}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{t?.auth?.forgot_password_title}</h1>
        <p className="mt-2 text-sm text-slate-600">{t?.auth?.forgot_hint}</p>
      </div>

      {flash.success && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{flash.success}</div>}

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label={t?.form?.email} error={errors.email}>
          <input className="input" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
        </Field>

        <button type="submit" disabled={processing} className="w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60">
          {processing ? t?.common?.sending_otp : t?.auth?.send_otp}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {t?.auth?.need_to_return}{' '}
        <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
          {t?.auth?.back_to_sign_in}
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
