import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const order = await req.json()
  const panelBase =
    process.env.ALTA_PANEL_ORDER_API_URL ||
    process.env.ALTA_PANEL_API_URL ||
    process.env.NEXT_PUBLIC_ALTA_PANEL_API_URL ||
    'https://alta-panel-production.up.railway.app'

  if (!panelBase) {
    return NextResponse.json(
      {
        ok: false,
        synced: false,
        reason: 'ALTA_PANEL_API_URL no configurado',
      },
      { status: 503 },
    )
  }

  const endpoint = panelBase.endsWith('/api/orders') ? panelBase : `${panelBase}/api/orders`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })

  const text = await res.text()
  let data: unknown = text
  try {
    data = JSON.parse(text)
  } catch {
    // Keep plain text.
  }

  return NextResponse.json(
    {
      ok: res.ok,
      synced: res.ok,
      panelStatus: res.status,
      panelResponse: data,
    },
    { status: res.ok ? 200 : 502 },
  )
}
