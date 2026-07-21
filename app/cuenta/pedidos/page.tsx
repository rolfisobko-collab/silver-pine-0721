import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { OrdersView } from '@/components/account/orders-view'

export const metadata = {
  title: 'Mis pedidos — Lumen',
}

export default function OrdersPage() {
  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-28">
        <OrdersView />
      </div>
      <SiteFooter />
    </main>
  )
}
