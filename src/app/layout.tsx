import type { Metadata } from 'next'
import { Inter, Exo } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const exo = Exo({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Synthesizer',
  description: 'Synthesizer',
  keywords: [
    "Synthesizer",
  ],
  creator: 'Andrew Kusakin',

  category: 'Music',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={exo.className}>{children}</body>
    </html>
  )
}
