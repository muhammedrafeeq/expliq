import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'

export const metadata: Metadata = {
  title: 'Contact Us | Expliq',
  description: 'Get in touch with the Expliq team for enquiries, partnerships, guest posts, or feedback.',
  alternates: { canonical: `${BASE_URL}/contact` },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
