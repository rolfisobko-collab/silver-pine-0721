import { NextRequest, NextResponse } from 'next/server'

function panelBaseUrl() {
  return (
    process.env.ALTA_PANEL_API_URL ||
    process.env.NEXT_PUBLIC_ALTA_PANEL_API_URL ||
    'https://alta-panel-production.up.railway.app'
  ).replace(/\/$/, '')
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')?.trim().toLowerCase() || ''
  const clienteId = url.searchParams.get('clienteId')?.trim() || ''

  if (!email && !clienteId) {
    return NextResponse.json({ orders: [] })
  }

  const target = new URL('/api/orders', panelBaseUrl())
  target.searchParams.set('limit', '100')
  target.searchParams.set('ecommerce', '1')
  if (email) target.searchParams.set('email', email)
  if (clienteId) target.searchParams.set('clienteId', clienteId)

  const response = await fetch(target, { cache: 'no-store' })
  const data = await response.json().catch(() => ({}))
  return NextResponse.json(data, { status: response.status })
}
