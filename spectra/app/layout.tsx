import type { Metadata } from 'next'
import { Hind } from 'next/font/google'
import './globals.css'

const fontHind = Hind({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
})

export const metadata: Metadata = {
  title: 'SPECTRA — Electrical Safety Command Center',
  description: 'Sistem SaaS Pemantauan Dini Kebakaran Panel Listrik Sekolah',
  icons: {
    icon: '/spectra-logo.png',
    shortcut: '/spectra-logo.png',
    apple: '/spectra-logo.png',
  },
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
