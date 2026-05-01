import { Head, Link, useForm } from '@inertiajs/react'
import AuthLayout from '../../Layouts/AuthLayout'

export default function Login() {
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
      <Head title="Login" />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Library System</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Use your role account to enter the correct dashboard.</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Email" error={errors.email}>
          <input className="input" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
        </Field>
        <Field label="Password" error={errors.password}>
          <input className="input" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
          Remember me
        </label>
        <button type="submit" disabled={processing} className="w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60">
          {processing ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 text-right">
        <Link href="/forgot-password" className="text-sm font-medium text-sky-500 hover:text-sky-600">
          Forgot password?
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        New here?{' '}
        <Link href="/register" className="font-semibold text-sky-700 hover:text-sky-800">
          Create an account
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
