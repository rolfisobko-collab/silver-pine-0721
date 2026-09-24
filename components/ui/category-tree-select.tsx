'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Check, ChevronDown, Folder, FolderOpen, Search, Tag, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type CategoryTree = { name: string; subcategories: string[] }
type Selection = { category: string; subcategory?: string | null }
type MenuStyle = Pick<CSSProperties, 'left' | 'top' | 'width'>

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function CategoryTreeSelect({
  ariaLabel,
  buttonClassName,
  className,
  iconClassName,
  menuClassName,
  onChange,
  placeholder = 'Todas las categorias',
  tone = 'brand',
  tree,
  value,
}: {
  ariaLabel?: string
  buttonClassName?: string
  className?: string
  iconClassName?: string
  menuClassName?: string
  onChange: (value: Selection | null) => void
  placeholder?: string
  tone?: 'brand' | 'neutral'
  tree: CategoryTree[]
  value: Selection | null
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuStyle, setMenuStyle] = useState<MenuStyle>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selectedLabel = value
    ? value.subcategory
      ? `${value.category} / ${value.subcategory}`
      : value.category
    : placeholder

  const rows = useMemo(() => {
    const term = normalize(query.trim())
    return tree.flatMap((category) => {
      const subcategories = [...(category.subcategories ?? [])].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
      const categoryMatch = normalize(category.name).includes(term)
      const childRows = subcategories
        .filter((subcategory) => !term || categoryMatch || normalize(`${category.name} ${subcategory}`).includes(term))
        .map((subcategory) => ({
          key: `${category.name}::${subcategory}`,
          category: category.name,
          subcategory,
          depth: 1,
          label: subcategory,
          hint: category.name,
        }))
      const includeRoot = !term || categoryMatch || childRows.length > 0
      return includeRoot
        ? [
            {
              key: category.name,
              category: category.name,
              subcategory: null,
              depth: 0,
              label: category.name,
              hint: subcategories.length ? `${subcategories.length} subcategorias` : 'Categoria raiz',
            },
            ...childRows,
          ]
        : []
    })
  }, [query, tree])

  useEffect(() => {
    if (!open) return

    function syncPosition() {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      setMenuStyle({
        left: Math.max(8, rect.left),
        top: rect.bottom + 8,
        width: Math.max(rect.width, 320),
      })
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target)) return
      setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    syncPosition()
    setTimeout(() => searchRef.current?.focus(), 30)
    window.addEventListener('resize', syncPosition)
    window.addEventListener('scroll', syncPosition, true)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('resize', syncPosition)
      window.removeEventListener('scroll', syncPosition, true)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function select(next: Selection | null) {
    onChange(next)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={rootRef} className={cn('relative min-w-0', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel || placeholder}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/78 px-4 py-3 text-left text-sm font-semibold text-foreground shadow-[0_12px_30px_rgba(15,23,42,0.08)] outline-none backdrop-blur-2xl transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/92 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] focus-visible:ring-4 focus-visible:ring-primary/15',
          open && 'border-primary/35 bg-white/95 ring-4 ring-primary/10',
          tone === 'neutral' && 'hover:border-white/60 focus-visible:ring-foreground/10',
          tone === 'neutral' && open && 'border-white/70 bg-white/40 ring-2 ring-white/32',
          buttonClassName,
        )}
      >
        <span className={cn('flex min-w-0 items-center gap-2 truncate', !value && 'text-muted-foreground')}>
          <Folder className={cn('h-4 w-4 shrink-0 text-primary', tone === 'neutral' && 'text-foreground/80', iconClassName)} />
          <span className="truncate">{selectedLabel}</span>
        </span>
        <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary', tone === 'neutral' && 'group-hover:bg-white/34 group-hover:text-foreground')}>
          <ChevronDown className={cn('h-4 w-4 transition duration-200', open && 'rotate-180')} />
        </span>
      </button>

      {open && (
        <div
          className={cn(
            'liquid-pop fixed z-[120] max-h-80 overflow-hidden rounded-3xl border border-white/70 bg-white/86 p-1.5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-2xl',
            menuClassName,
          )}
          style={menuStyle}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(239,35,60,0.13),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,255,255,0.2))]" />
          <div className="relative border-b border-white/70 p-1.5">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar categoria o subcategoria..."
                className={cn(
                  'h-10 w-full rounded-2xl border border-white/70 bg-white/72 pl-9 pr-9 text-sm font-medium outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10',
                  tone === 'neutral' && 'bg-white/38 focus:border-white/80 focus:ring-white/28',
                )}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className={cn('absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-white hover:text-primary', tone === 'neutral' && 'hover:text-foreground')}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
          </div>

          <div className="relative max-h-[17rem] overflow-y-auto pr-1" role="listbox" aria-label={ariaLabel || placeholder}>
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => select(null)}
              className={cn(
                'mb-1 flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition hover:bg-white/80 hover:text-foreground',
                !value && 'bg-white text-foreground shadow-sm',
              )}
            >
              <span className="truncate">{placeholder}</span>
              {!value && <Check className={cn('h-4 w-4 text-primary', tone === 'neutral' && 'text-foreground')} />}
            </button>

            {rows.map((row) => {
              const selected = value?.category === row.category && (value.subcategory ?? null) === row.subcategory
              return (
                <button
                  key={row.key}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => select({ category: row.category, subcategory: row.subcategory })}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-2xl py-2.5 pr-3 text-left text-sm font-medium transition hover:bg-white/80',
                    selected ? 'bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(239,35,60,0.22)]' : 'text-foreground',
                    tone === 'neutral' && !selected && 'hover:bg-white/46',
                    tone === 'neutral' && selected && 'border border-white/58 bg-white/52 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(30,35,48,0.10),0_14px_28px_-22px_rgba(20,24,36,0.38)] backdrop-blur-xl',
                  )}
                  style={{ paddingLeft: 12 + row.depth * 22 }}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-2xl', row.depth ? 'bg-primary/8 text-primary' : 'bg-primary/10 text-primary', selected && 'bg-white/20 text-white', tone === 'neutral' && 'bg-white/34 text-foreground/75', tone === 'neutral' && selected && 'bg-white/48 text-foreground')}>
                      {row.depth ? <Tag className="h-3.5 w-3.5" /> : <FolderOpen className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate">{row.label}</span>
                      <span className={cn('block truncate text-xs', selected ? 'text-white/75' : 'text-muted-foreground', tone === 'neutral' && selected && 'text-foreground/58')}>{row.hint}</span>
                    </span>
                  </span>
                  {selected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
