/**
 * Privacy Policy Page
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 2.4, 6.5, 6.6
 */

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-amber-400 hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-6 text-4xl font-bold text-amber-400">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-white/90">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-amber-400">
              Introduction
            </h2>
            <p>
              The Custard Screams ("we", "our", or "us") respects your privacy
              and is committed to protecting your personal data. This privacy
              policy explains how we use cookies and handle your information
              when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-amber-400">
              Cookies We Use
            </h2>
            
            <h3 className="mb-2 mt-4 text-xl font-bold text-white">
              Essential Cookies
            </h3>
            <p className="mb-2">
              These cookies are necessary for the website to function and cannot
              be disabled.
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>
                <strong>custard-screams-cookie-consent:</strong> Stores your
                cookie consent preferences
              </li>
              <li>
                <strong>custard-screams-consent-logs:</strong> Stores audit
                trail of your consent decisions
              </li>
            </ul>
            <p className="mt-2 text-sm text-white/70">
              Retention: 1 year
            </p>

            <h3 className="mb-2 mt-4 text-xl font-bold text-white">
              Analytics Cookies (Optional)
            </h3>
            <p className="mb-2">
              These cookies help us understand how visitors use our website.
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>
                <strong>Google Analytics:</strong> _ga, _ga_*, _gid, _gat
              </li>
              <li>
                Purpose: Measures website traffic and user behavior
              </li>
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline"
                >
                  Google Privacy Policy →
                </a>
              </li>
            </ul>
            <p className="mt-2 text-sm text-white/70">
              Retention: 2 years
            </p>

            <h3 className="mb-2 mt-4 text-xl font-bold text-white">
              Marketing Cookies (Optional)
            </h3>
            <p className="mb-2">
              These cookies are used by third parties to show relevant content.
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>
                <strong>Bandsintown:</strong> bit_*, bandsintown_*
              </li>
              <li>
                Purpose: Displays upcoming concert information and may track
                engagement
              </li>
              <li>
                <a
                  href="https://www.bandsintown.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline"
                >
                  Bandsintown Privacy Policy →
                </a>
              </li>
            </ul>
            <p className="mt-2 text-sm text-white/70">
              Retention: 1 year
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-amber-400">
              Third-Party Services
            </h2>
            <p className="mb-2">We use the following third-party services:</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                <strong>Google Analytics:</strong> For website traffic analysis
              </li>
              <li>
                <strong>Bandsintown:</strong> For displaying upcoming concert
                information
              </li>
            </ul>
            <p className="mt-2">
              These services may collect and process your data according to
              their own privacy policies. We only enable these services with
              your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-amber-400">
              Your Rights
            </h2>
            <p className="mb-2">Under GDPR, you have the right to:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Withdraw consent at any time</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-2">
              You can manage your cookie preferences at any time using the
              "Cookie Settings" link in the footer.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-amber-400">
              Data Retention
            </h2>
            <p>
              We retain cookie data for the periods specified above. You can
              delete cookies at any time through your browser settings or by
              withdrawing consent through our cookie settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-amber-400">
              Contact Us
            </h2>
            <p>
              If you have any questions about this privacy policy or our use of
              cookies, please contact us through our social media channels
              linked on the homepage.
            </p>
          </section>

          <section>
            <p className="text-sm text-white/70">
              Last updated: February 7, 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
