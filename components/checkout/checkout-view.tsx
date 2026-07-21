'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Check, CreditCard, Lock } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { formatPrice } from '@/lib/products'

function Field({
  label,
  id,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        id={id}
        required
        {...props}
        className="glass w-full rounded-2xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/60"
      />
    </label>
  )
}

export function CheckoutView() {
  const { items, subtotal, clear } = useCart()
  const [done, setDone] = useState(false)

  const shipping = subtotal > 99 || subtotal === 0 ? 0 : 15
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + shipping + tax

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDone(true)
    clear()
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4">
        <div className="glass glass-sheen flex flex-col items-center gap-4 rounded-4xl p-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="text-3xl font-semibold">¡Pedido confirmado!</h1>
          <p className="max-w-sm text-muted-foreground">
            Gracias por tu compra. Te enviamos un correo con los detalles y el
            seguimiento de tu envío.
          </p>
          <Link
            href="/catalogo"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4">
        <div className="glass glass-sheen flex flex-col items-center gap-4 rounded-4xl p-16 text-center">
          <h1 className="text-2xl font-semibold">No hay nada para pagar</h1>
          <p className="text-muted-foreground">
            Agregá productos a tu carrito antes de continuar.
          </p>
          <Link
            href="/catalogo"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="mb-8 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"
      >
        <div className="flex flex-col gap-4">
          {/* Contact */}
          <fieldset className="glass glass-sheen rounded-3xl p-6">
            <legend className="px-2 text-sm font-semibold">Contacto</legend>
            <div className="mt-2 grid gap-4">
              <Field
                label="Correo electrónico"
                id="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>
          </fieldset>

          {/* Shipping */}
          <fieldset className="glass glass-sheen rounded-3xl p-6">
            <legend className="px-2 text-sm font-semibold">Envío</legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" id="first" placeholder="Juan" autoComplete="given-name" />
              <Field label="Apellido" id="last" placeholder="Pérez" autoComplete="family-name" />
              <div className="sm:col-span-2">
                <Field
                  label="Dirección"
                  id="address"
                  placeholder="Av. Siempre Viva 742"
                  autoComplete="street-address"
                />
              </div>
              <Field label="Ciudad" id="city" placeholder="Buenos Aires" autoComplete="address-level2" />
              <Field label="Código postal" id="zip" placeholder="1000" autoComplete="postal-code" />
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset className="glass glass-sheen rounded-3xl p-6">
            <legend className="flex items-center gap-1.5 px-2 text-sm font-semibold">
              <CreditCard className="h-4 w-4" /> Pago
            </legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Número de tarjeta"
                  id="card"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  autoComplete="cc-number"
                />
              </div>
              <Field label="Vencimiento" id="exp" placeholder="MM/AA" autoComplete="cc-exp" />
              <Field label="CVC" id="cvc" inputMode="numeric" placeholder="123" autoComplete="cc-csc" />
            </div>
          </fieldset>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <div className="glass glass-sheen rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Tu pedido</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.color}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
                    <Image
                      src={item.product.image || '/placeholder.svg'}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.color}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Envío</dt>
                <dd>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Impuestos</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2.5 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Lock className="h-4 w-4" />
              Pagar {formatPrice(total)}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> Pago seguro y encriptado
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
