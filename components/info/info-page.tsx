import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'

type InfoPageProps = {
  eyebrow: string
  title: string
  intro: string
  sections: Array<{
    title: string
    body: string
  }>
  ctaLabel?: string
  ctaHref?: string
}

export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
  ctaLabel = 'Hablar por WhatsApp',
  ctaHref = '/links',
}: InfoPageProps) {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <SiteNav />
      <section className="px-4 pb-12 pt-32 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition hover:-translate-x-0.5 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mt-8 rounded-[2rem] border border-border bg-white p-7 shadow-sm sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {intro}
            </p>

            <div className="mt-10 grid gap-4">
              {sections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-3xl border border-border bg-[#f7f7f8] p-5"
                >
                  <h2 className="text-lg font-extrabold text-foreground">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>

            <Link
              href={ctaHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_18px_40px_-26px_rgba(239,35,60,0.9)] transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
