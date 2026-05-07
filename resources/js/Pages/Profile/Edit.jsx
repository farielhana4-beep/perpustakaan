import { Head, useForm, usePage } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../Layouts/AdminLayout'
import MemberLayout from '../../Layouts/MemberLayout'

export default function Edit() {
  const { auth = {}, t = {}, locale = 'id' } = usePage().props
  const user = auth?.user
  const Layout = user?.role === 'member' ? MemberLayout : AdminLayout

  const profileForm = useForm({
    name: user?.name ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    bio: user?.bio ?? '',
  })
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const avatarForm = useForm({
    avatar: null,
  })

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url ?? null)

  useEffect(() => {
    setAvatarPreview(user?.avatar_url ?? null)
  }, [user?.avatar_url])

  const avatarObjectUrl = useMemo(() => {
    if (!avatarForm.data.avatar) {
      return null
    }

    return URL.createObjectURL(avatarForm.data.avatar)
  }, [avatarForm.data.avatar])

  useEffect(() => {
    if (!avatarObjectUrl) {
      return
    }

    setAvatarPreview(avatarObjectUrl)

    return () => URL.revokeObjectURL(avatarObjectUrl)
  }, [avatarObjectUrl])

  const submitProfile = (event) => {
    event.preventDefault()
    profileForm.put('/profile', { preserveScroll: true })
  }

  const submitPassword = (event) => {
    event.preventDefault()
    passwordForm.put('/profile/password', { preserveScroll: true, onSuccess: () => passwordForm.reset() })
  }

  const submitAvatar = (event) => {
    event.preventDefault()
    avatarForm.post('/profile/avatar', {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => avatarForm.reset('avatar'),
    })
  }

  return (
    <Layout>
      <Head title={t?.profile?.title} />

      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 p-8 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_36%)]" />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">{t?.profile?.title}</p>
                  <h1 className="mt-3 text-3xl font-bold">{t?.profile?.hero_title}</h1>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{t?.profile?.hero_description}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MiniStat label={t?.profile?.full_name} value={user?.name || '-'} />
                  <MiniStat label={t?.profile?.username} value={user?.username || '-'} />
                  <MiniStat label={t?.profile?.email} value={user?.email || '-'} />
                  <MiniStat label={t?.profile?.updated_at} value={formatDate(user?.updated_at, locale)} />
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col items-center gap-5 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <div className="relative">
                  <AvatarPreview src={avatarPreview} name={user?.name} />
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-sky-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg">
                    {t?.profile?.avatar}
                  </div>
                </div>
                <form onSubmit={submitAvatar} className="w-full space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">{t?.profile?.change_avatar}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => avatarForm.setData('avatar', event.target.files?.[0] ?? null)}
                      className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={avatarForm.processing || !avatarForm.data.avatar}
                    className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {avatarForm.processing ? t?.common?.saving : t?.profile?.save_avatar}
                  </button>
                  <button
                    type="button"
                    onClick={() => avatarForm.delete('/profile/avatar', { preserveScroll: true })}
                    disabled={!user?.avatar_path || avatarForm.processing}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {t?.profile?.remove_avatar}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">{t?.profile?.account_details}</h2>
              <p className="mt-1 text-sm text-slate-500">{t?.profile?.account_hint}</p>
            </div>

            <form onSubmit={submitProfile} className="space-y-5">
              <Field label={t?.profile?.full_name} error={profileForm.errors.name}>
                <input className="input" value={profileForm.data.name} onChange={(event) => profileForm.setData('name', event.target.value)} />
              </Field>

              <Field label={t?.profile?.username} error={profileForm.errors.username}>
                <input className="input" value={profileForm.data.username} onChange={(event) => profileForm.setData('username', event.target.value)} />
              </Field>

              <Field label={t?.profile?.email} error={profileForm.errors.email}>
                <input className="input" type="email" value={profileForm.data.email} onChange={(event) => profileForm.setData('email', event.target.value)} />
              </Field>

              <Field label={t?.profile?.bio} error={profileForm.errors.bio}>
                <textarea
                  className="input min-h-32 resize-y"
                  value={profileForm.data.bio}
                  onChange={(event) => profileForm.setData('bio', event.target.value)}
                />
              </Field>

              <button
                type="submit"
                disabled={profileForm.processing}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {profileForm.processing ? t?.common?.saving : t?.profile?.save_profile}
              </button>
            </form>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">{t?.profile?.security_title}</h2>
              <p className="mt-1 text-sm text-slate-500">{t?.profile?.security_hint}</p>
            </div>

            <form onSubmit={submitPassword} className="space-y-5">
              <Field label={t?.profile?.current_password} error={passwordForm.errors.current_password}>
                <input className="input" type="password" value={passwordForm.data.current_password} onChange={(event) => passwordForm.setData('current_password', event.target.value)} />
              </Field>

              <Field label={t?.profile?.new_password} error={passwordForm.errors.password}>
                <input className="input" type="password" value={passwordForm.data.password} onChange={(event) => passwordForm.setData('password', event.target.value)} />
              </Field>

              <Field label={t?.profile?.confirm_password} error={passwordForm.errors.password_confirmation}>
                <input className="input" type="password" value={passwordForm.data.password_confirmation} onChange={(event) => passwordForm.setData('password_confirmation', event.target.value)} />
              </Field>

              <button
                type="submit"
                disabled={passwordForm.processing}
                className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordForm.processing ? t?.common?.saving : t?.profile?.change_password}
              </button>
            </form>
          </section>
        </div>
      </div>

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:1rem;padding:0.85rem 1rem;outline:none;transition:all .15s ease;background:white}.input:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(14,165,233,.12)}`}</style>
    </Layout>
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

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function AvatarPreview({ src, name }) {
  if (src) {
    return <img src={src} alt={name} className="h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-xl" />
  }

  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-900 text-3xl font-bold text-white ring-4 ring-white shadow-xl">
      {name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  )
}

function formatDate(value, locale) {
  if (!value) return '-'

  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
