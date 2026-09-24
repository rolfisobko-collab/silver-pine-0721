'use client'

import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'
import { AccountView } from '@/components/account/account-view'
import { AuthForm } from '@/components/account/auth-form'
import { useAuth } from '@/components/auth-context'

export function AccountPageShell() {
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="h-72 w-full max-w-md animate-pulse rounded-4xl bg-white" />
      </main>
    )
  }

  if (!user) return <AuthForm />

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
