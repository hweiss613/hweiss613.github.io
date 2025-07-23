import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const metadata = {
  title: "Authentication Callback - National Storyline",
  description: "Twitter API authentication callback page",
}

export default function AuthCallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#1a365d]">Authentication Complete</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">Your Twitter API authentication has been processed successfully.</p>
          <p className="text-sm text-gray-500">
            This page is used for Twitter API authentication callbacks. You can now close this window or return to the
            main site.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-[#dc2626] text-white rounded-md hover:bg-[#b91c1c] transition-colors"
            >
              Return to National Storyline
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
