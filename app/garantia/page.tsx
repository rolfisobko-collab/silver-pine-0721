import type { Metadata } from 'next'
import { InfoPage } from '@/components/info/info-page'

export const metadata: Metadata = {
  title: 'Garantia',
  description: 'Informacion de garantia para productos y servicio tecnico.',
}

export default function GarantiaPage() {
  return (
    <InfoPage
      eyebrow="Postventa"
      title="Garantia y revision"
      intro="La garantia depende del producto, del estado de instalacion y de las condiciones informadas al momento de la compra."
      sections={[
        {
          title: 'Conserva el comprobante',
          body: 'Para revisar un reclamo, Alta puede solicitar comprobante, fecha de compra y estado del producto.',
        },
        {
          title: 'Repuestos y accesorios',
          body: 'Se valida el producto puntual, la compatibilidad y si corresponde revision tecnica antes de definir el cambio.',
        },
        {
          title: 'Servicio tecnico',
          body: 'Los trabajos de reparacion se revisan caso por caso. Si hay diagnostico previo, conviene enviarlo por WhatsApp.',
        },
      ]}
    />
  )
}
