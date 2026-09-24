'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { LiquidGlass, type LiquidGlassRef } from '@specy/liquid-glass-react'

export function LiquidNavShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const glassRef = useRef<LiquidGlassRef>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const glassStyle = useMemo(
    () => ({
      depth: 0.78,
      segments: 64,
      radius: 0.52,
      roughness: 0.025,
      transmission: 0.98,
      reflectivity: 0.72,
      ior: 1.46,
      dispersion: 0.18,
      thickness: 0.86,
    }),
    [],
  )

  const wrapperStyle = useMemo(
    () => ({
      width: '100%',
      maxWidth: '72rem',
      margin: '0 auto',
    }),
    [],
  )

  useEffect(() => {
    if (!mounted) return
    let frame = 0
    let lastScreenshot = 0

    function refreshGlass() {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        glassRef.current?.forcePositionUpdate()
        const now = Date.now()
        if (now - lastScreenshot > 180) {
          lastScreenshot = now
          glassRef.current?.updateScreenshot().catch(() => undefined)
        }
      })
    }

    window.addEventListener('scroll', refreshGlass, { passive: true })
    window.addEventListener('resize', refreshGlass, { passive: true })
    refreshGlass()

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', refreshGlass)
      window.removeEventListener('resize', refreshGlass)
    }
  }, [mounted])

  if (!mounted) {
    return <div className="nav-liquid-fallback mx-auto max-w-6xl rounded-2xl sm:rounded-full">{children}</div>
  }

  return (
    <LiquidGlass
      ref={glassRef}
      glassStyle={glassStyle}
      wrapperStyle={wrapperStyle}
      style={`
        width: 100%;
        border-radius: 9999px;
        min-height: 58px;
        padding: 0;
        background: rgba(255,255,255,0.18);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.92),
          inset 0 -1px 0 rgba(28,32,42,0.15),
          inset 1px 0 0 rgba(255,255,255,0.38),
          inset -1px 0 0 rgba(20,24,36,0.05),
          0 18px 48px -34px rgba(20,24,36,0.42);
      `}
    >
      {children}
    </LiquidGlass>
  )
}
