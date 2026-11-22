import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ATLAS — Global Intelligence Command Center',
  description: 'Understand everything. Connect anything. An interactive intelligence platform for exploring the world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
