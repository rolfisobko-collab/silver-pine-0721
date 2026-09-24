import { fetchAltaProducts } from '@/lib/alta-store'

const ignoredTokens = new Set(['DE', 'DEL', 'LA', 'EL', 'PARA', 'CON'])

const tokenSynonyms: Record<string, string[]> = {
  MODULO: ['MODULO', 'MODULOS', 'PANTALLA', 'DISPLAY', 'LCD', 'OLED'],
  MODULOS: ['MODULO', 'MODULOS', 'PANTALLA', 'DISPLAY', 'LCD', 'OLED'],
  FLEX: ['FLEX', 'CARGA', 'PIN', 'CONECTOR'],
  CARGA: ['CARGA', 'PIN', 'CONECTOR'],
  BATERIA: ['BATERIA', 'BAT'],
  BATERIAS: ['BATERIA', 'BAT'],
  CAMARA: ['CAMARA', 'CAM'],
  CAMARAS: ['CAMARA', 'CAM'],
  TAPA: ['TAPA', 'TAMPA'],
  TAPAS: ['TAPA', 'TAMPA'],
  IPHONE: ['IPHONE', 'APPLE'],
  MOTO: ['MOTO', 'MOTOROLA'],
  XIAOMI: ['XIAOMI', 'MI'],
}

function normalized(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

function queryTokens(query: string) {
  return normalized(query)
    .split(/[^A-Z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token && !ignoredTokens.has(token))
}

function productSearchText(product: Record<string, unknown>) {
  const prices = product.prices && typeof product.prices === 'object' ? product.prices as Record<string, unknown> : {}
  return normalized([
    product.name,
    product.sku,
    product.code,
    product.barcode,
    product.category,
    product.subcategory,
    product.brand,
    product.partBrand,
    product.deviceBrand,
    product.deviceModel,
    product.description,
    product.context,
    ...(Array.isArray(product.tags) ? product.tags : []),
    ...(Array.isArray(product.highlights) ? product.highlights : []),
    prices.sale,
    prices.price1,
    prices.price2,
    prices.price3,
  ].filter(Boolean).join(' '))
}

function tokenMatches(text: string, token: string) {
  const variants = tokenSynonyms[token] ?? [token]
  return variants.some((variant) => {
    const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`(^|[^A-Z0-9])${escaped}([^A-Z0-9]|$)`).test(text)
  })
}

function rankProducts(products: Record<string, unknown>[], query: string) {
  const tokens = queryTokens(query)
  if (!tokens.length) return products
  return products
    .map((product) => {
      const text = productSearchText(product)
      const matched = tokens.filter((token) => tokenMatches(text, token)).length
      const exactBonus = text.includes(normalized(query)) ? 10 : 0
      const stockBonus = Number(product.stock ?? product.quantity ?? 0) > 0 ? 1 : 0
      return { product, matched, score: matched * 4 + exactBonus + stockBonus }
    })
    .filter((item) => item.matched === tokens.length)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product)
}

async function fallbackSearch(searchParams: URLSearchParams, query: string, exactProducts: Record<string, unknown>[]) {
  const tokens = queryTokens(query).filter((token) => token.length > 1)
  if (tokens.length < 2 || exactProducts.length >= 8) return null

  const searches = tokens.slice(0, 5).map((token) => {
    const params = new URLSearchParams(searchParams)
    params.set('q', token)
    params.set('limit', '200')
    return fetchAltaProducts(params).catch(() => ({ products: [] }))
  })

  const broadParams = new URLSearchParams(searchParams)
  broadParams.delete('q')
  broadParams.delete('search')
  broadParams.set('limit', '600')
  searches.push(fetchAltaProducts(broadParams).catch(() => ({ products: [] })))

  const results = await Promise.all(searches)
  const merged = new Map<string, Record<string, unknown>>()
  for (const product of exactProducts) merged.set(String(product.id), product)
  for (const result of results) {
    for (const product of (result.products ?? []) as Record<string, unknown>[]) {
      merged.set(String(product.id), product)
    }
  }
  const ranked = rankProducts(Array.from(merged.values()), query)
  return ranked.length > exactProducts.length ? ranked : null
}

export async function searchAltaProducts(searchParams: URLSearchParams) {
  const data = await fetchAltaProducts(searchParams)
  const query = searchParams.get('q') || searchParams.get('search') || ''
  const exactProducts = query
    ? rankProducts(data.products as unknown as Record<string, unknown>[], query)
    : data.products as unknown as Record<string, unknown>[]
  const fallback = query
    ? await fallbackSearch(searchParams, query, exactProducts)
    : null
  const products = fallback || exactProducts
  if (!query) return data
  return {
    ...data,
    products,
    total: products.length,
    pages: 1,
  }
}
