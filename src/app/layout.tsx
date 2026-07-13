import type { Metadata } from 'next'

import Navbar from '@/components/Navbar'
import '@/assets/globals.css'

export const metadata: Metadata = {
  title: 'CLIuno Next Template',
  description: 'CLIuno demo app built with Next.js',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
