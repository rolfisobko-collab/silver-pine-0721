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
  subcategory: string
  brand: string
  image: string
  rating: number
  reviews: number
  colors: string[]
  featured?: boolean
  highlights: string[]
}

/** Category → subcategory tree used across the whole site. */
export const categoryTree: { name: Category; subcategories: string[] }[] = [
  { name: 'Audio', subcategories: ['Auriculares', 'Parlantes'] },
  { name: 'Teléfonos', subcategories: ['Smartphones', 'Fundas', 'Cargadores'] },
  { name: 'Computadoras', subcategories: ['Laptops', 'Tablets', 'Monitores'] },
  { name: 'Wearables', subcategories: ['Smartwatches', 'Bandas'] },
  { name: 'Accesorios', subcategories: ['Teclados', 'Mouse'] },
]

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
    subcategory: 'Auriculares',
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
    subcategory: 'Smartphones',
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
    subcategory: 'Laptops',
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
    subcategory: 'Smartwatches',
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
    subcategory: 'Auriculares',
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
    subcategory: 'Tablets',
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
    subcategory: 'Parlantes',
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
    subcategory: 'Teclados',
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
  {
    id: '9',
    slug: 'sonic-mini',
    name: 'Sonic Mini',
    tagline: 'Graves que caben en tu bolsillo',
    description:
      'Parlante ultracompacto con sonido sorprendentemente potente, 12 horas de batería y correa para llevarlo a todos lados.',
    price: 89,
    category: 'Audio',
    subcategory: 'Parlantes',
    brand: 'Lumen',
    image: '/products/speaker.png',
    rating: 4.3,
    reviews: 410,
    colors: ['Negro', 'Rojo'],
    highlights: [
      'Diseño ultracompacto',
      '12 h de batería',
      'Resistente al agua IPX5',
      'Correa integrada',
    ],
  },
  {
    id: '10',
    slug: 'lumen-phone-mini',
    name: 'Lumen Phone Mini',
    tagline: 'Todo el poder, la mitad del tamaño',
    description:
      'Smartphone compacto de 6.1" con el mismo chip insignia, cámara dual de 48 MP y una batería que rinde todo el día.',
    price: 899,
    category: 'Teléfonos',
    subcategory: 'Smartphones',
    brand: 'Lumen',
    image: '/products/smartphone.png',
    rating: 4.6,
    reviews: 1520,
    colors: ['Grafito', 'Blanco estelar', 'Rojo'],
    highlights: [
      'Formato compacto de 6.1"',
      'Chip Lumen A18',
      'Cámara dual 48 MP',
      'Batería todo el día',
    ],
  },
  {
    id: '11',
    slug: 'lumen-case-x',
    name: 'Lumen Case X',
    tagline: 'Protección que se siente premium',
    description:
      'Funda de silicona líquida con interior de microfibra, protección contra caídas y ajuste perfecto para el Lumen Phone X.',
    price: 49,
    category: 'Teléfonos',
    subcategory: 'Fundas',
    brand: 'Lumen',
    image: '/products/case.png',
    rating: 4.5,
    reviews: 980,
    colors: ['Rojo', 'Negro', 'Azul noche'],
    highlights: [
      'Silicona líquida suave',
      'Interior de microfibra',
      'Protección contra caídas',
      'Compatible con carga inalámbrica',
    ],
  },
  {
    id: '12',
    slug: 'lumen-charge-pro',
    name: 'Lumen Charge Pro',
    tagline: 'De 0 a 50% en 20 minutos',
    description:
      'Cargador USB-C de 65 W con tecnología GaN, cable trenzado incluido y protección inteligente contra sobrecarga.',
    price: 59,
    category: 'Teléfonos',
    subcategory: 'Cargadores',
    brand: 'Lumen',
    image: '/products/charger.png',
    rating: 4.7,
    reviews: 640,
    colors: ['Blanco'],
    highlights: [
      'Carga rápida de 65 W',
      'Tecnología GaN compacta',
      'Cable trenzado incluido',
      'Protección inteligente',
    ],
  },
  {
    id: '13',
    slug: 'lumen-view-27',
    name: 'Lumen View 27',
    tagline: 'Color que cobra vida',
    description:
      'Monitor 4K de 27" con cobertura P3 del 99%, marcos ultrafinos y calibración de fábrica para creativos exigentes.',
    price: 649,
    category: 'Computadoras',
    subcategory: 'Monitores',
    brand: 'Lumen',
    image: '/products/monitor.png',
    rating: 4.6,
    reviews: 320,
    colors: ['Plata'],
    highlights: [
      'Resolución 4K UHD',
      '99% DCI-P3',
      'Marcos ultrafinos',
      'USB-C con 90 W de carga',
    ],
  },
  {
    id: '14',
    slug: 'lumen-mouse',
    name: 'Lumen Mouse',
    tagline: 'Precisión que fluye',
    description:
      'Mouse inalámbrico ergonómico con sensor de alta precisión, scroll magnético y hasta 70 días de batería.',
    price: 79,
    category: 'Accesorios',
    subcategory: 'Mouse',
    brand: 'Lumen',
    image: '/products/mouse.png',
    rating: 4.5,
    reviews: 450,
    colors: ['Gris espacial', 'Plata'],
    highlights: [
      'Sensor de alta precisión',
      'Scroll magnético',
      '70 días de batería',
      'Multi-dispositivo',
    ],
  },
  {
    id: '15',
    slug: 'pulse-band',
    name: 'Pulse Band',
    tagline: 'Tu entrenamiento, medido',
    description:
      'Banda de actividad ligera con pantalla OLED, seguimiento de sueño, ritmo cardíaco 24/7 y 14 días de autonomía.',
    price: 99,
    category: 'Wearables',
    subcategory: 'Bandas',
    brand: 'Lumen',
    image: '/products/band.png',
    rating: 4.4,
    reviews: 1180,
    colors: ['Rojo', 'Negro'],
    highlights: [
      'Pantalla OLED',
      'Ritmo cardíaco 24/7',
      'Seguimiento de sueño',
      '14 días de batería',
    ],
  },
]

export const categories: Category[] = categoryTree.map((c) => c.name)

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getSubcategories(category: Category): string[] {
  return categoryTree.find((c) => c.name === category)?.subcategories ?? []
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
