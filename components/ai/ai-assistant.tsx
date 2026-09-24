'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Check, Plus, Send, ShoppingBag, X } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { Price } from '@/components/ui/price'
import { type Product } from '@/lib/products'

type Message = {
  role: 'user' | 'assistant'
  text: string
  results?: Product[]
  streaming?: boolean
}

const SUGGESTIONS = [
  'Modulo iPhone 13',
  'Bateria Samsung A12',
  'Glass iPhone 12',
  'Flex de carga Redmi',
]

async function answer(query: string): Promise<Message> {
  const res = await fetch('/api/nova', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: query }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Nova no respondio')
  return {
    role: 'assistant',
    text: String(data.text || 'Mira, encontre estas opciones:'),
    results: Array.isArray(data.products) ? data.products : [],
  }
}

export function AiAssistant() {
  const pathname = usePathname()
  const { addItem } = useCart()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [addedId, setAddedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hola, soy Nova. Contame que estas buscando y te ayudo a encontrarlo en Alta.',
    },
  ])
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimerRef = useRef<number | null>(null)

  const canSend = useMemo(() => input.trim().length > 0 && !typing, [input, typing])

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open, typing])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)
    }
  }, [])

  if (pathname?.startsWith('/cuenta') || pathname === '/links') return null

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    answer(trimmed)
      .then((msg) => {
        typeAssistantMessage(msg)
      })
      .catch(() => {
        typeAssistantMessage({
          role: 'assistant',
          text: 'Se me trabo la consulta un segundo. Proba de nuevo o busca directo desde la tienda.',
        })
      })
  }

  function typeAssistantMessage(message: Message) {
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)
    const fullText = message.text
    const messageIndex = messages.length + 1
    let cursor = 0

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', text: '', streaming: true },
    ])

    typingTimerRef.current = window.setInterval(() => {
      cursor += Math.max(1, Math.ceil(fullText.length / 42))
      const nextText = fullText.slice(0, cursor)

      setMessages((prev) =>
        prev.map((item, index) =>
          index === messageIndex
            ? {
                ...item,
                text: nextText,
                streaming: cursor < fullText.length,
                results: cursor >= fullText.length ? message.results : undefined,
              }
            : item,
        ),
      )

      if (cursor >= fullText.length) {
        if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)
        typingTimerRef.current = null
        setTyping(false)
      }
    }, 22)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      if (canSend) send(input)
    }
  }

  function addProduct(product: Product) {
    addItem(product, product.colors?.[0] || 'Unico', 1)
    setAddedId(product.id)
    window.setTimeout(() => setAddedId(null), 1200)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        className="nova-launcher fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full text-primary transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
      >
        {open ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
            <X className="h-5 w-5" />
          </span>
        ) : (
          <Image
            src="/nova-avatar.png"
            alt="Nova, asistente de Alta"
            fill
            sizes="56px"
            className="object-cover"
            priority
          />
        )}
      </button>

      {open && (
        <div className="liquid-glass-strong liquid-pop fixed bottom-24 right-5 z-50 flex h-[72vh] max-h-[620px] w-[calc(100vw-2.5rem)] max-w-md flex-col overflow-hidden rounded-4xl">
          <header className="flex items-center gap-3 border-b border-white/45 bg-white/24 px-5 py-4 backdrop-blur-2xl">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
              <Image
                src="/nova-avatar.png"
                alt="Nova"
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Nova · Asistente Alta</div>
              <div className="text-xs text-muted-foreground">
                Busca productos reales del catalogo
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
                      ? 'ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-[0_18px_42px_-26px_rgba(239,35,60,0.8)]'
                      : 'w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-white/82 px-4 py-2.5 text-sm text-foreground shadow-sm ring-1 ring-border backdrop-blur-xl'
                  }
                >
                  {m.text}
                  {m.streaming && (
                    <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded-full bg-current opacity-45" />
                  )}
                </div>

                {m.results && m.results.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2.5">
                    {m.results.map((p) => (
                      <div
                        key={p.id}
                        className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/78 p-2.5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.8)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/92 hover:shadow-[0_22px_58px_-34px_rgba(15,23,42,0.9)]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(239,35,60,0.12),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.45),rgba(255,255,255,0))]" />
                        <div className="relative flex gap-3">
                          <Link
                            href={`/producto/${encodeURIComponent(p.slug)}`}
                            onClick={() => setOpen(false)}
                            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-inner"
                          >
                            <Image
                              src={p.image || '/placeholder.svg'}
                              alt={p.name}
                              fill
                              sizes="64px"
                              className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/producto/${encodeURIComponent(p.slug)}`}
                              onClick={() => setOpen(false)}
                              className="block"
                            >
                              <div className="line-clamp-2 text-sm font-bold leading-tight">
                                {p.name}
                              </div>
                              <div className="mt-1 truncate text-xs text-muted-foreground">
                                {p.subcategory} · {p.tagline}
                              </div>
                            </Link>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="text-sm font-black text-primary">
                                <Price value={p.price} />
                              </div>
                              <button
                                type="button"
                                onClick={() => addProduct(p)}
                                className="inline-flex min-w-[92px] items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-[0_12px_28px_-18px_rgba(239,35,60,0.9)] transition-transform hover:scale-105 active:scale-95"
                              >
                                {addedId === p.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5" />
                                    Listo
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" />
                                    Agregar
                                  </>
                                )}
                              </button>
                            </div>
                            {addedId === p.id && (
                              <Link
                                href="/carrito"
                                onClick={() => setOpen(false)}
                                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-[11px] font-black text-primary transition hover:bg-primary hover:text-white"
                              >
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Ver carrito
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-white/82 px-4 py-3 shadow-sm ring-1 ring-border">
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

          <div className="border-t border-white/45 bg-white/20 p-3 backdrop-blur-2xl">
            <div className="nav-pill flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Preguntale a Nova..."
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
          </div>
        </div>
      )}
    </>
  )
}
