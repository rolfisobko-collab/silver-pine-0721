import type { Metadata } from 'next'
import { InfoPage } from '@/components/info/info-page'

export const metadata: Metadata = {
  title: 'Envios',
  description: 'Opciones de envio y retiro para pedidos de Alta Telefonia.',
}

export default function EnviosPage() {
  return (
    <InfoPage
      eyebrow="Entregas"
      title="Envios y retiro"
      intro="Alta coordina cada entrega segun zona, producto y disponibilidad. La idea es que el cliente compre sin vueltas y reciba una confirmacion clara."
      sections={[
        {
          title: 'Retiro en local',
          body: 'Podes retirar en Catamarca 1928, Posadas, una vez que el pedido este confirmado por el equipo.',
        },
        {
          title: 'Envios locales',
          body: 'Para entregas dentro de la zona, Alta confirma costo, horario y forma de entrega antes de despachar.',
        },
        {
          title: 'Envios a distancia',
          body: 'Si estas fuera de la ciudad, se coordina el envio disponible y se informan los datos necesarios antes de preparar el pedido.',
        },
      ]}
    />
  )
}
