import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CatalogView } from '@/components/catalog/catalog-view'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams

  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-28">
        <CatalogView initialCategory={cat} />
      </div>
      <SiteFooter />
    </main>
  )
}
