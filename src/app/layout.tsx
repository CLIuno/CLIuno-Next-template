import type { Metadata } from 'next'

import Navbar from '@/components/Navbar'
import '@/assets/globals.css'

export const metadata: Metadata = {
  title: 'CLIuno Next Template',
  description: 'CLIuno demo app built with Next.js',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="font-sans">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
