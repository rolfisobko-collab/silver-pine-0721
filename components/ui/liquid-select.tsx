'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LiquidSelectOption = {
  value: string
  label: string
}

type MenuStyle = Pick<CSSProperties, 'left' | 'top' | 'width'>

export function LiquidSelect({
  ariaLabel,
  buttonClassName,
  className,
  disabled,
  menuClassName,
  onChange,
  options,
  placeholder = 'Seleccionar',
  value,
}: {
  ariaLabel?: string
  buttonClassName?: string
  className?: string
  disabled?: boolean
  menuClassName?: string
  onChange: (value: string) => void
  options: LiquidSelectOption[]
  placeholder?: string
  value: string
}) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<MenuStyle>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  useEffect(() => {
    if (!open) return

    function syncPosition() {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      setMenuStyle({
        left: rect.left,
        top: rect.bottom + 8,
        width: rect.width,
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

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  return (
    <div ref={rootRef} className={cn('relative min-w-0', className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel || placeholder}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/78 px-4 py-3 text-left text-sm font-semibold text-foreground shadow-[0_12px_30px_rgba(15,23,42,0.08)] outline-none backdrop-blur-2xl transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/92 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
          open && 'border-primary/35 bg-white/95 ring-4 ring-primary/10',
          buttonClassName,
        )}
      >
        <span className={cn('truncate', !selected && 'text-muted-foreground')}>
          {selected?.label || placeholder}
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
          <ChevronDown className={cn('h-4 w-4 transition duration-200', open && 'rotate-180')} />
        </span>
      </button>

      {open && (
        <div
          className={cn(
            'liquid-pop fixed z-[120] max-h-72 overflow-hidden rounded-3xl border border-white/70 bg-white/82 p-1.5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-2xl',
            menuClassName,
          )}
          style={menuStyle}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(239,35,60,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.18))]" />
          <div className="relative max-h-[17rem] overflow-y-auto pr-1" role="listbox" aria-label={ariaLabel || placeholder}>
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className={cn(
                'mb-1 flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition hover:bg-white/80 hover:text-foreground',
                !value && 'bg-white text-foreground shadow-sm',
              )}
            >
              <span className="truncate">{placeholder}</span>
              {!value && <Check className="h-4 w-4 text-primary" />}
            </button>
            {options.map((option) => {
              const selectedOption = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selectedOption}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-white/80',
                    selectedOption
                      ? 'bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(239,35,60,0.22)]'
                      : 'text-foreground',
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {selectedOption && <Check className="h-4 w-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
