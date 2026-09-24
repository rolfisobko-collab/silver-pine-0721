import Image from 'next/image'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-flex h-10 w-28 items-center', className)}>
      <Image
        src="/alta-logo.png"
        alt="Alta Telefonia"
        fill
        sizes="112px"
        className="object-contain object-left"
        priority
      />
    </span>
  )
}
