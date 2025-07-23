"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertTriangle, XCircle, Activity, Clock, Zap, Users, AlertCircle, Bug } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApiMonitor, type ApiHealthCheck, type ApiMetrics } from "@/lib/api-monitor"
import { ApiDebugger } from "./api-debugger"

interface ApiStatusDashboardProps {
  isLiveMode: boolean
}

export function ApiStatusDashboard({ isLiveMode }: ApiStatusDashboardProps) {
  const [health, setHealth] = useState<ApiHealthCheck | null>(null)
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null)
  const [showDebugger, setShowDebugger] = useState(false)

  const monitor = ApiMonitor.getInstance()

  useEffect(() => {
    // Subscribe to health updates
    const unsubscribe = monitor.subscribe((newHealth) => {
      setHealth(newHealth)
      setMetrics(monitor.getMetrics())
    })

    // Initial load
    setHealth(monitor.getHealth())
    setMetrics(monitor.getMetrics())

    return unsubscribe
  }, [monitor])

  const runConnectionTest = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      // Check if API is configured
      const configResponse = await fetch("/api/twitter")
      const configData = await configResponse.json()

      if (!configData.configured) {
        setTestResult({
          success: false,
          message: "Twitter API not configured. Add TWITTER_BEARER_TOKEN to your environment variables.",
          details: {
            setup: "Visit https://developer.twitter.com/en/portal/dashboard to get your Bearer Token",
            envVar: "TWITTER_BEARER_TOKEN=your_token_here (server-side only)",
          },
        })
        return
      }

      // Test API connection through our endpoint
      const testResponse = await fetch("/api/twitter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "/users/by",
          params: {
            usernames: "elonmusk",
            "user.fields": "verified",
          },
        }),
      })

      const testData = await testResponse.json()
      setTestResult({
        success: testResponse.ok,
        message: testResponse.ok ? "✅ Connection successful!" : testData.error || "Connection failed",
        details: testData,
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Connection test failed",
      })
    } finally {
      setTesting(false)
    }
  }

  // Add this new function after the existing testSpecificEndpoints function
  const runAutoTest = async () => {
    if (!isLiveMode) return

    console.log("🔍 Auto-testing API connection...")
    await runConnectionTest()
  }

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    // Auto-run test when component mounts in live mode
    if (isLiveMode && !testResult) {
      setTimeout(runAutoTest, 1000) // Small delay to let component settle
    }
  }, [isLiveMode])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-700 bg-green-50 border-green-200"
      case "degraded":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "down":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const formatTime = (date: Date | null) => {
    if (!date) return "Never"
    return date.toLocaleTimeString()
  }

  const getRateLimitPercentage = () => {
    if (!health) return 0
    return (health.rateLimitRemaining / 300) * 100
  }

  if (!health || !metrics) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Setup Instructions for Demo Mode */}
      {!isLiveMode && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-2">
              <div>
                <strong>Twitter API Setup Required:</strong>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  Get a Bearer Token from{" "}
                  <a
                    href="https://developer.twitter.com/en/portal/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Twitter Developer Portal
                  </a>
                </li>
                <li>
                  Add it as: <code className="bg-blue-100 px-1 rounded">TWITTER_BEARER_TOKEN=your_token</code>
                </li>
                <li>Refresh the page to enable live mode</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Status Card */}
      <Card className={`border ${getStatusColor(health.status)}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(health.status)}
              <span className="capitalize">API Status: {health.status}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={showDebugger} onOpenChange={setShowDebugger}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Bug className="w-3 h-3 mr-1" />
                    Advanced Debugger
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Twitter API Advanced Debugger</DialogTitle>
                  </DialogHeader>
                  <ApiDebugger />
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={runConnectionTest}
                disabled={testing}
                className="bg-transparent"
              >
                {testing ? "Testing..." : "Quick Test"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="w-3 h-3" />
                <span>Last Check</span>
              </div>
              <div className="font-medium">{formatTime(health.lastCheck)}</div>
            </div>
            <div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Zap className="w-3 h-3" />
                <span>Response Time</span>
              </div>
              <div className="font-medium">{health.responseTime}ms</div>
            </div>
            <div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Activity className="w-3 h-3" />
                <span>Success Rate</span>
              </div>
              <div className="font-medium">
                {metrics.totalRequests > 0 ? Math.round((metrics.successfulRequests / metrics.totalRequests) * 100) : 0}
                %
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="w-3 h-3" />
                <span>Total Requests</span>
              </div>
              <div className="font-medium">{metrics.totalRequests}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limit Card */}
      {isLiveMode && (
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Rate Limit Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Remaining Requests</span>
                <span className="font-medium">{health.rateLimitRemaining}/300</span>
              </div>
              <Progress value={getRateLimitPercentage()} className="h-2" />
              <div className="text-xs text-gray-600">
                Resets at: {health.rateLimitReset ? formatTime(health.rateLimitReset) : "Unknown"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResult && (
        <Card className={`border ${testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <div className={`font-medium ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                  {testResult.message}
                </div>
                {testResult.details && (
                  <div className="mt-2 text-sm text-gray-600">
                    <pre className="bg-white p-2 rounded border text-xs overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(testResult.details, null, 2)}
                    </pre>
                  </div>
                )}
                {!testResult.success && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDebugger(true)}
                      className="bg-transparent"
                    >
                      <Bug className="w-3 h-3 mr-1" />
                      Open Advanced Debugger
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Details */}
      {metrics.lastError && (
        <Card className="border border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-800">Last Error</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-red-700">
              <div className="font-medium mb-1">{metrics.lastError}</div>
              <div className="text-xs">
                Occurred at: {metrics.lastErrorTime ? formatTime(metrics.lastErrorTime) : "Unknown"}
              </div>
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDebugger(true)}
                  className="bg-transparent border-red-300 text-red-700"
                >
                  <Bug className="w-3 h-3 mr-1" />
                  Debug This Error
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Button */}
      <Button variant="outline" size="sm" onClick={() => monitor.reset()} className="w-full bg-transparent">
        Reset Metrics
      </Button>
    </div>
  )
}
