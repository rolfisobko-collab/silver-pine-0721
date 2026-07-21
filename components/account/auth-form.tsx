'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, User } from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { cn } from '@/lib/utils'

export function AuthForm() {
  const { login, register } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res =
      mode === 'login'
        ? login(email, password)
        : register(name, email, password)
    if (!res.ok) {
      setError(res.error ?? 'Ocurrió un error.')
      return
    }
    router.push('/cuenta')
  }

  return (
    <div className="mx-auto max-w-md px-4">
      <div className="glass glass-sheen rounded-4xl p-6 sm:p-8">
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setError(null)
              }}
              className={cn(
                'rounded-full py-2.5 text-sm font-medium transition-colors',
                mode === m
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'login' ? 'Ingresar' : 'Registrarse'}
            </button>
          ))}
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight">
          {mode === 'login' ? 'Bienvenido de vuelta' : 'Creá tu cuenta'}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {mode === 'login'
            ? 'Ingresá para ver tus pedidos y seguir tus envíos.'
            : 'Registrate para comprar más rápido y seguir tus pedidos.'}
        </p>

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
              placeholder="Correo electrónico"
              autoComplete="email"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </FieldWithIcon>
          <FieldWithIcon icon={Lock}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              type="password"
              placeholder="Contraseña"
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </FieldWithIcon>

          {error && (
            <p className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
          >
            {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Demo local: tus datos se guardan solo en este navegador.
        </p>
      </div>
    </div>
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
    <label className="glass flex items-center gap-3 rounded-2xl px-4 py-3 transition-shadow focus-within:ring-2 focus-within:ring-primary/60">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      {children}
    </label>
  )
}
