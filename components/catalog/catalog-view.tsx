'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import {
  inferBrand,
  inferModel,
  phoneBrands,
  productText,
  normalized,
  uniqueSorted,
  type FinderProduct,
} from '@/components/home/fitment-finder'
import { ProductCard } from '@/components/product-card'
import { CategoryTreeSelect } from '@/components/ui/category-tree-select'
import { LiquidSelect } from '@/components/ui/liquid-select'
import {
  categories,
  getSubcategories,
  products,
  type Category,
} from '@/lib/products'

type SortKey = 'destacado' | 'precio-asc' | 'precio-desc' | 'rating'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'destacado', label: 'Destacados' },
  { key: 'precio-asc', label: 'Precio: menor' },
  { key: 'precio-desc', label: 'Precio: mayor' },
  { key: 'rating', label: 'Mejor valorados' },
]

const queryCategoryMap: Record<string, string> = {
  MODULO: 'Modulos',
  MODULOS: 'Modulos',
  BATERIA: 'Baterías',
  BATERIAS: 'Baterías',
  GLASS: 'Glass',
  FLEX: 'Flex de Carga',
  TAPA: 'Tapas',
  TAPAS: 'Tapas',
  CAMARA: 'Camaras',
  CAMARAS: 'Camaras',
  SPEAKER: 'Speakers',
}

function inferCategoryFromQuery(query?: string | null) {
  if (!query) return ''
  const normalized = query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
  return Object.entries(queryCategoryMap).find(([token]) =>
    new RegExp(`\\b${token}\\b`).test(normalized),
  )?.[1] ?? ''
}

const partSynonyms: Record<string, string[]> = {
  MODULO: ['MODULO', 'MODULOS', 'DISPLAY', 'PANTALLA', 'LCD', 'OLED'],
  BATERIA: ['BATERIA', 'BAT'],
  GLASS: ['GLASS', 'VIDRIO'],
  'FLEX DE CARGA': ['FLEX CARGA', 'PIN CARGA', 'PLACA CARGA', 'CARGA'],
  TAPA: ['TAPA', 'TAMPA', 'TAPA BATERIA'],
  CAMARA: ['CAMARA', 'CAM'],
  SPEAKER: ['SPEAKER', 'PARLANTE', 'AURICULAR'],
  'PLACA DE CARGA': ['PLACA CARGA', 'PIN CARGA', 'CONECTOR CARGA'],
}

function inferPartFromQuery(query: string) {
  const text = normalized(query)
  return Object.entries(partSynonyms).find(([, words]) =>
    words.some((word) => new RegExp(`\\b${word.replace(/\s+/g, '\\s+')}\\b`).test(text)),
  )?.[0] ?? ''
}

function inferBrandFromQuery(query: string) {
  const text = normalized(query)
  return phoneBrands.find((brandName) => new RegExp(`\\b${normalized(brandName)}\\b`).test(text)) ||
    (/\bIPHONE|IPAD|APPLE\b/.test(text) ? 'APPLE' : '')
}

function inferModelFromQuery(query: string, brand: string) {
  const text = normalized(query)
  if (brand === 'APPLE' || /\bIPHONE|IP\b/.test(text)) {
    const match = text.match(/\b(?:IPHONE|IP)?\s*(X[RS]?|SE|[6-9]|1[0-7])\s*(PRO MAX|PRO|PLUS|MINI|PROMAX)?\b/)
    return match ? `IPHONE ${match[1]}${match[2] ? ` ${match[2].replace('PROMAX', 'PRO MAX')}` : ''}` : ''
  }
  const samsung = text.match(/\b(A0\d|A1\d|A2\d|A3\d|A5\d|A7\d|S2\d|J\d)\b/)
  if (samsung) return samsung[1]
  return ''
}

function matchesPart(product: FinderProduct, part: string) {
  if (!part) return true
  const text = productText(product)
  const words = partSynonyms[part] ?? [part]
  return words.some((word) => new RegExp(`\\b${normalized(word).replace(/\s+/g, '\\s+')}\\b`).test(text))
}

function matchesExactModel(product: FinderProduct, model: string) {
  if (!model) return true
  const explicit = normalized(product.deviceModel || '')
  const wanted = normalized(model)
  if (explicit) return explicit === wanted || explicit.includes(wanted) || wanted.includes(explicit)

  const text = productText(product)
  if (wanted === 'IPHONE 11') return /\bIPHONE\s*11\b/.test(text) && !/\bIPHONE\s*11\s*(PRO|PRO\s*MAX|PROMAX|PLUS|MINI)\b/.test(text)
  if (/^IPHONE\s+\d+/.test(wanted)) {
    const escaped = wanted.replace(/\s+/g, '\\s+')
    return new RegExp(`\\b${escaped}\\b`).test(text)
  }
  return new RegExp(`\\b${wanted.replace(/\s+/g, '\\s+')}\\b`).test(text)
}

