import type { Metadata, Viewport } from 'next'
import { Hind } from 'next/font/google'
import './globals.css'

const fontHind = Hind({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'SPECTRA — Electrical Safety Command Center',
  description: 'Sistem SaaS Pemantauan Dini Kebakaran Panel Listrik Sekolah',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fontHind.variable} overflow-x-hidden max-w-full`}>
      <body className="font-sans antialiased bg-[#06080F] text-slate-100 overflow-x-hidden max-w-full w-full min-h-screen">{children}</body>
    </html>
  )
}
