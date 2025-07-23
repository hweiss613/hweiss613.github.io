"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, XCircle, Eye, Copy, RefreshCw, Bug } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DebugLog {
  timestamp: Date
  type: "request" | "response" | "error"
  endpoint: string
  params?: any
  response?: any
  error?: string
  status?: number
  headers?: any
}

export function ApiDebugger() {
  const [logs, setLogs] = useState<DebugLog[]>([])
  const [testing, setTesting] = useState(false)
  const [bearerToken, setBearerToken] = useState("")

  useEffect(() => {
    // Check API configuration through server endpoint
    const checkConfig = async () => {
      try {
        const response = await fetch("/api/twitter")
        const data = await response.json()
        setBearerToken(data.configured ? "Configured" : "Not configured")
      } catch (err) {
        setBearerToken("Error checking configuration")
      }
    }
    checkConfig()
  }, [])

  const addLog = (log: DebugLog) => {
    setLogs((prev) => [log, ...prev.slice(0, 49)]) // Keep last 50 logs
  }

  const runDiagnostics = async () => {
    setTesting(true)
    setLogs([]) // Clear previous logs

    try {
      // Test 1: Check Bearer Token Format
      addLog({
        timestamp: new Date(),
        type: "request",
        endpoint: "token-validation",
        params: { tokenStatus: bearerToken },
      })

      if (bearerToken !== "Configured") {
        addLog({
          timestamp: new Date(),
          type: "error",
          endpoint: "token-validation",
          error: "API not configured correctly",
        })
        return
      }

      addLog({
        timestamp: new Date(),
        type: "response",
        endpoint: "token-validation",
        response: { valid: true },
      })

      // Test 2: Direct API Call to Twitter
      await testDirectApiCall()

      // Test 3: Test through our API route
      await testApiRoute()

      // Test 4: Test specific endpoints
      await testSpecificEndpoints()
    } catch (error) {
      addLog({
        timestamp: new Date(),
        type: "error",
        endpoint: "diagnostics",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setTesting(false)
    }
  }

  const testDirectApiCall = async () => {
    try {
      addLog({
        timestamp: new Date(),
        type: "request",
        endpoint: "direct-twitter-api",
        params: { test: "Direct call to Twitter API" },
      })

      const response = await fetch("https://api.twitter.com/2/users/by?usernames=elonmusk&user.fields=verified", {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      })

      const responseData = await response.json()

      addLog({
        timestamp: new Date(),
        type: response.ok ? "response" : "error",
        endpoint: "direct-twitter-api",
        status: response.status,
        response: responseData,
        headers: {
          remaining: response.headers.get("x-rate-limit-remaining"),
          reset: response.headers.get("x-rate-limit-reset"),
          limit: response.headers.get("x-rate-limit-limit"),
        },
      })
    } catch (error) {
      addLog({
        timestamp: new Date(),
        type: "error",
        endpoint: "direct-twitter-api",
        error: error instanceof Error ? error.message : "Network error",
      })
    }
  }

  const testApiRoute = async () => {
    try {
      addLog({
        timestamp: new Date(),
        type: "request",
        endpoint: "api-route-test",
        params: { test: "Testing through Next.js API route" },
      })

      const response = await fetch("/api/twitter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "/users/by",
          params: {
            usernames: "elonmusk",
            "user.fields": "verified,public_metrics",
          },
          bearerToken: bearerToken,
        }),
      })

      const responseData = await response.json()

      addLog({
        timestamp: new Date(),
        type: response.ok ? "response" : "error",
        endpoint: "api-route-test",
        status: response.status,
        response: responseData,
      })
    } catch (error) {
      addLog({
        timestamp: new Date(),
        type: "error",
        endpoint: "api-route-test",
        error: error instanceof Error ? error.message : "Network error",
      })
    }
  }

  const testSpecificEndpoints = async () => {
    const endpoints = [
      {
        name: "users/by",
        endpoint: "/users/by",
        params: { usernames: "elonmusk", "user.fields": "verified" },
      },
      {
        name: "tweets/search/recent",
        endpoint: "/tweets/search/recent",
        params: {
          query: "from:elonmusk -is:retweet",
          max_results: "10",
          "tweet.fields": "created_at,public_metrics",
          "user.fields": "verified",
          expansions: "author_id",
        },
      },
    ]

    for (const test of endpoints) {
      try {
        addLog({
          timestamp: new Date(),
          type: "request",
          endpoint: test.name,
          params: test.params,
        })

        const response = await fetch("/api/twitter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: test.endpoint,
            params: test.params,
            bearerToken: bearerToken,
          }),
        })

        const responseData = await response.json()

        addLog({
          timestamp: new Date(),
          type: response.ok ? "response" : "error",
          endpoint: test.name,
          status: response.status,
          response: responseData,
        })

        // Add delay between requests
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        addLog({
          timestamp: new Date(),
          type: "error",
          endpoint: test.name,
          error: error instanceof Error ? error.message : "Network error",
        })
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case "response":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Eye className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusColor = (status?: number) => {
    if (!status) return "text-gray-500"
    if (status >= 200 && status < 300) return "text-green-600"
    if (status >= 400 && status < 500) return "text-red-600"
    if (status >= 500) return "text-purple-600"
    return "text-gray-500"
  }

  const analyzeErrors = () => {
    const errors = logs.filter((log) => log.type === "error" || (log.status && log.status >= 400))
    const errorCounts: Record<string, number> = {}

    errors.forEach((error) => {
      const key = error.status ? `${error.status}` : "Network Error"
      errorCounts[key] = (errorCounts[key] || 0) + 1
    })

    return errorCounts
  }

  const getErrorSolutions = (status: number | string) => {
    const solutions: Record<string, string[]> = {
      "400": [
        "Check that all parameters are valid for the endpoint",
        "Verify query syntax (use -is:retweet instead of exclude parameter)",
        "Ensure usernames exist and are spelled correctly",
        "Check that max_results is within allowed range (10-100)",
      ],
      "401": [
        "Verify your Bearer Token is correct",
        "Check that the token hasn't expired",
        "Ensure the token has the right permissions",
        "Try regenerating the Bearer Token in Twitter Developer Portal",
      ],
      "403": [
        "Check your app permissions in Twitter Developer Portal",
        "Verify your app has access to Twitter API v2",
        "Ensure you're not trying to access restricted content",
        "Check if your developer account is approved",
      ],
      "429": [
        "You've hit the rate limit (300 requests per 15 minutes)",
        "Wait for the rate limit to reset",
        "Implement caching to reduce API calls",
        "Consider using webhooks instead of polling",
      ],
      "Network Error": [
        "Check your internet connection",
        "Verify the API endpoint URL is correct",
        "Check if Twitter API is experiencing outages",
        "Try the request again after a few minutes",
      ],
    }

    return solutions[status.toString()] || ["Unknown error - check the response details"]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bug className="w-5 h-5" />
            <span>Twitter API Debugger</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This tool will help diagnose Twitter API issues by testing your configuration and making sample API
                calls. All requests are logged for analysis.
              </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-4">
              <Button onClick={runDiagnostics} disabled={testing} className="flex items-center space-x-2">
                <RefreshCw className={`w-4 h-4 ${testing ? "animate-spin" : ""}`} />
                <span>{testing ? "Running Diagnostics..." : "Run Full Diagnostics"}</span>
              </Button>

              {logs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(JSON.stringify(logs, null, 2))}
                  className="flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy All Logs</span>
                </Button>
              )}
            </div>

            {/* Token Info */}
            {bearerToken && (
              <div className="bg-gray-50 p-3 rounded border">
                <div className="text-sm">
                  <strong>API Configuration Status:</strong>
                  <div className="mt-1 font-mono text-xs">Status: {bearerToken}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {logs.length > 0 && (
        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Request Logs</TabsTrigger>
            <TabsTrigger value="analysis">Error Analysis</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            {logs.map((log, index) => (
              <Card key={index} className="border-l-4 border-l-gray-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getLogIcon(log.type)}
                      <span className="font-medium">{log.endpoint}</span>
                      {log.status && <span className={`text-sm ${getStatusColor(log.status)}`}>({log.status})</span>}
                      <span className="text-xs text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  {log.params && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-600">Parameters:</div>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(log.params, null, 2)}
                      </pre>
                    </div>
                  )}

                  {log.response && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-600">Response:</div>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40">
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  )}

                  {log.error && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-red-600">Error:</div>
                      <div className="text-sm text-red-700 bg-red-50 p-2 rounded mt-1">{log.error}</div>
                    </div>
                  )}

                  {log.headers && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-600">Rate Limit Info:</div>
                      <div className="text-xs bg-blue-50 p-2 rounded mt-1">
                        Remaining: {log.headers.remaining} | Reset: {log.headers.reset} | Limit: {log.headers.limit}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Error Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyzeErrors()).map(([error, count]) => (
                    <div key={error} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{error}</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">{count} occurrences</span>
                    </div>
                  ))}

                  {Object.keys(analyzeErrors()).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No errors found! Your API integration appears to be working correctly.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solutions" className="space-y-4">
            {Object.entries(analyzeErrors()).map(([error, count]) => (
              <Card key={error}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    How to Fix: {error} ({count} occurrences)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {getErrorSolutions(error).map((solution, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
