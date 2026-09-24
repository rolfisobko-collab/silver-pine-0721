import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CatalogView } from '@/components/catalog/catalog-view'
import { buildCategoryTree, getStoreCategories, getStoreProducts } from '@/lib/alta-store'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; cat?: string; model?: string; sub?: string; q?: string }>
}) {
  const { brand, cat, model, sub, q } = await searchParams
  const effectiveCat = cat
  const params = new URLSearchParams({ limit: brand || model ? '600' : '200' })
  if (q) params.set('q', q)
  if (brand) params.set('brand', brand)
  if (sub || effectiveCat) params.set('category', sub || effectiveCat || '')
  const [{ products }, { products: finderProducts }, categories] = await Promise.all([
    getStoreProducts(params),
    getStoreProducts(new URLSearchParams({ limit: '600' })),
    getStoreCategories(),
  ])
  const tree = buildCategoryTree(categories)

  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-24 sm:pt-28">
        <CatalogView
          initialCategory={effectiveCat}
          initialSubcategory={sub}
          initialBrand={brand}
          initialModel={model}
          initialQuery={q}
          initialProducts={products}
          finderProducts={finderProducts}
          initialTree={tree}
        />
      </div>
      <SiteFooter />
    </main>
  )
}
