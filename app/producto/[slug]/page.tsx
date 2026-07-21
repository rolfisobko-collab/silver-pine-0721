import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { ProductDetail } from '@/components/product/product-detail'
import { ProductCard } from '@/components/product-card'
import { getProduct, products } from '@/lib/products'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: 'Producto no encontrado — Lumen' }
  return {
    title: `${product.name} — Lumen`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
  const fallback = products.filter((p) => p.id !== product.id).slice(0, 4)
  const suggestions = related.length > 0 ? related : fallback

  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-28">
        <ProductDetail product={product} />

        <section className="mx-auto mt-20 max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            También te puede gustar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  )
}
