import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EmiDoc — Formalności za granicą krok po kroku',
  description: 'Spersonalizowana checklist dla Polaków pracujących w Norwegii, Austrii i Islandii. D-nummer, konto bankowe, karta podatkowa — wszystko w jednym miejscu.',
  keywords: 'praca za granicą, Norwegia, Austria, Islandia, D-nummer, formalności, emigracja',
  openGraph: {
    title: 'EmiDoc — Formalności za granicą krok po kroku',
    description: 'Checklist dla polskich emigrantów zarobkowych. 29 zł jednorazowo.',
    type: 'website',
    locale: 'pl_PL',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  )
}
