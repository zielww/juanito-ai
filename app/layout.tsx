import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Juan 4 All',
  description: 'Juan 4 All: Your Personal Travel Companion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
