'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Slide = {
  desktopImage: string
  mobileImage: string
  title: string
}

const slides: Slide[] = [
  {
    desktopImage: '/alta-flyers/altatelefonia-01-1920.png',
    mobileImage: '/alta-flyers/altatelefonia-01-1080.png',
    title: 'Repuestos para todos los modelos',
  },
  {
    desktopImage: '/alta-flyers/altatelefonia-02-1920.png',
    mobileImage: '/alta-flyers/altatelefonia-02-1080.png',
    title: 'Stock mayorista Alta Telefonia',
  },
  {
    desktopImage: '/alta-flyers/altatelefonia-03-1920.png',
    mobileImage: '/alta-flyers/altatelefonia-03-1080.png',
    title: 'Compra simple Alta Telefonia',
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
    <section className="px-3 pt-24 sm:px-4 sm:pt-28">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-white shadow-sm sm:rounded-4xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative aspect-square bg-white sm:aspect-[1920/450]">
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
                src={s.mobileImage}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="(max-width: 639px) 100vw, 0px"
                className="object-contain sm:hidden"
              />
              <Image
                src={s.desktopImage}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="(min-width: 640px) min(100vw, 1152px), 0px"
                className="hidden object-contain sm:block"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/16 to-transparent" />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/72 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-white sm:left-5 sm:h-10 sm:w-10"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/72 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-white sm:right-5 sm:h-10 sm:w-10"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/18 px-2.5 py-2 backdrop-blur">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                i === index ? 'w-6 bg-primary' : 'w-2 bg-white/70 hover:bg-white',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
