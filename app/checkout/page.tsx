import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CheckoutView } from '@/components/checkout/checkout-view'

export const metadata = {
  title: 'Checkout — Lumen',
}

export default function CheckoutPage() {
  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-28">
        <CheckoutView />
      </div>
      <SiteFooter />
    </main>
  )
}
