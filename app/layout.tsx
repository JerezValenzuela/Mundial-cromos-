import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'Panini FIFA 2026 — Álbum Colaborativo',
  description: 'Tracking de cromos Panini FIFA World Cup 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0, width: '100%' }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
