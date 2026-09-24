import Link from 'next/link'
import { MapPin, MessageCircle } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'

const groups = [
  {
    title: 'Comprar',
    links: [
      { label: 'Catalogo completo', href: '/catalogo' },
      { label: 'Modulos', href: '/catalogo?cat=Modulos' },
      { label: 'Baterias', href: '/catalogo?cat=Baterias' },
      { label: 'Glass', href: '/catalogo?cat=Glass' },
      { label: 'Herramientas', href: '/catalogo?cat=Herramientas%20e%20insumos' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Como comprar', href: '/como-comprar' },
      { label: 'Envios y retiro', href: '/envios' },
      { label: 'Garantia', href: '/garantia' },
      { label: 'Cambios y devoluciones', href: '/devoluciones' },
      { label: 'Servicio tecnico', href: '/servicio-tecnico' },
    ],
  },
  {
    title: 'Alta',
    links: [
      { label: 'Sobre Alta', href: '/sobre-alta' },
      { label: 'Canales de contacto', href: '/links' },
      { label: 'Mi cuenta', href: '/cuenta' },
      { label: 'Mis pedidos', href: '/cuenta/pedidos' },
      { label: 'Carrito', href: '/carrito' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-16">
      <div className="liquid-glass-strong mx-auto max-w-6xl rounded-4xl p-7 sm:p-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Repuestos, accesorios, herramientas y servicio tecnico con
              catalogo conectado y atencion por WhatsApp.
            </p>
            <Link
              href="/links"
              className="nav-pill mt-5 inline-flex rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5"
            >
              Contactar Alta
            </Link>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold">{g.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
            <p>Alta Telefonia - {new Date().getFullYear()}.</p>
            <Link
              href="https://maps.app.goo.gl/djvc5T4ns7NMsWHU9"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <MapPin className="h-3.5 w-3.5" />
              Catamarca 1928, Posadas
            </Link>
            <Link
              href="https://wa.me/5493764572478"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp ventas
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/garantia" className="transition-colors hover:text-foreground">
              Garantia
            </Link>
            <Link href="/envios" className="transition-colors hover:text-foreground">
              Envios
            </Link>
            <Link href="/devoluciones" className="transition-colors hover:text-foreground">
              Cambios
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
