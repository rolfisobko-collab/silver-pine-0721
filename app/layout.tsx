import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart-context'
import { AuthProvider } from '@/components/auth-context'
import { AiAssistant } from '@/components/ai/ai-assistant'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteDescription =
  'Repuestos, accesorios, equipos y servicio tecnico en Alta Telefonia. Compra simple, catalogo real y atencion por WhatsApp.'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.altatelefonia.com.ar'),
  title: {
    default: 'Alta Telefonia',
    template: '%s | Alta Telefonia',
  },
  description: siteDescription,
  applicationName: 'Alta Telefonia',
  keywords: [
    'Alta Telefonia',
    'repuestos celulares',
    'accesorios celulares',
    'servicio tecnico',
    'Posadas',
    'Misiones',
  ],
  icons: {
    icon: '/alta-logo.png',
    shortcut: '/alta-logo.png',
    apple: '/alta-logo.png',
  },
  openGraph: {
    title: 'Alta Telefonia',
    description: siteDescription,
    url: '/',
    siteName: 'Alta Telefonia',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/alta-logo.png',
        width: 1200,
        height: 630,
        alt: 'Alta Telefonia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alta Telefonia',
    description: siteDescription,
    images: ['/alta-logo.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f5f7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <AiAssistant />
          </CartProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