function applyIntentFilter<T extends FinderProduct>(items: T[], query: string) {
  const q = query.trim()
  if (!q) return items
  const brand = inferBrandFromQuery(q)
  const model = inferModelFromQuery(q, brand)
  const part = inferPartFromQuery(q)
  if (!brand && !model && !part) return items
  const filtered = items.filter((product) => {
    const productBrand = inferBrand(product)
    const productTextValue = productText(product)
    const brandOk = !brand || normalized(productBrand) === normalized(brand) || productTextValue.includes(normalized(brand))
    return brandOk && matchesExactModel(product, model) && matchesPart(product, part)
  })
  return filtered.length > 0 ? filtered : items
}

export function CatalogView({
  initialCategory,
  initialBrand,
  initialModel,
  initialSubcategory,
  initialQuery,
  finderProducts,
  initialProducts,
  initialTree,
}: {
  initialCategory?: string
  initialBrand?: string
  initialModel?: string
  initialSubcategory?: string
  initialQuery?: string
  finderProducts?: typeof products
  initialProducts?: typeof products
  initialTree?: { name: string; subcategories: string[] }[]
}) {
  const searchParams = useSearchParams()

  const [active, setActive] = useState<Category | 'Todos'>(
    (initialCategory || 'Todos') as Category | 'Todos',
  )
  const [selectedBrand, setSelectedBrand] = useState(initialBrand ?? '')
  const [selectedModel, setSelectedModel] = useState(initialModel ?? '')
  const [sub, setSub] = useState<string | null>(initialSubcategory ?? null)
  const [query, setQuery] = useState(initialQuery ?? '')
  const [sort, setSort] = useState<SortKey>('destacado')
  const [stockOnly, setStockOnly] = useState(false)
  const [imageOnly, setImageOnly] = useState(false)
  const [remoteProducts, setRemoteProducts] = useState(initialProducts?.length ? initialProducts : products)
  const [remoteTree, setRemoteTree] = useState<{ name: string; subcategories: string[] }[]>(initialTree ?? [])
  const [loading, setLoading] = useState(false)

  // Keep filters in sync with the URL (nav mega-menu links).
  useEffect(() => {
    const cat = searchParams.get('cat')
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const s = searchParams.get('sub')
    const q = searchParams.get('q')
    setActive((cat || inferCategoryFromQuery(q) || 'Todos') as Category | 'Todos')
    setSelectedBrand(brand ?? '')
    setSelectedModel(model ?? '')
    setSub(s)
    setQuery(q ?? '')
  }, [searchParams])

  useEffect(() => {
    if (initialProducts?.length) return
    let cancelled = false
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (cancelled) return
        const tree = Array.isArray(data.tree) ? data.tree : []
        setRemoteTree(tree)
      } catch {
        if (!cancelled) {
          setRemoteTree([])
        }
      }
    }
    loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ limit: '200' })
        if (query.trim()) params.set('q', query.trim())
        if (selectedBrand) {
          params.set('brand', selectedBrand)
          params.set('limit', '600')
        }
        if (active !== 'Todos') params.set('category', String(sub || active))
        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        if (!cancelled) setRemoteProducts(Array.isArray(data.products) ? data.products : [])
      } catch {
        if (!cancelled) setRemoteProducts(products)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    const t = window.setTimeout(loadProducts, 220)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [active, sub, query, selectedBrand])

  const filtered = useMemo(() => {
    let list = remoteProducts.filter((p) => {
      const usingRemote = remoteProducts !== products
      const matchesCat = usingRemote || active === 'Todos' || p.category === active
      const matchesSub = usingRemote || !sub || p.subcategory === sub
      const q = query.trim().toLowerCase()
      const searchable = normalized([
        p.name,
        p.tagline,
        p.subcategory,
        p.category,
        p.brand,
        p.description,
        p.sku,
        p.barcode,
        p.deviceBrand,
        p.deviceModel,
        p.partBrand,
        p.context,
        ...(p.tags ?? []),
        ...(p.highlights ?? []),
      ]
        .filter(Boolean)
        .join(' '))
      const normalizedQuery = normalized(q)
      const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
      const quantity = Number((p as typeof p & { quantity?: number }).quantity || 0)
      const hasStock = quantity > 0
      const hasImage = Boolean(p.image && !p.image.includes('/placeholder.svg'))
      const matchesQuery =
        q === '' ||
        searchable.includes(normalizedQuery) ||
        tokens.every((token) => searchable.includes(token))
      const matchesBrand = !selectedBrand || normalized(inferBrand(p)) === normalized(selectedBrand)
      const matchesModel = !selectedModel || matchesExactModel(p, selectedModel)
      return matchesCat && matchesSub && matchesBrand && matchesModel && matchesQuery && (!stockOnly || hasStock) && (!imageOnly || hasImage)
    })

    list = applyIntentFilter(list, query)

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
  }, [active, sub, selectedBrand, selectedModel, query, sort, stockOnly, imageOnly, remoteProducts])

  const catalogTree = remoteTree.length
    ? remoteTree
    : categories.map((name) => ({ name, subcategories: getSubcategories(name) }))

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-8">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {active === 'Todos' ? 'Catálogo' : active}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {sub
            ? `${active} · ${sub}`
            : query
              ? `Resultados para “${query}”.`
              : 'Explorá todo el catálogo de Alta.'}
        </p>
      </div>

      <CompactSearchFilters
        active={active}
        brand={selectedBrand}
        imageOnly={imageOnly}
        model={selectedModel}
        onClear={() => {
          setActive('Todos')
          setSelectedBrand('')
          setSelectedModel('')
          setSub(null)
          setQuery('')
          setStockOnly(false)
          setImageOnly(false)
        }}
        onImageOnlyChange={setImageOnly}
        onBrandChange={(value) => {
          setSelectedBrand(value)
          setSelectedModel('')
        }}
        onModelChange={setSelectedModel}
        onQueryChange={setQuery}
        onSortChange={setSort}
        onStockOnlyChange={setStockOnly}
        onCategoryChange={(selection) => {
          if (!selection) {
            setActive('Todos')
            setSub(null)
            return
          }
          setActive(selection.category as Category)
          setSub(selection.subcategory ?? null)
        }}
        products={finderProducts?.length ? finderProducts : remoteProducts}
        query={query}
        sort={sort}
        stockOnly={stockOnly}
        sub={sub}
        categoryTree={catalogTree}
      />

      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        {loading ? 'Cargando productos...' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl px-6 py-16 text-center text-muted-foreground">
          No encontramos productos con esos filtros.
        </div>
      )}
    </div>
  )
}

