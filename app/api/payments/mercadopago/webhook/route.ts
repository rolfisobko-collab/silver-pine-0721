import { NextRequest, NextResponse } from 'next/server'

function panelOrdersEndpoint() {
  const panelBase =
    process.env.ALTA_PANEL_ORDER_API_URL ||
    process.env.ALTA_PANEL_API_URL ||
    process.env.NEXT_PUBLIC_ALTA_PANEL_API_URL ||
    'https://alta-panel-production.up.railway.app'
  return panelBase.endsWith('/api/orders') ? panelBase : `${panelBase}/api/orders`
}

async function fetchPayment(paymentId: string) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN
  if (!token) throw new Error('MP_ACCESS_TOKEN no configurado')
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Mercado Pago payment ${res.status}: ${JSON.stringify(data)}`)
  return data
}

async function updatePanelOrder(payment: any) {
  const orderId = String(payment.external_reference || payment.metadata?.order_id || '').trim()
  if (!orderId) return { ok: false, skipped: 'sin external_reference' }

  const approved = payment.status === 'approved'
  const res = await fetch(panelOrdersEndpoint(), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: orderId,
      status: approved ? 'delivered' : 'pending',
      paymentStatus: approved ? 'paid' : payment.status,
      paymentMethod: 'mercadopago',
      paymentProvider: 'mercadopago',
      paymentId: String(payment.id || ''),
      paymentStatusDetail: payment.status_detail || null,
      paidAmount: Number(payment.transaction_amount || payment.total_paid_amount || 0) || 0,
    }),
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, panelStatus: res.status, panelResponse: data }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const topic = body.type || body.topic || req.nextUrl.searchParams.get('topic')
    const id = String(body.data?.id || body.id || req.nextUrl.searchParams.get('id') || '').trim()

    if (topic !== 'payment' || !id) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    const payment = await fetchPayment(id)
    const panel = await updatePanelOrder(payment)
    return NextResponse.json({ ok: true, paymentStatus: payment.status, panel })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Error en webhook Mercado Pago' },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  const id = String(req.nextUrl.searchParams.get('id') || '').trim()
  if (!id) return NextResponse.json({ ok: true, ready: true })
  try {
    const payment = await fetchPayment(id)
    const panel = await updatePanelOrder(payment)
    return NextResponse.json({ ok: true, paymentStatus: payment.status, panel })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Error en webhook Mercado Pago' },
      { status: 500 },
    )
  }
}
