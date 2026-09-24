import type { Metadata } from 'next'
import { InfoPage } from '@/components/info/info-page'

export const metadata: Metadata = {
  title: 'Servicio tecnico',
  description: 'Servicio tecnico de celulares, diagnostico y reparaciones.',
}

export default function ServicioTecnicoPage() {
  return (
    <InfoPage
      eyebrow="Reparaciones"
      title="Servicio tecnico"
      intro="Alta atiende consultas de diagnostico, reparacion y repuestos compatibles. Cuanto mas claro sea el modelo y la falla, mas rapido se puede responder."
      sections={[
        {
          title: 'Diagnostico',
          body: 'Indica marca, modelo, falla y si el equipo tuvo golpes, humedad o reparaciones anteriores.',
        },
        {
          title: 'Repuestos',
          body: 'Si buscas modulo, bateria, flex, glass u otra pieza, conviene pasar modelo exacto para evitar productos incompatibles.',
        },
        {
          title: 'Atencion',
          body: 'Las consultas tecnicas se derivan al contacto correcto para responder con criterio y no mezclar ventas con reparaciones.',
        },
      ]}
    />
  )
}
