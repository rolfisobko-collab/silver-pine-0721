import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { AccountView } from '@/components/account/account-view'

export const metadata = {
  title: 'Mi cuenta — Lumen',
}

export default function AccountPage() {
  return (
    <main className="relative">
      <SiteNav />
      <div className="pt-28">
        <AccountView />
      </div>
      <SiteFooter />
    </main>
  )
}
