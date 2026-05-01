import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AuthLayout from '../../Layouts/AuthLayout'

export default function ResetPassword({ token = '', email = '' }) {
  const { flash = {} } = usePage().props
  const { data, setData, post, processing, errors } = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post('/reset-password')
  }

  return (
    <AuthLayout>
      <Head title="Reset Password" />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Member Access</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600">Set a new password for your member account.</p>
      </div>

      {flash.success && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {flash.success}
        </div>
      )}

      <form onSubmit={submit} className="mt-8 space-y-5">
        <input type="hidden" value={data.token} />

        <Field label="Email" error={errors.email}>
          <input
            className="input"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <input
            className="input"
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
          />
        </Field>

        <Field label="Confirm Password" error={errors.password_confirmation}>
          <input
            className="input"
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
          />
        </Field>

        <button
          type="submit"
          disabled={processing}
          className="w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {processing ? 'Resetting...' : 'Reset password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Need to return?{' '}
        <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
          Back to sign in
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
