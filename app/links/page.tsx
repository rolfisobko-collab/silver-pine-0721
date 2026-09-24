import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Globe2, MessageCircle } from 'lucide-react'
import { altaLinks } from '@/lib/alta-links'
import { cn } from '@/lib/utils'

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070c] px-4 py-8 text-white sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/alta-brand/bg-links-glass.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,35,60,0.24),transparent_30%),linear-gradient(180deg,rgba(5,7,12,0.34),rgba(5,7,12,0.94))]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[58rem] -translate-x-1/2 rounded-full bg-primary/24 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-3xl" />

      <div className="relative mx-auto flex max-w-xl flex-col items-center">
        <Link
          href="/"
          className="mb-8 inline-flex self-start items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-xl transition hover:-translate-x-0.5 hover:bg-white/12 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <div className="mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_0_90px_rgba(239,35,60,0.42),0_24px_70px_-42px_rgba(0,0,0,0.9)] ring-1 ring-white/30">
          <Image
            src="/alta-logo.png"
            alt="Alta Telefonia"
            width={160}
            height={160}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        <h1 className="text-center text-4xl font-black tracking-tight sm:text-5xl">
          Alta Telefonia
        </h1>
        <p className="mt-3 text-center text-base font-semibold text-white/55">
          Servicio tecnico · Accesorios · Equipos
        </p>

        <section className="mt-12 grid w-full gap-4">
          {altaLinks.map((item) => (
            <LinkButton key={item.href} item={item} />
          ))}
        </section>
      </div>
    </main>
  )
}

function LinkButton({ item }: { item: (typeof altaLinks)[number] }) {
  const skin = getSkin(item)
  const isWhatsapp = skin.kind === 'whatsapp'
  const isStore = item.href === '/'
  const Icon = isWhatsapp ? MessageCircle : isStore ? Globe2 : item.icon

  return (
    <Link
      href={item.href}
      target={item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
      className={cn(
        'group relative flex min-h-24 items-center gap-4 overflow-hidden rounded-[1.55rem] border p-4 text-left backdrop-blur-2xl transition duration-300',
        'hover:-translate-y-1 hover:scale-[1.012] active:translate-y-0 active:scale-[0.99]',
        skin.card,
      )}
    >
      <span
        className={cn(
          'absolute inset-x-4 top-0 h-px opacity-70 transition group-hover:opacity-100',
          skin.line,
        )}
      />
      <span
        className={cn(
          'absolute -right-12 -top-16 h-36 w-36 rounded-full blur-3xl transition duration-300 group-hover:scale-125',
          skin.glow,
        )}
      />

      <span
        className={cn(
          'relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition duration-300 group-hover:rotate-[-2deg] group-hover:scale-105',
          skin.icon,
        )}
      >
        <Icon className="h-8 w-8" />
        {isWhatsapp ? (
          <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-1.5 py-0.5 text-[0.58rem] font-black leading-none text-emerald-600 shadow-sm">
            WA
          </span>
        ) : null}
      </span>

      <span className="relative min-w-0 flex-1">
        <span className="block text-lg font-extrabold leading-tight text-white">
          {item.label}
        </span>
        {item.desc ? (
          <span className="mt-1 block text-sm font-medium leading-snug text-white/52">
            {item.desc}
          </span>
        ) : null}
      </span>

      <ChevronRight className="relative h-5 w-5 shrink-0 text-white/30 transition group-hover:translate-x-1.5 group-hover:text-white/72" />
    </Link>
  )
}

function getSkin(item: (typeof altaLinks)[number]) {
  const label = item.label.toLowerCase()
  const href = item.href.toLowerCase()

  if (href.includes('wa.me') || label.includes('whatsapp')) {
    return {
      kind: 'whatsapp',
      card:
        'border-emerald-300/16 bg-[linear-gradient(135deg,rgba(29,32,38,0.94),rgba(12,28,22,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_60px_-42px_rgba(34,197,94,0.9)] hover:border-emerald-300/34 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_26px_70px_-38px_rgba(34,197,94,0.95)]',
      icon: 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-300/24',
      glow: 'bg-emerald-400/18',
      line: 'bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent',
    }
  }

  if (label.includes('instagram')) {
    return {
      kind: 'instagram',
      card:
        'border-pink-200/16 bg-[linear-gradient(135deg,rgba(29,30,38,0.94),rgba(45,21,44,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_60px_-42px_rgba(221,42,123,0.85)] hover:border-pink-200/34',
      icon:
        'bg-[linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)] text-white ring-1 ring-white/18',
      glow: 'bg-pink-400/20',
      line: 'bg-gradient-to-r from-transparent via-pink-300/55 to-transparent',
    }
  }

  if (label.includes('tiktok')) {
    return {
      kind: 'tiktok',
      card:
        'border-cyan-200/14 bg-[linear-gradient(135deg,rgba(29,30,38,0.94),rgba(12,15,22,0.95))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_18px_55px_-42px_rgba(37,244,238,0.8)] hover:border-cyan-200/30',
      icon:
        'bg-[#11131b] text-white ring-1 ring-cyan-300/28 shadow-[6px_0_0_rgba(254,44,85,0.45),-6px_0_0_rgba(37,244,238,0.42)]',
      glow: 'bg-cyan-300/16',
      line: 'bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent',
    }
  }

  if (label.includes('nova') || label.includes('ia')) {
    return {
      kind: 'nova',
      card:
        'border-sky-200/14 bg-[linear-gradient(135deg,rgba(29,30,38,0.94),rgba(13,27,43,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_60px_-42px_rgba(56,189,248,0.85)] hover:border-sky-200/32',
      icon: 'bg-sky-400/18 text-sky-200 ring-1 ring-sky-200/24',
      glow: 'bg-sky-300/18',
      line: 'bg-gradient-to-r from-transparent via-sky-300/55 to-transparent',
    }
  }

  if (label.includes('ubic')) {
    return {
      kind: 'map',
      card:
        'border-red-200/14 bg-[linear-gradient(135deg,rgba(29,30,38,0.94),rgba(43,17,22,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_60px_-42px_rgba(239,35,60,0.75)] hover:border-red-200/32',
      icon: 'bg-primary/18 text-red-200 ring-1 ring-red-200/24',
      glow: 'bg-primary/18',
      line: 'bg-gradient-to-r from-transparent via-red-300/55 to-transparent',
    }
  }

  return {
    kind: 'default',
    card:
      'border-white/10 bg-[#1d1e26]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_18px_50px_-38px_rgba(0,0,0,0.9)] hover:border-white/20 hover:bg-[#252631]',
    icon: 'bg-white/8 text-white/78 ring-1 ring-white/10',
    glow: 'bg-white/10',
    line: 'bg-gradient-to-r from-transparent via-white/35 to-transparent',
  }
}
