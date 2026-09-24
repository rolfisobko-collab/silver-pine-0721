'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { useAuth } from '@/components/auth-context'
import { BrandMark } from '@/components/brand-mark'
import { LiquidNavShell } from '@/components/liquid-nav-shell'
import { CategoryTreeSelect } from '@/components/ui/category-tree-select'
import { categoryTree } from '@/lib/products'
import { cn } from '@/lib/utils'

export function SiteNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCart()
  const { user, logout, ready } = useAuth()
  const [open, setOpen] = useState(false)
  const [categorySelection, setCategorySelection] = useState<{ category: string; subcategory?: string | null } | null>(null)
  const [userOpen, setUserOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [navTree, setNavTree] = useState(categoryTree)
  const userRef = useRef<HTMLDivElement>(null)
  const isCatalog = pathname === '/catalogo'

  useEffect(() => {
    setOpen(false)
    setCategorySelection(null)
    setUserOpen(false)
    setSearchOpen(false)
  }, [pathname])

  function goToCategory(selection: { category: string; subcategory?: string | null } | null) {
    setCategorySelection(selection)
    if (!selection) {
      router.push('/catalogo')
      setOpen(false)
      return
    }
    const params = new URLSearchParams({ cat: selection.category })
    if (selection.subcategory) params.set('sub', selection.subcategory)
    router.push(`/catalogo?${params.toString()}`)
    setOpen(false)
  }

  function submitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    router.push(`/catalogo?q=${encodeURIComponent(query)}`)
    setOpen(false)
    setSearchOpen(false)
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (!cancelled && Array.isArray(data.tree) && data.tree.length > 0) {
          setNavTree(data.tree)
        }
      } catch {
        // Keep static fallback.
      }
    }
    loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <LiquidNavShell>
        <nav className="nav-liquid-content flex items-center justify-between rounded-2xl px-3 py-2.5 sm:rounded-full sm:px-5">
          <Link
            href="/"
            className="flex items-center pl-1"
            aria-label="Alta, ir al inicio"
          >
            <BrandMark />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink href="/" label="Inicio" icon={Home} active={pathname === '/'} />
            <NavLink
              href="/catalogo"
              label="Catalogo"
              icon={LayoutGrid}
              active={pathname === '/catalogo'}
            />

            <CategoryTreeSelect
              value={categorySelection}
              onChange={goToCategory}
              tree={navTree}
              tone="neutral"
              placeholder="Categorias"
              ariaLabel="Elegir categoria o subcategoria"
              className="w-44"
              iconClassName="text-foreground/80"
              buttonClassName="nav-pill h-10 rounded-full px-3 py-2 focus-visible:ring-2 focus-visible:ring-foreground/10"
              menuClassName="nav-category-menu w-[min(23rem,calc(100vw-2rem))]"
            />
          </div>

          <form
            onSubmit={submitSearch}
            className={cn(
                'nav-pill hidden min-w-0 max-w-xs flex-1 items-center gap-2 rounded-full px-4 py-2 lg:mx-5 lg:flex',
              isCatalog && 'lg:hidden',
            )}
            role="search"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos"
              aria-label="Buscar productos"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </form>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={cn(
                'nav-icon-button flex h-10 w-10 items-center justify-center rounded-full lg:hidden',
                isCatalog && 'hidden',
              )}
              aria-label={searchOpen ? 'Cerrar buscador' : 'Abrir buscador'}
              aria-expanded={searchOpen}
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {ready && (
              <div className="relative hidden md:block" ref={userRef}>
                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserOpen((v) => !v)}
                      className="nav-pill flex h-10 items-center gap-2 rounded-full pl-1.5 pr-3"
                      aria-expanded={userOpen}
                    >
                      <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-1 ring-white/65">
                        {user.photoURL ? (
                          <Image
                            src={user.photoURL}
                            alt={user.name}
                            fill
                            sizes="28px"
                            className="object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </span>
                      <span className="max-w-24 truncate text-sm font-medium">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {userOpen && (
                      <div className="liquid-panel liquid-pop absolute right-0 top-full z-[220] mt-2 w-52 rounded-2xl p-2">
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
                          Cerrar sesion
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/cuenta"
                    className="nav-pill flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium"
                  >
                    <User className="h-4 w-4" />
                    Ingresar
                  </Link>
                )}
              </div>
            )}

            <Link
              href="/carrito"
              className="nav-icon-button relative flex h-10 w-10 items-center justify-center rounded-full"
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
              className="nav-icon-button flex h-10 w-10 items-center justify-center rounded-full md:hidden"
              aria-label="Abrir menu"
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
      </LiquidNavShell>

      {searchOpen && (
        <form
          onSubmit={submitSearch}
          className="liquid-panel liquid-pop mx-auto mt-2 flex max-w-6xl items-center gap-3 rounded-2xl p-2 pl-4 lg:hidden"
          role="search"
        >
          <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Que estas buscando?"
            aria-label="Buscar productos"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Buscar
          </button>
        </form>
      )}

      {open && (
        <div className="liquid-panel liquid-pop mx-auto mt-2 max-h-[75vh] max-w-6xl overflow-y-auto rounded-3xl p-3 md:hidden">
          <MobileLink href="/" label="Inicio" />
          <MobileLink href="/catalogo" label="Catalogo" />

          <div className="my-2 border-t border-border" />
          {user ? (
            <div className="rounded-2xl bg-secondary/70 p-2">
              <MobileLink href="/cuenta" label="Mi perfil" />
              <MobileLink href="/cuenta/pedidos" label="Mis pedidos" />
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="block w-full rounded-2xl px-3 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground"
              >
                Cerrar sesion
              </button>
            </div>
          ) : (
            <Link
              href="/cuenta"
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-3 py-3 text-sm font-bold text-primary-foreground shadow-[0_16px_35px_-24px_rgba(239,35,60,0.8)]"
            >
              <User className="h-4 w-4" />
              Ingresar / Registrarse
            </Link>
          )}

          <div className="my-2 border-t border-border" />
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Categorias
          </p>
          <CategoryTreeSelect
            value={categorySelection}
            onChange={goToCategory}
            tree={navTree}
            tone="neutral"
            placeholder="Todas las categorías"
            ariaLabel="Elegir categoria o subcategoria"
            buttonClassName="bg-white/80"
          />
        </div>
      )}
    </header>
  )
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: typeof Home
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'nav-pill flex h-10 items-center gap-2 rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
        active && 'text-foreground',
      )}
    >
      <Icon className="h-4 w-4 text-foreground/75" />
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
