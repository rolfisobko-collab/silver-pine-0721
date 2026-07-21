'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Star } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { formatPrice, type Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className="glass glass-sheen glass-hover glass-liquid group flex flex-col overflow-hidden rounded-3xl">
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        <div className="absolute left-3 top-3 z-10 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-md">
          {product.subcategory}
        </div>
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <Link href={`/producto/${product.slug}`} className="mt-1">
          <h3 className="text-base font-semibold leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
          {product.tagline}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => addItem(product, product.colors[0], 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
