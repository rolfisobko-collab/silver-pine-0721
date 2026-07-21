'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Slide = {
  image: string
  eyebrow: string
  title: string
  desc: string
  cta: string
  href: string
}

const slides: Slide[] = [
  {
    image: '/carousel/audio.png',
    eyebrow: 'Nueva colección Audio',
    title: 'Sonido que te envuelve',
    desc: 'Auriculares y parlantes premium con cancelación de ruido y audio espacial.',
    cta: 'Explorar Audio',
    href: '/catalogo?cat=Audio',
  },
  {
    image: '/carousel/phones.png',
    eyebrow: 'Insignia 2026',
    title: 'Titanio en tu mano',
    desc: 'El Lumen Phone X combina un chasis de titanio con el chip más rápido de su generación.',
    cta: 'Ver Lumen Phone X',
    href: '/producto/lumen-phone-x',
  },
  {
    image: '/carousel/computers.png',
    eyebrow: 'Trabajo y creatividad',
    title: 'Potencia ultraligera',
    desc: 'Laptops, tablets y monitores diseñados para fluir con tu día.',
    cta: 'Explorar Computadoras',
    href: '/catalogo?cat=Computadoras',
  },
]

export function Carousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [],
  )

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [paused])

  return (
    <section className="px-4 pt-24 sm:pt-28">
      <div
        className="glass glass-sheen relative mx-auto max-w-6xl overflow-hidden rounded-4xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative aspect-[16/10] sm:aspect-[21/9]">
          {slides.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                'absolute inset-0 transition-opacity duration-700',
                i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
              aria-hidden={i !== index}
            >
              <Image
                src={s.image || '/placeholder.svg'}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/45 to-transparent" />

              <div className="relative flex h-full max-w-xl flex-col justify-center gap-4 p-6 sm:p-12 lg:p-16">
                <span className="glass inline-flex w-fit items-center rounded-full px-3.5 py-1.5 text-xs font-medium text-primary">
                  {s.eyebrow}
                </span>
                <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  {s.title}
                </h2>
                <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {s.desc}
                </p>
                <Link
                  href={s.href}
                  className="group mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  {s.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          className="glass glass-hover absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full sm:left-5"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="glass glass-hover absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full sm:right-5"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                i === index
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-foreground/25 hover:bg-foreground/40',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
