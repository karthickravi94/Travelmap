import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/ui/Providers'
import { Navbar } from '@/components/ui/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'TravelMap — Your World, Your Journey',
  description: 'Track your travels, explore the world, and relive your adventures with an interactive map.',
  keywords: ['travel', 'map', 'journal', 'adventures', 'world travel'],
  openGraph: {
    title: 'TravelMap — Your World, Your Journey',
    description: 'Track your travels, explore the world, and relive your adventures.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
