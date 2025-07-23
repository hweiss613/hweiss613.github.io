import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Terms of Service - National Storyline",
  description: "Terms of Service for National Storyline news aggregation platform",
}

export default function TermsOfService() {
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
            <CardTitle className="text-3xl font-bold text-[#1a365d]">Terms of Service</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using National Storyline ("we," "our," or "us"), you accept and agree to be bound by
                the terms and provision of this agreement. If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">2. Description of Service</h2>
              <p className="mb-4">
                National Storyline is a news aggregation platform that curates and displays public content from verified
                social media accounts, primarily Twitter/X. We provide commentary and analysis on current events and
                political developments.
              </p>
              <p className="mb-4">Our service includes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Aggregation of public social media posts</li>
                <li>News analysis and commentary</li>
                <li>Categorization of content by topic</li>
                <li>Search and filtering capabilities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">3. User Conduct</h2>
              <p className="mb-4">You agree not to use the service to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malicious software or content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">4. Content and Intellectual Property</h2>
              <p className="mb-4">
                The content displayed on National Storyline is sourced from public social media platforms and is owned
                by the original creators. We respect intellectual property rights and comply with the Digital Millennium
                Copyright Act (DMCA).
              </p>
              <p className="mb-4">
                Our original commentary, analysis, and website design are protected by copyright and other intellectual
                property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">5. Third-Party Content</h2>
              <p className="mb-4">
                National Storyline aggregates content from third-party sources, including Twitter/X. We are not
                responsible for the accuracy, completeness, or reliability of third-party content. The views expressed
                in aggregated content do not necessarily reflect our views.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">6. Privacy</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our{" "}
                <Link href="/privacy" className="text-[#dc2626] hover:underline">
                  Privacy Policy
                </Link>
                , which also governs your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">7. Disclaimers</h2>
              <p className="mb-4">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law,
                this Company:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Excludes all representations and warranties relating to this website and its contents or which is or
                  may be provided by any affiliates or any other third party
                </li>
                <li>
                  Excludes all liability for damages arising out of or in connection with your use of this website
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">8. Limitation of Liability</h2>
              <p className="mb-4">
                National Storyline shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of
                data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">9. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                posting to the website. Your continued use of the service after changes are posted constitutes your
                acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a365d] mb-4">10. Contact Information</h2>
              <p className="mb-4">If you have any questions about these Terms of Service, please contact us at:</p>
              <div className="bg-gray-50 p-4 rounded">
                <p>
                  <strong>National Storyline</strong>
                  <br />
                  Email: legal@nationalstoryline.com
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
