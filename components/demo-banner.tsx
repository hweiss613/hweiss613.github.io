"use client"

import { Info, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function DemoBanner() {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <strong>Demo Mode:</strong> Showing sample content from verified conservative voices.
            <span className="hidden sm:inline"> Configure Twitter API for live updates.</span>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent text-xs"
              onClick={() => window.open("https://developer.twitter.com/en/portal/dashboard", "_blank")}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Get API Key
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
