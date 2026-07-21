'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Package, Truck, Home, ClipboardCheck } from 'lucide-react'
import {
  useAuth,
  statusFromAge,
  trackingSteps,
  type OrderStatus,
} from '@/components/auth-context'
import { formatPrice } from '@/lib/products'

const stepIcons: Record<OrderStatus, typeof Check> = {
  Confirmado: ClipboardCheck,
  Preparando: Package,
  Enviado: Truck,
  Entregado: Home,
}

export function OrdersView() {
  const { user, ready, orders } = useAuth()

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <div className="glass h-72 animate-pulse rounded-4xl" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="glass glass-sheen rounded-4xl p-8">
          <h1 className="text-xl font-semibold">Iniciá sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Necesitás una cuenta para ver el seguimiento de tus pedidos.
          </p>
          <Link
            href="/cuenta"
            className="mt-5 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Ir a mi cuenta
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mis pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Seguí el estado de tus envíos en tiempo real.
          </p>
        </div>
        <Link
          href="/cuenta"
          className="text-sm font-medium text-primary hover:underline"
        >
          Volver
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="glass glass-sheen rounded-4xl p-10 text-center">
          <p className="text-muted-foreground">
            Todavía no tenés pedidos.
          </p>
          <Link
            href="/catalogo"
            className="mt-5 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            const current = statusFromAge(order.createdAt)
            const currentIndex = trackingSteps.indexOf(current)
            return (
              <div
                key={order.id}
                className="glass glass-sheen rounded-4xl p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">#{order.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    {current}
                  </span>
                </div>

                {/* Tracking timeline */}
                <div className="mt-6 flex items-center">
                  {trackingSteps.map((step, i) => {
                    const Icon = stepIcons[step]
                    const done = i <= currentIndex
                    return (
                      <div key={step} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={[
                              'flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                              done
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-secondary text-muted-foreground',
                            ].join(' ')}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span
                            className={[
                              'text-[10px] font-medium sm:text-xs',
                              done ? 'text-foreground' : 'text-muted-foreground',
                            ].join(' ')}
                          >
                            {step}
                          </span>
                        </div>
                        {i < trackingSteps.length - 1 && (
                          <span
                            className={[
                              'mx-1 mb-5 h-0.5 flex-1 rounded-full transition-colors',
                              i < currentIndex ? 'bg-primary' : 'bg-border',
                            ].join(' ')}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Items */}
                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.color} · x{item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">
                    Envío a {order.city}
                  </span>
                  <span className="font-semibold">
                    Total {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
