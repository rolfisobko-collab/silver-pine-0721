'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, LogOut, Mail, Package, User } from 'lucide-react'
import { useAuth, statusFromAge } from '@/components/auth-context'
import { AuthForm } from '@/components/account/auth-form'
import { formatPrice } from '@/lib/products'

export function AccountView() {
  const { user, ready, logout, orders } = useAuth()

  if (!ready) {
    return (
      <div className="mx-auto max-w-md px-4">
        <div className="glass h-72 animate-pulse rounded-4xl" />
      </div>
    )
  }

  if (!user) return <AuthForm />

  const recent = orders.slice(0, 2)

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="glass glass-sheen mb-6 flex flex-col gap-5 rounded-4xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {user.name}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="glass glass-hover inline-flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/cuenta/pedidos"
          className="glass glass-sheen glass-hover glass-liquid flex items-center justify-between rounded-3xl p-6"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold">Mis pedidos</div>
              <div className="text-sm text-muted-foreground">
                {orders.length} pedido{orders.length !== 1 && 's'}
              </div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <Link
          href="/catalogo"
          className="glass glass-sheen glass-hover glass-liquid flex items-center justify-between rounded-3xl p-6"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <User className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold">Seguir comprando</div>
              <div className="text-sm text-muted-foreground">
                Explorá el catálogo
              </div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      {recent.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pedidos recientes</h2>
            <Link
              href="/cuenta/pedidos"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recent.map((o) => (
              <div
                key={o.id}
                className="glass glass-sheen flex items-center gap-4 rounded-3xl p-4"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                  <Image
                    src={o.items[0]?.image || '/placeholder.svg'}
                    alt={o.items[0]?.name ?? 'Pedido'}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">
                      #{o.id}
                    </span>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                      {statusFromAge(o.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {o.items.length} artículo{o.items.length !== 1 && 's'} ·{' '}
                    {formatPrice(o.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
