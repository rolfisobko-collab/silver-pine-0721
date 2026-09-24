'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { useAuth } from '@/components/auth-context'
import { cn } from '@/lib/utils'

export function AuthForm() {
  const { login, loginWithGoogle, register, resetPassword } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setLoading(true)
    if (mode === 'reset') {
      const resetRes = await resetPassword(email)
      setLoading(false)
      if (!resetRes.ok) {
        setError(resetRes.error ?? 'No pudimos enviar el correo.')
        return
      }
      setNotice('Te enviamos un correo para recuperar tu contrasena.')
      return
    }

    const res = mode === 'login' ? await login(email, password) : await register(name, email, password)
    setLoading(false)
    if (!res.ok) {
      setError(res.error ?? 'No pudimos iniciar sesion.')
      return
    }
    router.push('/')
  }

  async function handleGoogleLogin() {
    setError(null)
    setNotice(null)
    setLoading(true)
    const res = await loginWithGoogle()
    setLoading(false)
    if (!res.ok) {
      setError(res.error ?? 'No pudimos iniciar con Google.')
      return
    }
    if (res.redirecting) return
    router.push('/')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070c] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/alta-brand/bg-links-glass.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(239,35,60,0.34),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(56,189,248,0.22),transparent_28%),linear-gradient(180deg,rgba(5,7,12,0.36),rgba(5,7,12,0.92))]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 animate-pulse rounded-full bg-primary/22 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-14 h-80 w-80 rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <div className="flex items-center justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/76 backdrop-blur-xl transition-colors hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <section className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/16 bg-[#0d111a]/72 p-5 shadow-[0_32px_110px_-44px_rgba(0,0,0,0.98)] backdrop-blur-2xl sm:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/22 blur-3xl" />
            <div className="relative">
              <div className="mb-6 flex justify-center">
                <div className="inline-flex rounded-[1.45rem] bg-white px-5 py-3 shadow-[0_22px_58px_-34px_rgba(255,255,255,0.88)] ring-1 ring-white/80">
                  <BrandMark className="h-14 w-32 [&_img]:object-center" />
                </div>
              </div>
              <h1 className="text-center text-3xl font-semibold tracking-tight">
                {mode === 'login'
                  ? 'Bienvenido de nuevo'
                  : mode === 'register'
                    ? 'Crea tu cuenta'
                    : 'Recupera tu cuenta'}
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-white/62">
                {mode === 'login'
                  ? 'Entra para ver tus pedidos, datos guardados y puntos Alta.'
                  : mode === 'register'
                    ? 'Guarda tus compras, suma puntos y acelera tus proximos pedidos.'
                    : 'Escribe tu correo y te mandamos un enlace para crear una nueva contrasena.'}
              </p>
            </div>

            <div className="mb-6 mt-7 grid grid-cols-2 gap-1 rounded-full bg-white/8 p-1 ring-1 ring-white/10">
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m)
                    setError(null)
                    setNotice(null)
                  }}
                  className={cn(
                    'rounded-full py-2.5 text-sm font-semibold transition-colors',
                    mode === m
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                      : 'text-white/58 hover:text-white',
                  )}
                >
                  {m === 'login' ? 'Ingresar' : 'Crear cuenta'}
                </button>
              ))}
            </div>

            {mode !== 'reset' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/14 bg-white px-5 py-3.5 text-sm font-bold text-[#1f2937] shadow-[0_20px_48px_-34px_rgba(255,255,255,0.75)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f8fafc] hover:shadow-[0_24px_58px_-32px_rgba(255,255,255,0.9)] disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-105">
                    <GoogleLogo />
                  </span>
                  Continuar con Google
                </button>

                <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/38">
                  <span className="h-px flex-1 bg-white/12" />
                  O usa tu correo
                  <span className="h-px flex-1 bg-white/12" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {mode === 'register' && (
                <FieldWithIcon icon={User}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nombre completo"
                    autoComplete="name"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </FieldWithIcon>
              )}
              <FieldWithIcon icon={Mail}>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="Correo electronico"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </FieldWithIcon>
              {mode !== 'reset' && (
                <FieldWithIcon icon={Lock}>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contrasena"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </FieldWithIcon>
              )}

              {error && (
                <p className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              )}
              {notice && (
                <p className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-100">
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_18px_42px_-22px_rgba(229,0,31,0.9)] transition-transform hover:scale-[1.01] active:scale-95 disabled:cursor-wait disabled:opacity-70"
              >
                {loading
                  ? 'Procesando...'
                  : mode === 'login'
                    ? 'Ingresar'
                    : mode === 'register'
                      ? 'Crear cuenta'
                      : 'Enviar enlace'}
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset')
                    setError(null)
                    setNotice(null)
                  }}
                  className="text-center text-sm font-semibold text-white/62 transition-colors hover:text-white"
                >
                  Olvide mi contrasena
                </button>
              )}
              {mode === 'reset' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError(null)
                    setNotice(null)
                  }}
                  className="text-center text-sm font-semibold text-white/62 transition-colors hover:text-white"
                >
                  Volver al inicio de sesion
                </button>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}

function FieldWithIcon({
  icon: Icon,
  children,
}: {
  icon: typeof User
  children: React.ReactNode
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white shadow-sm backdrop-blur-xl transition duration-200 focus-within:border-primary/40 focus-within:bg-white/14 focus-within:ring-2 focus-within:ring-primary/45">
      <Icon className="h-4 w-4 shrink-0 text-white/50" />
      {children}
    </label>
  )
}
