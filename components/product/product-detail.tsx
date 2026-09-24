'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Check, ChevronLeft, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { Price } from '@/components/ui/price'
import { type Product } from '@/lib/products'
import { cn } from '@/lib/utils'

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [color, setColor] = useState(product.colors[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const hasStock = Number(product.quantity ?? product.stock ?? 0) > 0
  const hasPrice = Number(product.price || 0) > 0

  function handleAdd() {
    if (!hasPrice) return
    addItem(product, color, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="glass relative aspect-square overflow-hidden rounded-4xl bg-white">
          <div className="hidden">
            {product.category} · {product.subcategory}
          </div>
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2">
            <span className="max-w-full truncate rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md">
              {product.category}
              {product.subcategory && product.subcategory !== product.category ? ` - ${product.subcategory}` : ''}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.round(product.rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground/40',
                  )}
                />
              ))}
            </div>
            <span className="text-foreground">{product.rating}</span>
            <span className="text-muted-foreground">
              ({product.reviews} reseñas)
            </span>
          </div>

          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-lg text-primary">{product.tagline}</p>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6 text-4xl font-semibold">
            {hasPrice ? <Price value={product.price} /> : 'Consultar precio'}
          </div>
          <div className={hasStock ? 'mt-2 text-sm font-semibold text-emerald-600' : 'mt-2 text-sm font-semibold text-amber-600'}>
            {hasStock ? 'Disponible' : 'Sin stock'}
          </div>

          {/* Colors */}
          <div className="mt-6">
            <div className="mb-2 text-sm font-medium">
              Color: <span className="text-muted-foreground">{color}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm transition-colors',
                    color === c
                      ? 'bg-primary text-primary-foreground'
                      : 'glass text-muted-foreground hover:text-foreground',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add */}
          <div className="mt-6 flex items-center gap-3">
            <div className="glass flex items-center gap-1 rounded-full p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary"
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary"
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!hasPrice}
              className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? (
                <>
                  <Check className="h-4.5 w-4.5" /> Añadido
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4.5 w-4.5" /> Agregar al carrito
                </>
              )}
            </button>
          </div>

          {/* Highlights */}
          <div className="glass glass-sheen mt-8 rounded-3xl p-6">
            <h2 className="mb-4 text-sm font-semibold">Características clave</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.highlights.map((h, index) => (
                <li key={`${h}-${index}`} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-muted-foreground">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
