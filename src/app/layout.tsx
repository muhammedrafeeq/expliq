import '@/lib/env'
import type { Metadata } from 'next'
import { Open_Sans, DM_Sans, JetBrains_Mono, Exo_2 } from 'next/font/google'
import './globals.css'
import { ShellWrapper } from '@/components/layout/ShellWrapper'

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
})

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

const exo2 = Exo_2({
  variable: '--font-brand',
  subsets: ['latin'],
  weight: ['700', '800'],
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Expliq | Learn. Build. Grow.',
    template: '%s | Expliq',
  },
  description: "India's go-to source for technology tutorials, career tips, AI tools, device reviews, and student earnings.",
  keywords: ['technology tutorials', 'AI tools India', 'career tips', 'tech news India', 'student earning', 'device reviews'],
  authors: [{ name: 'Expliq', url: BASE_URL }],
  creator: 'Expliq',
  publisher: 'Expliq',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'Expliq',
    title: 'Expliq | Learn. Build. Grow.',
    description: "India's go-to source for technology tutorials, career tips, AI tools, device reviews, and student earnings.",
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Expliq' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@expliq_in',
    creator: '@expliq_in',
    title: 'Expliq | Learn. Build. Grow.',
    description: "India's go-to source for technology tutorials, career tips, AI tools, device reviews, and student earnings.",
    images: ['/og-default.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${openSans.variable} ${jetbrainsMono.variable} ${exo2.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  )
}
