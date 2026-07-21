import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CartView } from '@/components/cart/cart-view'

export const metadata = {
  title: 'Carrito — Lumen',
}

export default function CartPage() {
  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-28">
        <CartView />
      </div>
      <SiteFooter />
    </main>
  )
}
