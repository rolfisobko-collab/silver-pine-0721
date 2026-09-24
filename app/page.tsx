import Link from 'next/link'
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  Undo2,
  Zap,
} from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Carousel } from '@/components/home/carousel'
import { FitmentFinder } from '@/components/home/fitment-finder'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/products'
import { buildCategoryTree, getStoreCategories, getStoreProducts } from '@/lib/alta-store'

const perks = [
  { icon: Truck, title: 'Entrega coordinada', desc: 'Retiro o envio con confirmacion' },
  { icon: Undo2, title: 'Cambios claros', desc: 'Revision por compatibilidad' },
  { icon: ShieldCheck, title: 'Garantia Alta', desc: 'Soporte en repuestos y accesorios' },
  { icon: Zap, title: 'Respuesta rapida', desc: 'Atencion por canal correcto' },
]

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function pickShowcaseTools(items: typeof products) {
  const toolWords = [
    'estacion',
    'soldar',
    'calor',
    'trinocular',
    'camara',
    'fuente',
    'brazo',
    'analizador',
    'microscopio',
    'separadora',
    'quick',
    'sugon',
    'relife',
    'yaxun',
    'kaisi',
  ]

  const isRealImage = (image: string) => Boolean(image && !image.includes('/placeholder.svg'))
  const scored = items
    .filter((product) => {
      const text = normalizeName(`${product.name} ${product.category} ${product.subcategory}`)
      return product.price >= 50000 && toolWords.some((word) => text.includes(word))
    })
    .map((product) => {
      const text = normalizeName(`${product.name} ${product.category} ${product.subcategory}`)
      const score =
        product.price +
        (isRealImage(product.image) ? 1000000 : 0) +
        (toolWords.some((word) => text.includes(word)) ? 250000 : 0)

      return { product, score }
    })
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product)

  return scored.length > 0
    ? scored.slice(0, 8)
    : items
        .filter((product) => isRealImage(product.image))
        .sort((a, b) => b.price - a.price)
        .slice(0, 8)
}

export default async function HomePage() {
  const [{ products: storeProducts }, { products: finderProducts }, storeCategories] = await Promise.all([
    getStoreProducts(
      new URLSearchParams({ category: 'Herramientas e insumos', limit: '200' }),
    ),
    getStoreProducts(new URLSearchParams({ limit: '600' })),
    getStoreCategories(),
  ])
  const featured = storeProducts.length > 0 ? pickShowcaseTools(storeProducts) : products.filter((p) => p.featured)
  const finderCategoryTree = buildCategoryTree(storeCategories)

  return (
    <main className="relative flex flex-col">
      <SiteNav />
      <Carousel />
      <FitmentFinder categoryTree={finderCategoryTree} products={finderProducts} />

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Herramientas destacadas
              </h2>
              <p className="mt-2 text-muted-foreground">
                Una seleccion de los favoritos de Alta.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              Ver todo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 py-6 sm:px-4 sm:py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="glass flex flex-col items-start gap-3 rounded-2xl p-4 sm:flex-row sm:items-center"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 overflow-hidden rounded-4xl border border-white/20 bg-[#101014] p-6 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.7)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/alta-brand/bg-links-glass.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,12,0.82)_0%,rgba(5,7,12,0.58)_48%,rgba(5,7,12,0.14)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-[62%] bg-black/12 backdrop-blur-[1px]" />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-white shadow-inner backdrop-blur-xl">
              <MessageCircle className="h-6 w-6" />
            </span>
            <div>
              <div className="mb-2 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 shadow-sm backdrop-blur-xl">
                Alta links
              </div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Contactos, redes y ubicacion.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/72 sm:text-base">
                Abri la pagina de links para ventas, soporte, Nova IA, redes y ubicacion.
              </p>
            </div>
          </div>
          <Link
            href="/links"
            className="group relative z-10 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-foreground shadow-[0_18px_44px_-26px_rgba(255,255,255,0.55)] transition-transform hover:scale-[1.03]"
          >
            Ver links de Alta
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <div>
        <SiteFooter />
      </div>
    </main>
  )
}
