import type { Metadata } from 'next'
import { InfoPage } from '@/components/info/info-page'

export const metadata: Metadata = {
  title: 'Como comprar',
  description: 'Pasos para comprar en Alta Telefonia de forma simple.',
}

export default function ComoComprarPage() {
  return (
    <InfoPage
      eyebrow="Compra simple"
      title="Como comprar en Alta Telefonia"
      intro="Elegis el producto, armas el carrito y confirmas el pedido. Si hace falta validar compatibilidad, el equipo de Alta te acompana antes de cerrar la compra."
      sections={[
        {
          title: '1. Busca por producto o compatibilidad',
          body: 'Podes usar el buscador, filtrar por categoria o elegir marca, modelo y tipo de repuesto para encontrar lo compatible.',
        },
        {
          title: '2. Agrega al carrito',
          body: 'Revisa cantidad, precio y detalle del producto antes de confirmar. Si un producto requiere confirmacion, te lo aclaramos por WhatsApp.',
        },
        {
          title: '3. Coordina entrega o retiro',
          body: 'Despues de enviar el pedido, una persona de Alta confirma disponibilidad, forma de pago y entrega.',
        },
      ]}
    />
  )
}
