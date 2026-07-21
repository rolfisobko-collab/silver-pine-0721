'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import {
  products,
  categoryTree,
  formatPrice,
  type Product,
} from '@/lib/products'

type Message = {
  role: 'user' | 'assistant'
  text: string
  results?: Product[]
}

const SUGGESTIONS = [
  'Busco auriculares con cancelación de ruido',
  '¿Qué laptop me recomendás?',
  'Algo para regalar menos de $100',
  '¿Tenés fundas para el Lumen Phone?',
]

/**
 * Mock assistant: does simple local keyword matching over the catalog.
 * Swap `answer()` for a real API/LLM call later — the UI stays the same.
 */
function answer(query: string): Message {
  const q = query.toLowerCase().trim()

  // price constraint e.g. "menos de 100"
  const priceMatch = q.match(/(\d{2,4})/)
  const maxPrice =
    /menos|hasta|bajo|barat|econ/.test(q) && priceMatch
      ? Number(priceMatch[1])
      : null

  const scored = products
    .map((p) => {
      let score = 0
      const haystack = [
        p.name,
        p.tagline,
        p.description,
        p.category,
        p.subcategory,
        ...p.highlights,
        ...p.colors,
      ]
        .join(' ')
        .toLowerCase()
      for (const word of q.split(/\s+/).filter((w) => w.length > 2)) {
        if (haystack.includes(word)) score += 1
      }
      if (maxPrice && p.price <= maxPrice) score += 2
      return { p, score }
    })
    .filter((x) => (maxPrice ? x.p.price <= maxPrice : true))
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)

  const top = scored.filter((x) => x.score > 0).slice(0, 3).map((x) => x.p)

  if (top.length === 0) {
    // fall back to popular items or price filter
    const fallback = (maxPrice
      ? scored.map((x) => x.p)
      : [...products].sort((a, b) => b.rating - a.rating)
    ).slice(0, 3)

    const cats = categoryTree.map((c) => c.name).join(', ')
    return {
      role: 'assistant',
      text: maxPrice
        ? `Encontré estas opciones por debajo de ${formatPrice(maxPrice)}:`
        : `No estoy seguro de haber entendido, pero puedo ayudarte con ${cats}. Acá van algunas ideas populares:`,
      results: fallback,
    }
  }

  const intro = maxPrice
    ? `Estas son mis mejores recomendaciones por debajo de ${formatPrice(maxPrice)}:`
    : 'Según lo que buscás, te recomiendo:'

  return { role: 'assistant', text: intro, results: top }
}

export function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: '¡Hola! Soy Lumi, tu asistente. Contame qué buscás y te ayudo a encontrar el producto ideal.',
    },
  ])
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const canSend = useMemo(() => input.trim().length > 0 && !typing, [input, typing])

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open, typing])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    // simulate latency of a real model
    setTimeout(() => {
      setMessages((prev) => [...prev, answer(trimmed)])
      setTyping(false)
    }, 650)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === 'Enter' &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      if (canSend) send(input)
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        className="glass glass-hover fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="glass glass-sheen fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-4xl">
          <header className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Lumi · Asistente</div>
              <div className="text-xs text-muted-foreground">
                Te ayuda a elegir productos
              </div>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={
                    m.role === 'user'
                      ? 'ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground'
                      : 'w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm text-foreground'
                  }
                >
                  {m.text}
                </div>
                {m.results && m.results.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {m.results.map((p) => (
                      <Link
                        key={p.id}
                        href={`/producto/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="glass glass-hover flex items-center gap-3 rounded-2xl p-2.5"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <Image
                            src={p.image || '/placeholder.svg'}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">
                            {p.name}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {p.subcategory} · {p.tagline}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {formatPrice(p.price)}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            )}

            {messages.length === 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="glass glass-hover rounded-full px-3 py-1.5 text-xs font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="glass flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Preguntá por un producto…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => canSend && send(input)}
                disabled={!canSend}
                aria-label="Enviar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Demo · respuestas generadas localmente
            </p>
          </div>
        </div>
      )}
    </>
  )
}
