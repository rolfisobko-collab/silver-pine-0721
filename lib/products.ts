export type Category =
  | 'Audio'
  | 'Teléfonos'
  | 'Computadoras'
  | 'Wearables'
  | 'Accesorios'

export type Product = {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  price: number
  category: Category
  brand: string
  image: string
  rating: number
  reviews: number
  colors: string[]
  featured?: boolean
  highlights: string[]
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'aura-pro-headphones',
    name: 'Aura Pro',
    tagline: 'Cancelación de ruido adaptativa',
    description:
      'Auriculares over-ear con cancelación de ruido inteligente, hasta 40 horas de batería y un escenario sonoro espacial que envuelve cada nota.',
    price: 349,
    category: 'Audio',
    brand: 'Lumen',
    image: '/products/headphones.png',
    rating: 4.8,
    reviews: 1240,
    colors: ['Negro medianoche', 'Plata', 'Azul noche'],
    featured: true,
    highlights: [
      'Cancelación de ruido adaptativa',
      '40 h de batería',
      'Audio espacial con seguimiento de cabeza',
      'Carga rápida USB-C',
    ],
  },
  {
    id: '2',
    slug: 'lumen-phone-x',
    name: 'Lumen Phone X',
    tagline: 'Titanio. Ligero. Imparable.',
    description:
      'Un smartphone insignia con chasis de titanio, pantalla OLED de 6.7", cámara de 50 MP y el chip más rápido de su generación.',
    price: 1099,
    category: 'Teléfonos',
    brand: 'Lumen',
    image: '/products/smartphone.png',
    rating: 4.9,
    reviews: 3820,
    colors: ['Titanio natural', 'Grafito', 'Blanco estelar'],
    featured: true,
    highlights: [
      'Chasis de titanio aeroespacial',
      'Pantalla OLED 120 Hz',
      'Sistema de cámara triple 50 MP',
      'Chip Lumen A18 Bionic',
    ],
  },
  {
    id: '3',
    slug: 'lumen-book-air',
    name: 'Lumen Book Air',
    tagline: 'Potencia que flota en tus manos',
    description:
      'Ultrabook de 13" con solo 1.1 kg, pantalla Liquid Retina, batería de 18 horas y rendimiento silencioso sin ventilador.',
    price: 1299,
    category: 'Computadoras',
    brand: 'Lumen',
    image: '/products/laptop.png',
    rating: 4.7,
    reviews: 980,
    colors: ['Gris espacial', 'Plata'],
    featured: true,
    highlights: [
      'Chip Lumen M4',
      '18 h de autonomía',
      'Pantalla Liquid Retina',
      'Diseño sin ventilador',
    ],
  },
  {
    id: '4',
    slug: 'pulse-watch-series-7',
    name: 'Pulse Watch S7',
    tagline: 'Tu salud, en tiempo real',
    description:
      'Smartwatch con ECG, sensor de oxígeno en sangre, GPS de doble frecuencia y una pantalla always-on brillante bajo el sol.',
    price: 429,
    category: 'Wearables',
    brand: 'Lumen',
    image: '/products/smartwatch.png',
    rating: 4.6,
    reviews: 2110,
    colors: ['Negro', 'Plata', 'Oro rosa'],
    featured: true,
    highlights: [
      'ECG y SpO2',
      'GPS de doble frecuencia',
      'Pantalla always-on',
      'Resistencia al agua 50 m',
    ],
  },
  {
    id: '5',
    slug: 'aura-buds',
    name: 'Aura Buds',
    tagline: 'Libertad sin cables',
    description:
      'Auriculares in-ear compactos con audio adaptativo, ajuste ergonómico y estuche de carga inalámbrica.',
    price: 199,
    category: 'Audio',
    brand: 'Lumen',
    image: '/products/earbuds.png',
    rating: 4.5,
    reviews: 1650,
    colors: ['Blanco', 'Negro'],
    highlights: [
      'Audio adaptativo',
      'Estuche con carga inalámbrica',
      'Resistencia al sudor IPX4',
      '24 h con estuche',
    ],
  },
  {
    id: '6',
    slug: 'lumen-pad-11',
    name: 'Lumen Pad 11',
    tagline: 'El lienzo que te sigue',
    description:
      'Tablet de 11" con pantalla laminada, soporte para lápiz de precisión y potencia de escritorio en un cuerpo ultrafino.',
    price: 799,
    category: 'Computadoras',
    brand: 'Lumen',
    image: '/products/tablet.png',
    rating: 4.7,
    reviews: 740,
    colors: ['Gris espacial', 'Azul'],
    highlights: [
      'Pantalla laminada de 11"',
      'Compatible con Lumen Pencil',
      'Chip Lumen M2',
      'USB-C Thunderbolt',
    ],
  },
  {
    id: '7',
    slug: 'sonic-speaker',
    name: 'Sonic 360',
    tagline: 'Sonido que llena la habitación',
    description:
      'Altavoz portátil con sonido envolvente de 360°, graves profundos y 20 horas de reproducción resistente al agua.',
    price: 179,
    category: 'Audio',
    brand: 'Lumen',
    image: '/products/speaker.png',
    rating: 4.4,
    reviews: 890,
    colors: ['Negro', 'Verde bosque'],
    highlights: [
      'Sonido envolvente 360°',
      'Resistente al agua IP67',
      '20 h de reproducción',
      'Emparejamiento estéreo',
    ],
  },
  {
    id: '8',
    slug: 'lumen-keys',
    name: 'Lumen Keys',
    tagline: 'Escribe como en las nubes',
    description:
      'Teclado mecánico de bajo perfil, inalámbrico, con retroiluminación adaptativa y estructura de aluminio unibody.',
    price: 149,
    category: 'Accesorios',
    brand: 'Lumen',
    image: '/products/keyboard.png',
    rating: 4.6,
    reviews: 520,
    colors: ['Gris espacial'],
    highlights: [
      'Switches de bajo perfil',
      'Retroiluminación adaptativa',
      'Estructura de aluminio',
      'Multi-dispositivo Bluetooth',
    ],
  },
]

export const categories: Category[] = [
  'Audio',
  'Teléfonos',
  'Computadoras',
  'Wearables',
  'Accesorios',
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
