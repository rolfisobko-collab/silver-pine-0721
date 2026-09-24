import { products as fallbackProducts, type Product } from '@/lib/products'

export type AltaCategory = {
  id: string
  name: string
  parentId: string | null
  tags: string[]
  context: string
}

const PANEL_BASE =
  process.env.ALTA_PANEL_API_URL ||
  process.env.NEXT_PUBLIC_ALTA_PANEL_API_URL ||
  'https://alta-panel-production.up.railway.app'

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatAltaPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function normalizeProduct(raw: Record<string, unknown>, usdToArs = 0): Product {
  const name = String(raw.name || 'Producto Alta')
  const id = String(raw.id || raw._id || slugify(name))
  const category = String(raw.category || 'Sin categoria')
  const subcategory = String(raw.subcategory || category)
  const description = String(raw.description || raw.context || '')
  const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : []
  const deviceBrand = String(raw.deviceBrand || '')
  const deviceModel = String(raw.deviceModel || '')
  const partBrand = String(raw.partBrand || raw.brand || '')
  const quantity = Number(raw.quantity ?? raw.stock ?? 0) || 0
  const rawPrices = raw.prices && typeof raw.prices === 'object' ? raw.prices as Record<string, unknown> : {}
  const canonicalUSD = Number(rawPrices.sale ?? rawPrices.price1 ?? rawPrices.price2 ?? rawPrices.price3 ?? 0) || 0
  const legacyARS = Number(raw.priceARS ?? rawPrices.saleARS ?? 0) || 0
  const legacyUSD = Number(raw.priceUSD ?? rawPrices.saleUsd ?? 0) || 0
  const rawPrice = Number(raw.price ?? 0) || 0
  const rate = Number(raw.usdToArs ?? usdToArs ?? 0) || 0
  const price =
    canonicalUSD > 0 && rate > 1
      ? Math.round(canonicalUSD * rate)
      : legacyARS || (legacyUSD > 0 && rate > 1 ? Math.round(legacyUSD * rate) : rawPrice)
  const image =
    typeof raw.image === 'string' && raw.image
      ? raw.image
      : typeof raw.image1 === 'string' && raw.image1
        ? raw.image1
        : Array.isArray(raw.images) && typeof raw.images[0] === 'string'
          ? raw.images[0]
          : '/placeholder.svg'

  return {
    id,
    slug: `${slugify(name)}-${id.slice(-6)}`,
    name,
    tagline: [partBrand, deviceBrand, deviceModel].filter(Boolean).join(' · ') || category,
    description: description || [category, ...tags].filter(Boolean).join(' · '),
    price,
    category: category as Product['category'],
    subcategory,
    brand: partBrand || deviceBrand || 'Alta',
    image,
    rating: 4.8,
    reviews: 0,
    colors: ['Único'],
    featured: Boolean(raw.weeklyOffer || raw.liquidation),
    highlights: [
      raw.sku ? `SKU ${raw.sku}` : '',
      quantity > 0 ? 'Disponible' : 'Sin stock',
      category,
      ...tags.slice(0, 3),
    ].filter(Boolean),
    sku: raw.sku ? Number(raw.sku) : null,
    quantity,
    stock: quantity,
    barcode: String(raw.barcode || ''),
    tags,
    context: String(raw.context || ''),
    deviceBrand,
    deviceModel,
    partBrand,
  } as Product
}

export async function fetchAltaProducts(params: URLSearchParams = new URLSearchParams()) {
  const query = new URLSearchParams(params)
  if (!query.has('limit')) query.set('limit', '80')
  const res = await fetch(`${PANEL_BASE}/api/products?${query.toString()}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Alta products API ${res.status}`)
  const data = await res.json()
  const usdToArs = Number(data.usdToArs || data.cotizacion || 0) || 0
  return {
    products: Array.isArray(data.products)
      ? data.products.map((p: Record<string, unknown>) => normalizeProduct(p, usdToArs))
      : [],
    total: Number(data.total || 0),
    page: Number(data.page || 1),
    pages: Number(data.pages || 1),
  }
}

export async function fetchAltaCategories() {
  const res = await fetch(`${PANEL_BASE}/api/categories`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Alta categories API ${res.status}`)
  const data = await res.json()
  return Array.isArray(data.categories)
    ? data.categories.map((c: Record<string, unknown>) => ({
        id: String(c._id || c.id || ''),
        name: String(c.name || ''),
        parentId: c.parentId ? String(c.parentId) : null,
        tags: Array.isArray(c.tags) ? c.tags.map(String) : [],
        context: String(c.context || ''),
      })).filter((c: AltaCategory) => c.id && c.name)
    : []
}

export async function getStoreProducts(params?: URLSearchParams) {
  try {
    return await fetchAltaProducts(params)
  } catch {
    return { products: fallbackProducts, total: fallbackProducts.length, page: 1, pages: 1 }
  }
}

export async function getStoreCategories() {
  try {
    return await fetchAltaCategories()
  } catch {
    return []
  }
}

export function buildCategoryTree(categories: AltaCategory[]) {
  const roots = categories.filter((c) => !c.parentId)
  const children = categories.filter((c) => c.parentId)
  return roots.map((root) => ({
    name: root.name,
    subcategories: Array.from(new Set(
      children
        .filter((child) => child.parentId === root.id)
        .map((child) => child.name),
    )).sort((a, b) => a.localeCompare(b, 'es', { numeric: true })),
  }))
}