function CompactSearchFilters({
  active,
  brand,
  imageOnly,
  model,
  onBrandChange,
  onClear,
  onImageOnlyChange,
  onModelChange,
  onQueryChange,
  onSortChange,
  onStockOnlyChange,
  onCategoryChange,
  products,
  query,
  sort,
  stockOnly,
  sub,
  categoryTree,
}: {
  active: Category | 'Todos'
  brand: string
  imageOnly: boolean
  model: string
  onBrandChange: (value: string) => void
  onClear: () => void
  onImageOnlyChange: (value: boolean) => void
  onModelChange: (value: string) => void
  onQueryChange: (value: string) => void
  onSortChange: (value: SortKey) => void
  onStockOnlyChange: (value: boolean) => void
  onCategoryChange: (selection: { category: string; subcategory?: string | null } | null) => void
  products: FinderProduct[]
  query: string
  sort: SortKey
  stockOnly: boolean
  sub: string | null
  categoryTree: { name: string; subcategories: string[] }[]
}) {
  const brands = useMemo(() => {
    const fromProducts = uniqueSorted(products.map(inferBrand))
    return fromProducts.length > 0 ? fromProducts : ['APPLE', 'SAMSUNG', 'MOTOROLA', 'REDMI', 'XIAOMI']
  }, [products])

  const models = useMemo(() => {
    if (!brand) return []
    return uniqueSorted(
      products
        .filter((product) => normalized(inferBrand(product)) === normalized(brand))
        .map((product) => inferModel(product, brand)),
    ).slice(0, 42)
  }, [brand, products])

  function clearAll() {
    onClear()
  }

  return (
    <div className="relative mb-7 overflow-hidden rounded-4xl border border-white/70 bg-white shadow-sm">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url('/alta-brand/bg-fitment-glass.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.88),rgba(255,255,255,0.68)_58%,rgba(255,255,255,0.42))]" />
      </div>
      <div className="relative z-10 p-3 sm:p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SlidersHorizontal className="h-4 w-4" />
          </span>
          Buscar y filtrar
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-white/88 px-4 py-3 shadow-sm backdrop-blur-xl">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar por producto, modelo o codigo..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-72"
              aria-label="Buscar productos"
            />
          </div>
          <LiquidSelect
            value={sort}
            onChange={(value) => onSortChange(value as SortKey)}
            options={sortOptions.map((option) => ({ value: option.key, label: option.label }))}
            placeholder="Ordenar"
            ariaLabel="Ordenar"
            className="sm:w-48"
          />
        </div>
      </div>

      <div className="grid gap-2 lg:grid-cols-[1fr_1.1fr_1.25fr]">
        <LiquidSelect
          value={brand}
          onChange={(value) => {
            onBrandChange(value)
          }}
          options={brands.map((option) => ({ value: option, label: option }))}
          placeholder="Marca"
          ariaLabel="Filtrar por marca del telefono"
        />

        <LiquidSelect
          value={model}
          disabled={!brand}
          onChange={onModelChange}
          options={models.map((option) => ({ value: option, label: option }))}
          placeholder="Modelo"
          ariaLabel="Filtrar por modelo"
        />

        <CategoryTreeSelect
          value={active === 'Todos' ? null : { category: String(active), subcategory: sub }}
          onChange={onCategoryChange}
          tree={categoryTree}
          placeholder="Todas las categorías"
          ariaLabel="Filtrar por categoría o subcategoría"
        />

      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(active !== 'Todos' || sub || brand || model || query || stockOnly || imageOnly) && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-full bg-foreground px-3 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
          >
            Borrar todo
          </button>
        )}
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-sm font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={stockOnly}
            onChange={(event) => onStockOnlyChange(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Solo con stock
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-sm font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={imageOnly}
            onChange={(event) => onImageOnlyChange(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Solo con foto
        </label>
      </div>
      </div>
    </div>
  )
}
