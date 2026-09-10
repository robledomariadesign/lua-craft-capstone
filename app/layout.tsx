import type { Metadata, Viewport } from 'next'
import { Newsreader, Karla } from 'next/font/google'
import './globals.css'

// Newsreader carries content — item names, the summary headline, record names
// in nav bars, button labels. Upright only; the italic axis is never loaded.
const newsreader = Newsreader({
  subsets: ['latin'],
  style: 'normal',
  variable: '--font-newsreader',
  display: 'swap',
})

// Karla carries everything else — nav, values, chips, notes, captions, links.
const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lua Craft Studio - Manufacturer handoff and approval',
  description: "Element-by-element review of a manufacturer's spec sheet against the studio's own record.",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${karla.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  )
}
