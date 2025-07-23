"use client"

import { useState } from "react"
import { CheckCircle, AlertTriangle, ExternalLink, RefreshCw, BarChart3, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApiStatusDashboard } from "./api-status-dashboard"

interface ApiStatusBannerProps {
  isLiveMode: boolean
  error: string | null
  lastUpdated: Date | null
  onRefresh: () => void
  loading: boolean
}

export function ApiStatusBanner({ isLiveMode, error, lastUpdated, onRefresh, loading }: ApiStatusBannerProps) {
  const [showDashboard, setShowDashboard] = useState(false)

  if (isLiveMode && !error) {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>🟢 Live Mode Active:</strong> Connected to Twitter API •
              {lastUpdated && ` Last updated: ${lastUpdated.toLocaleTimeString()}`}
              <div className="text-xs mt-1 opacity-75">
                Conservative API usage • 30min auto-refresh • Aggressive caching enabled
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent text-xs"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    API Status
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Twitter API Status Dashboard</DialogTitle>
                  </DialogHeader>
                  <ApiStatusDashboard isLiveMode={isLiveMode} />
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent text-xs"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (isLiveMode && error) {
    const isRateLimit = error.includes("Rate limit") || error.includes("rate limit")

    return (
      <Alert className={`mb-6 ${isRateLimit ? "border-orange-200 bg-orange-50" : "border-yellow-200 bg-yellow-50"}`}>
        <AlertTriangle className={`h-4 w-4 ${isRateLimit ? "text-orange-600" : "text-yellow-600"}`} />
        <AlertDescription className={isRateLimit ? "text-orange-800" : "text-yellow-800"}>
          <div className="flex items-center justify-between">
            <div>
              <strong>{isRateLimit ? "⏳ Rate Limited:" : "⚠️ API Issue:"}</strong> {error}
              <div className="text-xs mt-1 opacity-75 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {isRateLimit
                  ? "Using cached content • Will retry automatically in 15+ minutes"
                  : "Showing cached/fallback content • Will retry automatically"}
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${isRateLimit ? "border-orange-300 text-orange-700 hover:bg-orange-100" : "border-yellow-300 text-yellow-700 hover:bg-yellow-100"} bg-transparent text-xs`}
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Status
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Twitter API Status Dashboard</DialogTitle>
                  </DialogHeader>
                  <ApiStatusDashboard isLiveMode={isLiveMode} />
                </DialogContent>
              </Dialog>
              {!isRateLimit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={loading}
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 bg-transparent text-xs"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Demo mode
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <AlertTriangle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <strong>Demo Mode:</strong> Add your Twitter API key to see live tweets
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent text-xs"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Test Setup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Twitter API Setup & Testing</DialogTitle>
                </DialogHeader>
                <ApiStatusDashboard isLiveMode={isLiveMode} />
              </DialogContent>
            </Dialog>
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
