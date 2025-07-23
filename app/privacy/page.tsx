import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Privacy Policy - National Storyline",
  description: "Privacy Policy for National Storyline news aggregation platform",
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-2xl font-bold text-[#1a365d]">
            National Storyline
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[#1a365d]">Privacy Policy</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">1. Introduction</h2>
              <p className="mb-4">
                National Storyline ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              <p className="mb-4">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
                please do not access the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">2.1 Information You Provide</h3>
              <p className="mb-4">We may collect information you voluntarily provide, such as:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Email addresses for newsletter subscriptions</li>
                <li>Contact information when you reach out to us</li>
                <li>Feedback and comments you submit</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">2.2 Automatically Collected Information</h3>
              <p className="mb-4">When you visit our website, we may automatically collect:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Referring website</li>
                <li>Pages viewed and time spent on site</li>
                <li>Device information</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#1a365d] mb-3">2.3 Third-Party Data</h3>
              <p className="mb-4">
                We aggregate publicly available content from social media platforms, primarily Twitter/X, in accordance
                with their terms of service and API guidelines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide and maintain our service</li>
                <li>Improve user experience</li>
                <li>Send newsletters and updates (with your consent)</li>
                <li>Respond to your inquiries</li>
                <li>Analyze website usage and trends</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">4. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in operating our website</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience. Cookies are small data
                files stored on your device. You can control cookie settings through your browser preferences.
              </p>
              <p className="mb-4">Types of cookies we use:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Essential cookies:</strong> Required for basic website functionality
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Help us understand how visitors use our site
                </li>
                <li>
                  <strong>Preference cookies:</strong> Remember your settings and preferences
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">6. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">7. Third-Party Services</h2>
              <p className="mb-4">
                Our website may contain links to third-party websites or integrate with third-party services. We are not
                responsible for the privacy practices of these third parties. We encourage you to review their privacy
                policies.
              </p>
              <p className="mb-4">Third-party services we use may include:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Twitter/X API for content aggregation</li>
                <li>Analytics services</li>
                <li>Content delivery networks</li>
                <li>Email service providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">8. Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
                <li>Withdrawal of consent</li>
              </ul>
              <p className="mb-4">To exercise these rights, please contact us using the information provided below.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">9. Children's Privacy</h2>
              <p className="mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If you become aware that a child has provided us with personal
                information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">10. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">11. Contact Us</h2>
              <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded">
                <p>
                  <strong>National Storyline</strong>
                  <br />
                  Email: privacy@nationalstoryline.com
                  <br />
                  Website:{" "}
                  <Link href="/" className="text-[#dc2626] hover:underline">
                    www.nationalstoryline.com
                  </Link>
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} National Storyline. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/terms" className="text-[#dc2626] hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-[#dc2626] hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
