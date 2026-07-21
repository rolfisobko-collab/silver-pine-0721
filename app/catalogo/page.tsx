import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CatalogView } from '@/components/catalog/catalog-view'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sub?: string }>
}) {
  const { cat, sub } = await searchParams

  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-28">
        <CatalogView initialCategory={cat} initialSubcategory={sub} />
      </div>
      <SiteFooter />
    </main>
  )
}
