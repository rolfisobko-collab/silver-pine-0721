import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden px-4 pt-28">
      <Image
        src="/hero-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 pb-16 pt-10 lg:grid-cols-2 lg:pt-20">
        <div>
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Nueva colección Liquid Glass
          </div>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Tecnología que se{' '}
            <span className="text-primary">siente como cristal</span>
          </h1>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Audio, teléfonos y computadoras premium, diseñados con una
            experiencia translúcida, fluida y luminosa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Explorar tienda
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/producto/aura-pro-headphones"
              className="glass glass-sheen inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
            >
              Ver Aura Pro
            </Link>
          </div>

          <div className="mt-10 flex gap-8">
            {[
              { k: '50k+', v: 'Clientes felices' },
              { k: '4.8★', v: 'Valoración media' },
              { k: '2 años', v: 'Garantía premium' },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl font-semibold">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="glass glass-sheen relative w-full max-w-md rounded-4xl p-6">
            <div className="relative aspect-square">
              <Image
                src="/products/headphones-hero.png"
                alt="Auriculares Aura Pro"
                fill
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <div className="glass absolute -bottom-4 -left-4 rounded-2xl px-4 py-3">
              <div className="text-xs text-muted-foreground">Desde</div>
              <div className="text-lg font-semibold">$349</div>
            </div>
            <div className="glass absolute -right-3 top-6 rounded-2xl px-4 py-3">
              <div className="text-xs text-muted-foreground">Batería</div>
              <div className="text-lg font-semibold">40 h</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
