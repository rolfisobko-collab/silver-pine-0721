'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Star } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { Price } from '@/components/ui/price'
import { type Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const router = useRouter()
  const href = `/producto/${encodeURIComponent(product.id)}`
  const hasStock = Number(product.quantity ?? product.stock ?? 0) > 0
  const hasPrice = Number(product.price || 0) > 0

  function openProduct() {
    router.push(href)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openProduct()
        }
      }}
      className="glass glass-hover group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl outline-none transition focus-visible:ring-4 focus-visible:ring-primary/25 sm:rounded-3xl"
      aria-label={`Ver detalle de ${product.name}`}
    >
      <div className="relative block aspect-square overflow-hidden bg-white">
        <div className="absolute left-3 top-3 z-10 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-md">
          {product.subcategory}
        </div>
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.025] sm:p-4"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <Link
          href={href}
          onClick={(event) => event.stopPropagation()}
          className="mt-1"
        >
          <h3 className="truncate text-sm font-semibold leading-tight sm:text-base">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-2 min-h-9 text-xs text-muted-foreground sm:line-clamp-1 sm:min-h-0 sm:text-sm">
          {product.tagline}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="min-w-0">
            <span className="block truncate text-base font-semibold sm:text-lg">
              {hasPrice ? <Price value={product.price} /> : 'Consultar precio'}
            </span>
            <span className={hasStock ? 'text-xs font-semibold text-emerald-600' : 'text-xs font-semibold text-amber-600'}>
              {hasStock ? 'Disponible' : 'Sin stock'}
            </span>
          </div>
          <button
            type="button"
            disabled={!hasPrice}
            onClick={(event) => {
              event.stopPropagation()
              if (!hasPrice) return
              addItem(product, product.colors[0], 1)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </article>
  )
}
