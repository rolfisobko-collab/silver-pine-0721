'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { useAuth } from '@/components/auth-context'
import { categoryTree } from '@/lib/products'
import { cn } from '@/lib/utils'

export function SiteNav() {
  const pathname = usePathname()
  const { count } = useCart()
  const { user, logout, ready } = useAuth()
  const [open, setOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
    setCatOpen(false)
    setUserOpen(false)
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="glass glass-sheen mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 pl-1 text-lg font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
          </span>
          Lumen
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/" label="Inicio" active={pathname === '/'} />
          <NavLink
            href="/catalogo"
            label="Catálogo"
            active={pathname === '/catalogo'}
          />

          {/* Categories mega-menu */}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-expanded={catOpen}
            >
              Categorías
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  catOpen && 'rotate-180',
                )}
              />
            </button>

            {catOpen && (
              <div className="absolute left-1/2 top-full w-[min(46rem,90vw)] -translate-x-1/2 pt-3">
                <div className="glass-strong glass-sheen grid grid-cols-2 gap-2 rounded-3xl p-4 sm:grid-cols-3 lg:grid-cols-5">
                  {categoryTree.map((c) => (
                    <div key={c.name}>
                      <Link
                        href={`/catalogo?cat=${encodeURIComponent(c.name)}`}
                        className="block rounded-xl px-2 py-1.5 text-sm font-semibold transition-colors hover:text-primary"
                      >
                        {c.name}
                      </Link>
                      <ul className="mt-1 space-y-0.5">
                        {c.subcategories.map((s) => (
                          <li key={s}>
                            <Link
                              href={`/catalogo?cat=${encodeURIComponent(c.name)}&sub=${encodeURIComponent(s)}`}
                              className="block rounded-xl px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              {s}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Account (desktop) */}
          {ready && (
            <div className="relative hidden md:block" ref={userRef}>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setUserOpen((v) => !v)}
                    className="glass glass-hover flex h-10 items-center gap-2 rounded-full pl-1.5 pr-3"
                    aria-expanded={userOpen}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="max-w-24 truncate text-sm font-medium">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {userOpen && (
                    <div className="glass-strong glass-sheen absolute right-0 top-full mt-2 w-52 rounded-2xl p-2">
                      <MenuItem href="/cuenta" icon={User} label="Mi perfil" />
                      <MenuItem
                        href="/cuenta/pedidos"
                        icon={Package}
                        label="Mis pedidos"
                      />
                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/cuenta"
                  className="glass glass-hover flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium"
                >
                  <User className="h-4 w-4" />
                  Ingresar
                </Link>
              )}
            </div>
          )}

          <Link
            href="/carrito"
            className="glass glass-hover relative flex h-10 w-10 items-center justify-center rounded-full"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="glass glass-hover flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            {open ? (
              <X className="h-4.5 w-4.5" />
            ) : (
              <Menu className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="glass-strong glass-sheen mx-auto mt-2 max-h-[75vh] max-w-6xl overflow-y-auto rounded-3xl p-3 md:hidden">
          <MobileLink href="/" label="Inicio" />
          <MobileLink href="/catalogo" label="Catálogo" />

          <div className="my-2 border-t border-border" />
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Categorías
          </p>
          {categoryTree.map((c) => (
            <div key={c.name} className="mb-1">
              <Link
                href={`/catalogo?cat=${encodeURIComponent(c.name)}`}
                className="block rounded-2xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                {c.name}
              </Link>
              <div className="flex flex-wrap gap-1.5 px-3 pb-2 pt-1">
                {c.subcategories.map((s) => (
                  <Link
                    key={s}
                    href={`/catalogo?cat=${encodeURIComponent(c.name)}&sub=${encodeURIComponent(s)}`}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="my-2 border-t border-border" />
          {user ? (
            <>
              <MobileLink href="/cuenta" label="Mi perfil" />
              <MobileLink href="/cuenta/pedidos" label="Mis pedidos" />
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="block w-full rounded-2xl px-3 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <MobileLink href="/cuenta" label="Ingresar / Registrarse" />
          )}
        </div>
      )}
    </header>
  )
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
        active && 'bg-secondary text-foreground',
      )}
    >
      {label}
    </Link>
  )
}

function MenuItem({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: typeof User
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary"
    >
      {label}
    </Link>
  )
}
