import Link from 'next/link'

const groups = [
  {
    title: 'Tienda',
    links: ['Novedades', 'Audio', 'Teléfonos', 'Computadoras', 'Wearables'],
  },
  {
    title: 'Soporte',
    links: ['Envíos', 'Devoluciones', 'Garantía', 'Contacto'],
  },
  {
    title: 'Empresa',
    links: ['Sobre Lumen', 'Sostenibilidad', 'Prensa', 'Trabajá con nosotros'],
  },
]

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-16">
      <div className="glass glass-sheen mx-auto max-w-6xl rounded-4xl p-8 sm:p-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
              </span>
              Lumen
            </div>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Tecnología premium con una experiencia Liquid Glass. Diseñada para
              durar, pensada para inspirar.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold">{g.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="/catalogo"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Lumen. Todos los derechos reservados.</p>
          <p>Hecho con estética Liquid Glass.</p>
        </div>
      </div>
    </footer>
  )
}
