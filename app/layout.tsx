import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Panini FIFA 2026 - Álbum Colaborativo',
  description: 'Tracking de cromos Panini FIFA World Cup 2026',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-[#0a1628]">{children}</body>
    </html>
  )
}
