'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { formatPrice } from '@/lib/products'

export function CartView() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const shipping = subtotal > 99 || subtotal === 0 ? 0 : 15
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass glass-sheen flex flex-col items-center gap-4 rounded-4xl p-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-semibold">Tu carrito está vacío</h1>
          <p className="max-w-sm text-muted-foreground">
            Todavía no agregaste productos. Explorá la colección Lumen y
            encontrá tu próximo dispositivo.
          </p>
          <Link
            href="/catalogo"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Ir a la tienda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="mb-8 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Tu carrito
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.color}`}
              className="glass glass-sheen flex gap-4 rounded-3xl p-4"
            >
              <Link
                href={`/producto/${item.product.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white/5"
              >
                <Image
                  src={item.product.image || '/placeholder.svg'}
                  alt={item.product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/producto/${item.product.slug}`}
                      className="font-semibold leading-tight"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {item.color}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id, item.color)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-destructive"
                    aria-label={`Quitar ${item.product.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="glass flex items-center gap-1 rounded-full p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.color,
                          item.quantity - 1,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                      aria-label="Disminuir"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.color,
                          item.quantity + 1,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                      aria-label="Aumentar"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <div className="glass glass-sheen rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Resumen</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Envío</dt>
                <dd>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Impuestos (10%)</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Finalizar compra
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/catalogo"
              className="mt-3 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
