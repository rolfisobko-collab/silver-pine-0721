import type { Metadata } from 'next'
import { InfoPage } from '@/components/info/info-page'

export const metadata: Metadata = {
  title: 'Sobre Alta',
  description: 'Informacion de Alta Telefonia, tienda y atencion.',
}

export default function SobreAltaPage() {
  return (
    <InfoPage
      eyebrow="Alta Telefonia"
      title="Tecnologia, repuestos y atencion cercana"
      intro="Alta Telefonia trabaja con accesorios, repuestos, equipos y servicio tecnico, con foco en resolver rapido y con informacion clara."
      sections={[
        {
          title: 'Catalogo real',
          body: 'La tienda muestra productos desde el catalogo conectado al sistema de Alta para mantener la informacion centralizada.',
        },
        {
          title: 'Atencion por area',
          body: 'Ventas, servicio tecnico, software y consultas automaticas tienen canales separados para ordenar mejor las respuestas.',
        },
        {
          title: 'Ubicacion',
          body: 'La atencion presencial se coordina desde Catamarca 1928, Posadas, Misiones.',
        },
      ]}
    />
  )
}
