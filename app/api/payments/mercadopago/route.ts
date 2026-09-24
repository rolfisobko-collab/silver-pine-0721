import { NextRequest, NextResponse } from 'next/server'
import { getStoreUrl } from '@/lib/integrations'

type CheckoutItem = {
  name: string
  quantity: number
  price: number
}

function webhookUrl(origin: string) {
  return process.env.MP_WEBHOOK_URL || `${origin.replace(/\/$/, '')}/api/payments/mercadopago/webhook`
}

export async function POST(req: NextRequest) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'MP_ACCESS_TOKEN no configurado' },
      { status: 501 },
    )
  }

  const payload = await req.json()
  const items = Array.isArray(payload.items) ? (payload.items as CheckoutItem[]) : []
  const origin = req.headers.get('origin') || getStoreUrl()

  const preference: Record<string, unknown> = {
    items: items.map((item) => ({
      title: item.name,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.price) || 0,
      currency_id: 'ARS',
    })),
    payer: {
      name: payload.customer?.name || undefined,
      email: payload.customer?.email || undefined,
    },
    back_urls: {
      success: `${origin}/cuenta/pedidos?payment=success`,
      failure: `${origin}/checkout?payment=failure`,
      pending: `${origin}/cuenta/pedidos?payment=pending`,
    },
    notification_url: webhookUrl(origin),
    external_reference: payload.orderId,
    metadata: {
      source: 'alta_ecommerce',
      order_id: payload.orderId,
    },
  }

  if (origin.startsWith('https://')) {
    preference.auto_return = 'approved'
  }

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preference),
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Mercado Pago rechazo la preferencia', detail: data },
      { status: 502 },
    )
  }

  return NextResponse.json({
    id: data.id,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
  })
}
