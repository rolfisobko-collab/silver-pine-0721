'use client'

import { type ReactNode } from 'react'

export function LiquidNavShell({ children }: { children: ReactNode }) {
  return (
    <div className="nav-liquid-fallback mx-auto max-w-6xl rounded-2xl sm:rounded-full">
      {children}
    </div>
  )
}
