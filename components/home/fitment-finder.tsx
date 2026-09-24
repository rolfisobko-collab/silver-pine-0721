'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import { CategoryTreeSelect } from '@/components/ui/category-tree-select'
import { LiquidSelect } from '@/components/ui/liquid-select'
import { categoryTree as fallbackCategoryTree, type Product } from '@/lib/products'

export type FinderProduct = Pick<Product, 'category' | 'name' | 'subcategory'> & {
  barcode?: string
  brand?: string
  context?: string
  deviceBrand?: string
  deviceModel?: string
  highlights?: string[]
  partBrand?: string
  sku?: number | null
  tags?: string[]
  tagline?: string
}

export const phoneBrands = ['APPLE', 'SAMSUNG', 'MOTOROLA', 'XIAOMI', 'REDMI', 'HUAWEI', 'HONOR', 'INFINIX', 'TECNO', 'LG']
const fallbackBrands = ['APPLE', 'SAMSUNG', 'MOTOROLA', 'XIAOMI', 'REDMI']
export const preferredParts = ['MODULO', 'BATERIA', 'GLASS', 'FLEX DE CARGA', 'TAPA', 'CAMARA', 'SPEAKER', 'PLACA DE CARGA']
export const partCategoryMap: Record<string, string> = {
  MODULO: 'Modulos',
  BATERIA: 'Baterías',
  GLASS: 'Glass',
  'FLEX DE CARGA': 'Flex de Carga',
  TAPA: 'Tapas',
  CAMARA: 'Camaras',
  SPEAKER: 'Speakers',
  'PLACA DE CARGA': 'Placa de Carga',
}

export function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, 'es', { numeric: true }),
  )
}

