import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, Undo2, Zap } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/home/hero'
import { ProductCard } from '@/components/product-card'
import { categories, products } from '@/lib/products'

const perks = [
  { icon: Truck, title: 'Envío gratis', desc: 'En pedidos superiores a $99' },
  { icon: Undo2, title: '30 días', desc: 'Devoluciones sin preguntas' },
  { icon: ShieldCheck, title: 'Garantía 2 años', desc: 'Cobertura premium' },
  { icon: Zap, title: 'Pago seguro', desc: 'Checkout encriptado' },
]

export default function HomePage() {
  const featured = products.filter((p) => p.featured)

  return (
    <main className="relative">
      <SiteNav />
      <Hero />

      {/* Perks */}
      <section className="px-4 py-8">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="glass glass-sheen flex items-center gap-3 rounded-2xl p-4"
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

      {/* Categories */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/catalogo?cat=${encodeURIComponent(c)}`}
                className="glass glass-sheen rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-105"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Productos destacados
              </h2>
              <p className="mt-2 text-muted-foreground">
                Lo más deseado de la colección Lumen.
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Big CTA banner */}
      <section className="px-4 py-10">
        <div className="glass glass-sheen mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-4xl p-10 text-center sm:p-16">
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Sumate a la experiencia Liquid Glass
          </h2>
          <p className="max-w-xl text-pretty text-muted-foreground">
            Diseño translúcido, materiales premium y rendimiento que no te va a
            defraudar. Descubrí por qué miles eligen Lumen.
          </p>
          <Link
            href="/catalogo"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Comprar ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
