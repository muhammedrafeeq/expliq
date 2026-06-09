import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'

export const metadata: Metadata = {
  title: 'Terms of Use | Expliq',
  description: 'Read the terms and conditions for using Expliq — India\'s technology content platform.',
  alternates: { canonical: `${BASE_URL}/terms` },
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-serif font-extrabold text-4xl text-on-surface tracking-tight mb-4">Terms of Use</h1>
        <p className="text-sm text-on-surface-variant">Last updated: June 9, 2026</p>
      </div>

      <div className="space-y-8">

        <section>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Welcome to Expliq. By accessing or using <strong className="text-on-surface">expliq.in</strong>, you agree to be bound by these Terms of Use. If you do not agree, please do not use our site.
          </p>
        </section>

        <Section title="1. Acceptance of Terms">
          <p>
            These Terms of Use govern your access to and use of the Expliq website, including all content, features, and services available on expliq.in. By browsing or using the site, you confirm that you are at least 13 years old and agree to these terms.
          </p>
        </Section>

        <Section title="2. Intellectual Property">
          <p>
            All content published on Expliq — including articles, tutorials, guides, graphics, logos, and code snippets — is the intellectual property of Expliq or its respective authors and is protected by Indian and international copyright laws.
          </p>
          <p>
            You may share links to our content and quote short excerpts with proper attribution. You may not reproduce, republish, or distribute our content in full without prior written permission.
          </p>
        </Section>

        <Section title="3. User Conduct">
          <p>When using Expliq, you agree not to:</p>
          <ul>
            <li>Scrape, crawl, or systematically download content from the site without permission.</li>
            <li>Use the site for any unlawful purpose or in violation of any applicable laws.</li>
            <li>Attempt to gain unauthorised access to any part of the site or its infrastructure.</li>
            <li>Transmit any malware, spam, or harmful content.</li>
            <li>Misrepresent your identity or affiliation with any person or organisation.</li>
          </ul>
        </Section>

        <Section title="4. Affiliate Disclaimer">
          <p>
            Expliq participates in affiliate marketing programmes. Some links on this site may be affiliate links, meaning we may earn a commission if you click through and make a purchase — at no additional cost to you. We only recommend products and services we genuinely believe in.
          </p>
        </Section>

        <Section title="5. Accuracy of Content">
          <p>
            We strive to keep all information on Expliq accurate and up-to-date. However, technology changes rapidly and some content may become outdated. All content is provided for informational and educational purposes only and should not be relied upon as professional advice.
          </p>
          <p>
            Expliq makes no warranties, express or implied, regarding the accuracy, completeness, or reliability of any content on the site.
          </p>
        </Section>

        <Section title="6. Third-Party Links">
          <p>
            Expliq may contain links to third-party websites, tools, or services. These links are provided for convenience only. We do not endorse or assume any responsibility for the content or practices of third-party sites.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, Expliq and its team shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or inability to use, the site or its content.
          </p>
        </Section>

        <Section title="8. Newsletter">
          <p>
            By subscribing to the Expliq newsletter, you consent to receive periodic emails from us. You can unsubscribe at any time. We do not share your email address with third parties for marketing purposes.
          </p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>
            We reserve the right to update these Terms of Use at any time. The "Last updated" date will reflect changes. Continued use of the site after updates constitutes acceptance of the revised terms.
          </p>
        </Section>

        <Section title="10. Governing Law">
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about these Terms? Reach us at{' '}
            <a href="mailto:hello@expliq.in" className="text-primary hover:underline">hello@expliq.in</a>{' '}
            or visit our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.
          </p>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif font-bold text-xl text-on-surface mb-3">{title}</h2>
      <div className="text-on-surface-variant leading-relaxed space-y-3 text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-on-surface">
        {children}
      </div>
    </section>
  )
}
