import type { Metadata } from 'next'
import { InfoPage } from '@/components/info/info-page'

export const metadata: Metadata = {
  title: 'Devoluciones',
  description: 'Como solicitar cambios o devoluciones en Alta Telefonia.',
}

export default function DevolucionesPage() {
  return (
    <InfoPage
      eyebrow="Cambios"
      title="Cambios y devoluciones"
      intro="Si hubo un error en el pedido o necesitás revisar un producto, contacta a Alta con los datos de la compra para resolverlo ordenado."
      sections={[
        {
          title: 'Producto sin uso',
          body: 'Para cambios comerciales, el producto debe conservar estado, embalaje y accesorios cuando corresponda.',
        },
        {
          title: 'Compatibilidad',
          body: 'En repuestos, se revisa marca, modelo y tipo de pieza para confirmar si el producto solicitado era el correcto.',
        },
        {
          title: 'Resolucion',
          body: 'El equipo confirma si corresponde cambio, nota de credito, revision tecnica o nueva compra.',
        },
      ]}
    />
  )
}