export function normalized(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

export function productText(product: FinderProduct) {
  return normalized(
    [
      product.name,
      product.category,
      product.subcategory,
      product.brand,
      product.partBrand,
      product.deviceBrand,
      product.deviceModel,
      product.sku,
      product.barcode,
      product.context,
      product.tagline,
      ...(product.tags ?? []),
      ...(product.highlights ?? []),
    ].filter(Boolean).join(' '),
  )
}

export function inferBrand(product: FinderProduct) {
  const explicitBrand = normalized(String(product.deviceBrand || '').trim())
  if (explicitBrand) return explicitBrand
  const text = productText(product)
  if (/\b(IPHONE|IPAD|AIRPODS|APPLE)\b/.test(text) || /\bIP\s?\d{1,2}\b/.test(text)) return 'APPLE'
  if (/\b(SAMSUNG|GALAXY)\b/.test(text) || /\b(A0\d|A1\d|A2\d|A3\d|A5\d|A7\d|S2\d|J\d)\b/.test(text)) return 'SAMSUNG'
  if (/\b(MOTOROLA|MOTO)\b/.test(text)) return 'MOTOROLA'
  if (/\b(REDMI|POCO)\b/.test(text)) return 'REDMI'
  if (/\b(XIAOMI|MI\s?\d)\b/.test(text)) return 'XIAOMI'
  if (/\b(HUAWEI|HONOR|INFINIX|TECNO|LG)\b/.test(text)) {
    return phoneBrands.find((brandName) => text.includes(brandName)) || ''
  }
  return ''
}

export function inferModel(product: FinderProduct, brand: string) {
  const explicitModel = normalized(product.deviceModel || '')
  if (explicitModel) return explicitModel
  const text = productText(product)
  if (brand === 'APPLE') {
    const match = text.match(/\b(?:IPHONE|IP)\s*(X[RS]?|SE|[6-9]|1[0-7])\s*(PRO MAX|PRO|PLUS|MINI|PROMAX)?\b/)
    return match ? `IPHONE ${match[1]}${match[2] ? ` ${match[2].replace('PROMAX', 'PRO MAX')}` : ''}` : ''
  }
  if (brand === 'SAMSUNG') {
    const match = text.match(/\b(?:SAMSUNG|GALAXY)?\s*(A0\d|A1\d|A2\d|A3\d|A5\d|A7\d|S2\d|J\d|S\d{1,2}|NOTE\s*\d{1,2})\s*([A-Z0-9 ]{0,10})\b/)
    return match ? match[0].replace(/\b(SAMSUNG|GALAXY)\b/g, '').replace(/\s+/g, ' ').trim() : ''
  }
  if (brand === 'MOTOROLA') {
    const match = text.match(/\b(?:MOTO|MOTOROLA)\s*([GE]\d{1,2}[ A-Z0-9]*|EDGE[ A-Z0-9]*)\b/)
    return match ? `MOTO ${match[1].trim()}` : ''
  }
  if (brand === 'REDMI' || brand === 'XIAOMI') {
    const match = text.match(/\b(XIAOMI|REDMI|POCO|MI)\s*([A-Z0-9 ]{1,18})\b/)
    return match ? `${match[1]} ${match[2].trim()}` : ''
  }
  return ''
}

export function FitmentFinder({
  categoryTree = fallbackCategoryTree,
  products,
}: {
  categoryTree?: { name: string; subcategories: string[] }[]
  products: FinderProduct[]
}) {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [query, setQuery] = useState('')
  const [categorySelection, setCategorySelection] = useState<{ category: string; subcategory?: string | null } | null>(null)
  const [brandProducts, setBrandProducts] = useState<FinderProduct[]>([])

  useEffect(() => {
    if (!brand) {
      setBrandProducts([])
      return
    }
    let cancelled = false
    async function loadBrandProducts() {
      try {
        const params = new URLSearchParams({ limit: '600', brand })
        const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) {
          setBrandProducts(Array.isArray(data.products) ? data.products : [])
        }
      } catch {
        if (!cancelled) setBrandProducts([])
      }
    }
    loadBrandProducts()
    return () => {
      cancelled = true
    }
  }, [brand])

  const brands = useMemo(() => {
    const fromProducts = uniqueSorted(products.map(inferBrand))
    return fromProducts.length > 0 ? fromProducts : fallbackBrands
  }, [products])

  const models = useMemo(() => {
    if (!brand) return []
    const source = brandProducts.length ? brandProducts : products
    const list = source
      .filter((product) => normalized(inferBrand(product)) === normalized(brand))
      .map((product) => inferModel(product, brand))
    return uniqueSorted(list).slice(0, 80)
  }, [brand, brandProducts, products])

  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  if (brand) params.set('brand', brand)
  if (model) params.set('model', model)
  if (categorySelection?.subcategory) {
    params.set('cat', categorySelection.category)
    params.set('sub', categorySelection.subcategory)
  } else if (categorySelection?.category) {
    params.set('cat', categorySelection.category)
  }
  const href = params.size > 0 ? `/catalogo?${params.toString()}` : '/catalogo'
  const ready = Boolean(query.trim() || brand || model || categorySelection)

  function clearAll() {
    setQuery('')
    setBrand('')
    setModel('')
    setCategorySelection(null)
  }

  return (
    <section className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="liquid-glass-strong relative rounded-4xl">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ backgroundImage: "url('/alta-brand/bg-fitment-glass.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.78),rgba(255,255,255,0.54)_58%,rgba(255,255,255,0.28))]" />
          </div>

          <div className="relative z-10 p-3 sm:p-4">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <SlidersHorizontal className="h-4 w-4" />
                </span>
                Buscar y filtrar
              </div>

              <div className="nav-pill flex items-center gap-2 rounded-2xl px-4 py-3 sm:min-w-80">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por producto, modelo o codigo..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  aria-label="Buscar productos"
                />
              </div>
            </div>

            <div className="grid gap-2 lg:grid-cols-[1fr_1.1fr_1.25fr_auto]">
              <LiquidSelect
                value={brand}
                onChange={(value) => {
                  setBrand(value)
                  setModel('')
                }}
                options={brands.map((option) => ({ value: option, label: option }))}
                placeholder="Marca"
                ariaLabel="Filtrar por marca del telefono"
              />

              <LiquidSelect
                value={model}
                disabled={!brand}
                onChange={setModel}
                options={models.map((option) => ({ value: option, label: option }))}
                placeholder="Modelo"
                ariaLabel="Filtrar por modelo"
              />

              <CategoryTreeSelect
                value={categorySelection}
                onChange={setCategorySelection}
                tree={categoryTree}
                tone="neutral"
                placeholder="Todas las categorías"
                ariaLabel="Filtrar por categoria o subcategoria"
              />

              <Link
                href={href}
                className="nav-pill inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95"
              >
                Ver productos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {ready && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-full bg-foreground px-3 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
                >
                  Borrar todo
                </button>
                <span className="rounded-full bg-white/75 px-3 py-2 text-sm font-medium text-muted-foreground">
                  {[
                    query.trim(),
                    brand,
                    model,
                    categorySelection?.subcategory || categorySelection?.category,
                  ].filter(Boolean).join(' · ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
