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
  const uid = url.searchParams.get('uid')?.trim() || ''

  const base = panelBaseUrl()

  if (!email && !uid) {
    return NextResponse.json({ profile: null, configured: Boolean(base) })
  }

  if (!base) {
    return NextResponse.json({
      profile: null,
      configured: false,
      reason: 'ALTA_PANEL_API_URL no configurado',
    })
  }

  const target = new URL('/api/customers/profile', base)
  if (email) target.searchParams.set('email', email)
  if (uid) target.searchParams.set('uid', uid)

  const response = await fetch(target, { cache: 'no-store' })
  const data = await response.json().catch(() => ({}))
  return NextResponse.json(data, { status: response.status })
}
