import type { Metadata } from 'next'
import './styles/globals.css'

export const metadata: Metadata = {
  title: 'SEO Analyzer Pro',
  description: 'Professional SEO analysis and optimization tool for websites',
  keywords: ['SEO', 'Audit', 'Keyword Research', 'Ranking'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-light">
        {children}
      </body>
    </html>
  )
}
