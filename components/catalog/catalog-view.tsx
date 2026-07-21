'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import {
  categories,
  getSubcategories,
  products,
  type Category,
} from '@/lib/products'
import { cn } from '@/lib/utils'

type SortKey = 'destacado' | 'precio-asc' | 'precio-desc' | 'rating'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'destacado', label: 'Destacados' },
  { key: 'precio-asc', label: 'Precio: menor' },
  { key: 'precio-desc', label: 'Precio: mayor' },
  { key: 'rating', label: 'Mejor valorados' },
]

export function CatalogView({
  initialCategory,
  initialSubcategory,
}: {
  initialCategory?: string
  initialSubcategory?: string
}) {
  const searchParams = useSearchParams()

  const [active, setActive] = useState<Category | 'Todos'>(
    (categories.includes(initialCategory as Category)
      ? (initialCategory as Category)
      : 'Todos') as Category | 'Todos',
  )
  const [sub, setSub] = useState<string | null>(initialSubcategory ?? null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('destacado')

  // Keep filters in sync with the URL (nav mega-menu links).
  useEffect(() => {
    const cat = searchParams.get('cat')
    const s = searchParams.get('sub')
    setActive(
      categories.includes(cat as Category) ? (cat as Category) : 'Todos',
    )
    setSub(s)
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCat = active === 'Todos' || p.category === active
      const matchesSub = !sub || p.subcategory === sub
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return matchesCat && matchesSub && matchesQuery
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'precio-asc':
          return a.price - b.price
        case 'precio-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        default:
          return Number(!!b.featured) - Number(!!a.featured)
      }
    })
    return list
  }, [active, sub, query, sort])

  const filters: (Category | 'Todos')[] = ['Todos', ...categories]
  const subFilters = active !== 'Todos' ? getSubcategories(active) : []

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-8">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {active === 'Todos' ? 'Catálogo' : active}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {sub
            ? `${active} · ${sub}`
            : 'Explorá toda la colección Lumen.'}
        </p>
      </div>

      {/* Controls */}
      <div className="glass glass-sheen sticky top-24 z-30 mb-8 flex flex-col gap-4 rounded-3xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setActive(f)
                setSub(null)
              }}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-40"
              aria-label="Buscar productos"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="glass rounded-full px-4 py-2 text-sm outline-none"
            aria-label="Ordenar"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key} className="bg-popover">
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subcategory chips */}
      {subFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSub(null)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm transition-colors',
              !sub
                ? 'bg-foreground text-background'
                : 'glass glass-hover text-muted-foreground hover:text-foreground',
            )}
          >
            Todo {active}
          </button>
          {subFilters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSub(s)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm transition-colors',
                sub === s
                  ? 'bg-foreground text-background'
                  : 'glass glass-hover text-muted-foreground hover:text-foreground',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length} producto{filtered.length !== 1 && 's'}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl p-16 text-center text-muted-foreground">
          No encontramos productos con esos filtros.
        </div>
      )}
    </div>
  )
}
