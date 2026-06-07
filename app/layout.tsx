import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import NavBar from '@/components/ui/NavBar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Collin | Portfolio',
  description: 'Computer Science Engineer — Portfolio of Collin',
  metadataBase: new URL('https://collinspace.in'),
  openGraph: {
    title: 'Collin | Portfolio',
    description: 'Computer Science Engineer',
    url: 'https://collinspace.in',
    siteName: 'collinspace.in',
    locale: 'en_US',
    type: 'website'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NavBar />
        <main>{children}</main>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
