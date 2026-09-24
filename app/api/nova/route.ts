import { NextRequest, NextResponse } from 'next/server'
import { slugify } from '@/lib/alta-store'
import { searchAltaProducts } from '@/lib/alta-search'
import type { Product } from '@/lib/products'

type AnyProduct = Record<string, unknown>

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const productTerms = [
  'modulo',
  'pantalla',
  'display',
  'lcd',
  'oled',
  'bateria',
  'glass',
  'vidrio',
  'templado',
  'flex',
  'pin',
  'placa',
  'carga',
  'camara',
  'speaker',
  'parlante',
  'auricular',
  'microfono',
  'tapa',
  'carcasa',
  'herramienta',
  'insumo',
  'alcohol',
  'adaptador',
  'cable',
  'cargador',
  'sku',
  'codigo',
  'repuesto',
  'producto',
  'precio',
  'stock',
]

const deviceTerms = [
  'iphone',
  'ipad',
  'samsung',
  'motorola',
  'moto',
  'xiaomi',
  'redmi',
  'poco',
  'huawei',
  'honor',
  'infinix',
  'tecno',
  'lg',
  'tcl',
  'a10',
  'a11',
  'a12',
  'a13',
  'a14',
  'a15',
  'a20',
  'a21',
  'a22',
  'a23',
  'a30',
  'a31',
  'a32',
  'a50',
  'a51',
  'a52',
  's20',
  's21',
  's22',
  's23',
  's24',
]

function isProductIntent(query: string) {
  const text = normalizeText(query)
  if (/\b(?:sku|codigo|cod)\s*#?\s*\d{3,6}\b/.test(text)) return true
  if (/^\d{3,6}$/.test(text.trim())) return true
  if (productTerms.some((term) => new RegExp(`\\b${term}\\b`).test(text))) return true
  if (deviceTerms.some((term) => new RegExp(`\\b${term}\\b`).test(text))) return true
  if (/\b(?:ip|iphone)\s*(?:x|xr|xs|se|[6-9]|1[0-7])\b/.test(text)) return true
  return false
}

function conversationalReply(query: string) {
  const text = normalizeText(query)
  if (/\b(gracias|muchas gracias|genial|perfecto|ok|dale)\b/.test(text)) {
    return 'Dale, buenisimo. Cuando necesites algo, decime el modelo o el repuesto y te ayudo a encontrarlo.'
  }
  if (/\b(hola|buenas|buen dia|buenas tardes|buenas noches|como estas|que tal)\b/.test(text)) {
    return 'Hola, todo bien. Estoy aca para ayudarte a buscar repuestos y accesorios de Alta. Pasame el modelo, la pieza o el SKU y lo vemos.'
  }
  if (/\b(ayuda|como busco|que podes hacer)\b/.test(text)) {
    return 'Puedo buscar por modelo, repuesto o SKU. Por ejemplo: modulo iPhone 13, bateria Samsung A12 o glass iPhone 12.'
  }
  return 'Te leo. Si estas buscando algo del catalogo, pasame modelo, pieza o SKU y lo afinamos.'
}

function normalizeNovaProduct(raw: AnyProduct): Product {
  const name = firstString(raw.name, raw.title, raw.productName) || 'Producto Alta'
  const id = firstString(raw.id, raw._id, raw.sku, raw.codigo, raw.code) || slugify(name)
  const category = firstString(raw.category, raw.categoryName, raw.categoryId) || 'Catalogo'
  const image = firstString(
    raw.image,
    raw.image1,
    Array.isArray(raw.images) ? raw.images[0] : '',
    Array.isArray(raw.photos) ? raw.photos[0] : '',
  ) || '/placeholder.svg'
  const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : []
  const deviceBrand = firstString(raw.deviceBrand, raw.phone_brand, raw.brand)
  const deviceModel = firstString(raw.deviceModel, raw.phone_model, raw.model)
  const partBrand = firstString(raw.partBrand, raw.brand)
  const price = Number(raw.price ?? raw.finalPrice ?? raw.precio ?? 0) || 0
  const quantity = Number(raw.quantity ?? raw.stock ?? raw.availableStock ?? 0) || 0

  return {
    id,
    slug: `${slugify(name)}-${id.slice(-6)}`,
    name,
    tagline: [partBrand, deviceBrand, deviceModel].filter(Boolean).join(' · ') || category,
    description: firstString(raw.description, raw.context) || tags.join(' · ') || category,
    price,
    category: category as Product['category'],
    subcategory: firstString(raw.subcategory, raw.subcategoryName, category) || category,
    brand: partBrand || deviceBrand || 'Alta',
    image,
    rating: 4.8,
    reviews: 0,
    colors: ['Unico'],
    featured: Boolean(raw.featured || raw.weeklyOffer || raw.liquidation),
    highlights: [
      raw.sku ? `SKU ${raw.sku}` : '',
      quantity > 0 ? 'Disponible' : 'Consultar stock',
      category,
      ...tags.slice(0, 3),
    ].filter(Boolean),
    sku: raw.sku ? Number(raw.sku) : null,
    quantity,
    barcode: firstString(raw.barcode, raw.codigoBarra),
    tags,
    context: firstString(raw.context),
    deviceBrand,
    deviceModel,
    partBrand,
  } as Product
}

function answerText(query: string, products: Product[], fromNova: boolean) {
  if (products.length === 0) {
    return 'No encontre algo claro con esa busqueda. Probemos con un dato mas: modelo exacto, tipo de pieza o SKU.'
  }
  const base = products.length === 1
    ? 'Mira, encontre esta opcion en el catalogo:'
    : 'Mira, encontre estas opciones que pueden servirte:'
  if (fromNova) return base
  return `${base} Si queres, la afinamos con marca, modelo o SKU.`
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const query = String(body.message || body.query || '').trim()
  if (!query) {
    return NextResponse.json({
      text: 'Decime que estas buscando y te ayudo. Puede ser modelo, repuesto o SKU.',
      products: [],
    })
  }

  if (!isProductIntent(query)) {
    return NextResponse.json({
      text: conversationalReply(query),
      products: [],
      source: 'conversation',
    })
  }

  try {
    const params = new URLSearchParams({ q: query, limit: '6' })
    const data = await searchAltaProducts(params)
    return NextResponse.json({
      text: answerText(query, data.products, false),
      products: data.products.slice(0, 6),
      source: 'catalog',
    })
  } catch {
    return NextResponse.json({
      text: 'Se me trabo la consulta del catalogo. Dame unos segundos y probamos de nuevo.',
      products: [],
      source: 'offline',
    })
  }
}
