import { NextResponse } from 'next/server'
import { hasFirebaseClientConfig } from '@/lib/integrations'

export async function GET() {
  const panelUrl =
    process.env.ALTA_PANEL_API_URL ||
    process.env.NEXT_PUBLIC_ALTA_PANEL_API_URL ||
    'https://alta-panel-production.up.railway.app'
  const panelApi = Boolean(panelUrl)
  const mercadoPagoToken = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN)
  return NextResponse.json({
    firebaseGoogle: hasFirebaseClientConfig(),
    mercadoPago: mercadoPagoToken,
    mercadoPagoPublicKey: Boolean(process.env.MP_PUBLIC_KEY || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY),
    mercadoPagoWebhook: Boolean(process.env.MP_WEBHOOK_URL),
    mercadoPagoProduction: process.env.MP_PRODUCTION === 'true',
    sqlPanel: true,
    panelUrl,
    orderSync: Boolean(process.env.ALTA_PANEL_ORDER_API_URL || panelApi),
  })
}
