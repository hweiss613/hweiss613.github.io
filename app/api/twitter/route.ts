import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { endpoint, params } = await request.json()

    // Get bearer token from server-side environment variable
    const bearerToken = process.env.TWITTER_BEARER_TOKEN

    console.log("Bearer token check:", {
      exists: !!bearerToken,
      length: bearerToken?.length || 0,
      startsWithAAAA: bearerToken?.startsWith("AAAA") || false,
    })

    // Validate bearer token - be more permissive
    if (!bearerToken || bearerToken.length < 10) {
      console.error("Twitter Bearer Token missing or too short")
      return NextResponse.json({ error: "Twitter API not configured - Bearer token missing" }, { status: 500 })
    }

    // Check if it's a placeholder token
    if (bearerToken.includes("your_") || bearerToken === "your_twitter_bearer_token_here") {
      console.error("Twitter Bearer Token appears to be a placeholder")
      return NextResponse.json(
        { error: "Twitter API not configured - Please set a real Bearer token" },
        { status: 500 },
      )
    }

    // Build the Twitter API URL
    const baseUrl = "https://api.twitter.com/2"
    const searchParams = new URLSearchParams()

    // Add all parameters to the URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    const url = `${baseUrl}${endpoint}?${searchParams.toString()}`

    console.log("Making request to Twitter API:", url)
    console.log("Parameters:", params)

    // Make the request to Twitter API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
        "User-Agent": "NationalStoryline/1.0",
      },
    })

    // Extract rate limit info from headers
    const rateLimitInfo = {
      remaining: Number.parseInt(response.headers.get("x-rate-limit-remaining") || "0"),
      reset: Number.parseInt(response.headers.get("x-rate-limit-reset") || "0"),
      limit: Number.parseInt(response.headers.get("x-rate-limit-limit") || "300"),
    }

    console.log("Rate limit info:", rateLimitInfo)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Twitter API error:", response.status, response.statusText, errorText)

      let errorMessage = `Twitter API error: ${response.status} ${response.statusText}`
      let errorDetails = null

      try {
        const errorData = JSON.parse(errorText)
        errorDetails = errorData

        if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.errors && errorData.errors[0]) {
          errorMessage = errorData.errors[0].message || errorMessage
        }

        // Handle specific error cases
        if (response.status === 400) {
          errorMessage = `Invalid request parameters: ${errorMessage}`
        } else if (response.status === 401) {
          errorMessage = "Invalid Twitter API credentials. Please check your Bearer Token."
        } else if (response.status === 403) {
          errorMessage = "Twitter API access forbidden. Check your app permissions."
        } else if (response.status === 429) {
          errorMessage = "Twitter API rate limit exceeded. Please wait before trying again."
        }
      } catch (e) {
        // Use the default error message if JSON parsing fails
        console.warn("Could not parse error response as JSON")
      }

      return NextResponse.json(
        {
          error: errorMessage,
          status: response.status,
          rateLimitInfo,
          details: errorDetails,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Twitter API response:", {
      dataCount: data.data?.length || 0,
      usersCount: data.includes?.users?.length || 0,
      resultCount: data.meta?.result_count || 0,
    })

    return NextResponse.json({
      result: data,
      rateLimitInfo,
      success: true,
    })
  } catch (error) {
    console.error("API route error:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        success: false,
      },
      { status: 500 },
    )
  }
}

// Add a GET endpoint to check if API is configured
export async function GET() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN

  console.log("API configuration check:", {
    tokenExists: !!bearerToken,
    tokenLength: bearerToken?.length || 0,
    isPlaceholder: bearerToken?.includes("your_") || bearerToken === "your_twitter_bearer_token_here",
  })

  const isConfigured = Boolean(
    bearerToken &&
      bearerToken.length > 10 &&
      !bearerToken.includes("your_") &&
      bearerToken !== "your_twitter_bearer_token_here",
  )

  return NextResponse.json({
    configured: isConfigured,
    message: isConfigured ? "Twitter API is configured" : "Twitter API not configured - check Bearer token",
    debug: {
      hasToken: !!bearerToken,
      tokenLength: bearerToken?.length || 0,
    },
  })
}
