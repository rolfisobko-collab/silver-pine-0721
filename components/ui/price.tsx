import { cn } from '@/lib/utils'

type PriceProps = {
  value: number
  className?: string
  centsClassName?: string
}

export function Price({ value, className, centsClassName }: PriceProps) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0
  const amount = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(safeValue))

  return (
    <span className={cn('inline-flex items-baseline gap-1 tabular-nums tracking-normal', className)}>
      <span className={cn('text-[0.68em] font-black uppercase opacity-70', centsClassName)}>ARS</span>
      <span>$</span>
      <span>{amount}</span>
    </span>
  )
}
