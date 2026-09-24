import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { ProductDetail } from '@/components/product/product-detail'
import { ProductCard } from '@/components/product-card'
import { getProduct, products, type Product } from '@/lib/products'
import { getStoreProducts } from '@/lib/alta-store'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product =
    (await getStoreProducts(new URLSearchParams({ ids: slug }))).products[0] ||
    getProduct(slug)
  if (!product) return { title: 'Producto no encontrado - Alta' }
  return {
    title: `${product.name} - Alta`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product =
    (await getStoreProducts(new URLSearchParams({ ids: slug }))).products[0] ||
    getProduct(slug)
  if (!product) notFound()

  const relatedData = await getStoreProducts(
    new URLSearchParams({ category: String(product.category), limit: '4' }),
  )
  const related = relatedData.products.filter((p: Product) => p.id !== product.id).slice(0, 4)
  const fallback = products.filter((p: Product) => p.id !== product.id).slice(0, 4)
  const suggestions = related.length > 0 ? related : fallback

  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-28">
        <ProductDetail product={product} />

        <section className="mx-auto mt-20 max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Tambien te puede gustar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  )
}
