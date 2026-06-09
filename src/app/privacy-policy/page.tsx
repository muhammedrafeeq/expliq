import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'

export const metadata: Metadata = {
  title: 'Privacy Policy | Expliq',
  description: 'Learn how Expliq collects, uses, and protects your personal information.',
  alternates: { canonical: `${BASE_URL}/privacy-policy` },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">Legal</p>
        <h1 className="font-serif font-extrabold text-4xl text-on-surface tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-sm text-on-surface-variant">Last updated: June 9, 2026</p>
      </div>

      <div className="prose prose-sm max-w-none text-on-surface space-y-8">

        <section>
          <p className="text-on-surface-variant leading-relaxed">
            Expliq ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit <strong>expliq.in</strong>. Please read this policy carefully.
          </p>
        </section>

        <Section title="1. Information We Collect">
          <p>We may collect the following types of information:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address when you subscribe to our newsletter or contact us.</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, device type, and referring URLs collected via analytics tools.</li>
            <li><strong>Cookies:</strong> Small data files stored on your device to improve your browsing experience and remember preferences such as theme (light/dark mode).</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul>
            <li>To send you our weekly newsletter (only if you subscribed).</li>
            <li>To improve and personalise your experience on Expliq.</li>
            <li>To analyse site traffic and usage patterns to make our content better.</li>
            <li>To respond to your enquiries and support requests.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </Section>

        <Section title="3. Cookies and Tracking Technologies">
          <p>
            We use first-party cookies to store your theme preference. We may also use third-party analytics services (such as Google Analytics) that place their own cookies to help us understand how visitors interact with our site. You can disable cookies through your browser settings, though some features may not function correctly as a result.
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>
            Expliq may contain links to third-party websites, affiliate products, and embedded content (e.g. YouTube videos). We are not responsible for the privacy practices of those third parties. We encourage you to read their privacy policies before providing any personal information.
          </p>
          <p>
            We may use the following third-party services: Google Analytics, Supabase (database), Vercel (hosting), and Unsplash (images). Each of these services has its own privacy policy.
          </p>
        </Section>

        <Section title="5. Newsletter">
          <p>
            If you subscribe to our newsletter, your email address is stored securely and used solely to send you our weekly digest. You can unsubscribe at any time by clicking the unsubscribe link in any email we send, or by contacting us directly.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your personal data only as long as necessary for the purposes outlined in this policy. Newsletter subscriber data is retained until you unsubscribe. Analytics data is retained in aggregate form.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Object to or restrict our processing of your data.</li>
            <li>Withdraw consent at any time (e.g. unsubscribe from newsletter).</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:hello@expliq.in" className="text-primary hover:underline">hello@expliq.in</a>.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Expliq is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect any changes. Continued use of Expliq after changes are posted constitutes acceptance of the revised policy.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have any questions about this Privacy Policy, please reach out to us at{' '}
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
