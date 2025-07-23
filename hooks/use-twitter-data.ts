"use client"

import { useState, useEffect, useCallback } from "react"
import { TweetProcessor, type ProcessedTweet } from "@/lib/tweet-processor"

interface UseTwitterDataOptions {
  refreshInterval?: number // in milliseconds
  maxResults?: number
  category?: string
}

interface UseTwitterDataReturn {
  tweets: ProcessedTweet[]
  loading: boolean
  error: string | null
  refreshTweets: () => Promise<void>
  lastUpdated: Date | null
  isLiveMode: boolean
}

export function useTwitterData({
  refreshInterval = 1800000, // 30 minutes - much longer to avoid rate limits
  maxResults = 15, // Reduced further
  category = "all",
}: UseTwitterDataOptions = {}): UseTwitterDataReturn {
  const [tweets, setTweets] = useState<ProcessedTweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  const [isLiveMode, setIsLiveMode] = useState(false)

  // Check if API is configured on mount
  useEffect(() => {
    const checkApiConfig = async () => {
      try {
        console.log("🔍 Checking API configuration...")
        const response = await fetch("/api/twitter")
        const data = await response.json()

        console.log("API config response:", data)

        setIsLiveMode(data.configured)

        if (!data.configured) {
          console.warn("⚠️ API not configured:", data.message)
          setError("Twitter API not configured - using demo mode")
        }
      } catch (err) {
        console.error("Failed to check API configuration:", err)
        setIsLiveMode(false)
        setError("Could not check API configuration - using demo mode")
      }
    }

    checkApiConfig()
  }, [])

  const fetchTweets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // If not in live mode, use demo content
      if (!isLiveMode) {
        console.log("🎭 Running in demo mode - using sample content")
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockTweets = getMockTweets()
        const filteredTweets =
          category === "all" ? mockTweets : mockTweets.filter((tweet) => tweet.category === category)

        setTweets(filteredTweets.slice(0, maxResults))
        setLastUpdated(new Date())
        setError("Demo mode: Add TWITTER_BEARER_TOKEN environment variable for live tweets")
        setHasInitialLoad(true)
        return
      }

      // AGGRESSIVE CACHING - Check if we have recent cached data first
      const cacheKey = `tweets_cache_${category}_${maxResults}`
      const cachedData = localStorage.getItem(cacheKey)
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`)

      if (cachedData && cacheTimestamp) {
        const cacheAge = Date.now() - Number.parseInt(cacheTimestamp)
        const maxCacheAge = 15 * 60 * 1000 // 15 minutes

        if (cacheAge < maxCacheAge) {
          console.log("🔄 Using cached data to avoid API calls")
          const cached = JSON.parse(cachedData)
          setTweets(cached)
          setLastUpdated(new Date(Number.parseInt(cacheTimestamp)))
          setError("Using cached data to preserve API limits")
          setHasInitialLoad(true)
          setLoading(false)
          return
        }
      }

      // Only make API calls if we really need to and haven't hit rate limits recently
      const rateLimitKey = "twitter_rate_limit_hit"
      const rateLimitTime = localStorage.getItem(rateLimitKey)

      if (rateLimitTime) {
        const timeSinceLimit = Date.now() - Number.parseInt(rateLimitTime)
        const waitTime = 15 * 60 * 1000 // 15 minutes

        if (timeSinceLimit < waitTime) {
          console.log("⏳ Rate limit recently hit, using cached data")
          if (cachedData) {
            const cached = JSON.parse(cachedData)
            setTweets(cached)
            setLastUpdated(new Date(Number.parseInt(cacheTimestamp || "0")))
            setError(
              `Rate limit hit recently. Using cached data. Will retry in ${Math.ceil((waitTime - timeSinceLimit) / 60000)} minutes.`,
            )
          } else {
            // Use mock data if no cache
            const mockTweets = getMockTweets()
            const filteredTweets =
              category === "all" ? mockTweets : mockTweets.filter((tweet) => tweet.category === category)
            setTweets(filteredTweets.slice(0, maxResults))
            setLastUpdated(new Date())
            setError("Rate limit hit. Showing sample data.")
          }
          setHasInitialLoad(true)
          setLoading(false)
          return
        }
      }

      // Only proceed with API call if we really need fresh data
      console.log("📡 Making careful API request...")

      try {
        // Make request to our API route
        const response = await fetch("/api/twitter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: "/tweets/search/recent",
            params: {
              query: "from:elonmusk OR from:JackPosobiec -is:retweet -is:reply",
              max_results: Math.min(maxResults, 15).toString(),
              "tweet.fields": "created_at,public_metrics,author_id",
              "user.fields": "verified,public_metrics,profile_image_url",
              expansions: "author_id",
              sort_order: "recency",
            },
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))

          // If it's a configuration error, switch to demo mode
          if (errorData.error?.includes("not configured")) {
            console.warn("🔧 API configuration issue, switching to demo mode")
            setIsLiveMode(false)

            const mockTweets = getMockTweets()
            const filteredTweets =
              category === "all" ? mockTweets : mockTweets.filter((tweet) => tweet.category === category)
            setTweets(filteredTweets.slice(0, maxResults))
            setLastUpdated(new Date())
            setError("Configuration issue: " + errorData.error)
            setHasInitialLoad(true)
            setLoading(false)
            return
          }

          throw new Error(errorData.error || `API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.result && data.result.data && data.result.data.length > 0) {
          const users = data.result.includes?.users || []
          const processedTweets = TweetProcessor.processTweets(data.result.data, users)

          const filteredTweets =
            category === "all" ? processedTweets : processedTweets.filter((tweet) => tweet.category === category)

          setTweets(filteredTweets.slice(0, maxResults))
          setLastUpdated(new Date())
          setError(null)

          // Cache the successful result
          localStorage.setItem(cacheKey, JSON.stringify(filteredTweets.slice(0, maxResults)))
          localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())

          console.log(`✅ Successfully loaded ${filteredTweets.length} live tweets`)
        } else {
          console.warn("⚠️ No tweet data received from API")
          setError("API returned no data - using cached content")

          // Use cached data or fallback
          if (cachedData) {
            const cached = JSON.parse(cachedData)
            setTweets(cached)
            setLastUpdated(new Date(Number.parseInt(cacheTimestamp || "0")))
          } else {
            const mockTweets = getMockTweets()
            const filteredTweets =
              category === "all" ? mockTweets : mockTweets.filter((tweet) => tweet.category === category)
            setTweets(filteredTweets.slice(0, maxResults))
            setLastUpdated(new Date())
          }
        }
      } catch (apiError) {
        console.error("❌ API request failed:", apiError)

        let errorMessage = "API request failed"
        if (apiError instanceof Error) {
          if (apiError.message.includes("429") || apiError.message.includes("Rate limit")) {
            errorMessage = "Rate limit exceeded. Using cached data."
            // Remember that we hit rate limit
            localStorage.setItem(rateLimitKey, Date.now().toString())
          } else if (apiError.message.includes("401")) {
            errorMessage = "Invalid Twitter API credentials"
          } else if (apiError.message.includes("403")) {
            errorMessage = "Twitter API access forbidden"
          } else {
            errorMessage = `API Error: ${apiError.message}`
          }
        }

        setError(errorMessage)

        // Always use cached data or fallback
        if (cachedData) {
          const cached = JSON.parse(cachedData)
          setTweets(cached)
          setLastUpdated(new Date(Number.parseInt(cacheTimestamp || "0")))
        } else {
          const mockTweets = getMockTweets()
          const filteredTweets =
            category === "all" ? mockTweets : mockTweets.filter((tweet) => tweet.category === category)
          setTweets(filteredTweets.slice(0, maxResults))
          setLastUpdated(new Date())
        }
      }
    } catch (err) {
      console.error("💥 Unexpected error:", err)
      setError("Unexpected error - using fallback data")

      // Always provide fallback data
      const mockTweets = getMockTweets()
      const filteredTweets = category === "all" ? mockTweets : mockTweets.filter((tweet) => tweet.category === category)
      setTweets(filteredTweets.slice(0, maxResults))
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
      setHasInitialLoad(true)
    }
  }, [category, maxResults, isLiveMode])

  const refreshTweets = useCallback(async () => {
    // Only allow manual refresh if enough time has passed
    const lastRefresh = localStorage.getItem("last_manual_refresh")
    if (lastRefresh) {
      const timeSince = Date.now() - Number.parseInt(lastRefresh)
      const minInterval = 5 * 60 * 1000 // 5 minutes minimum between manual refreshes

      if (timeSince < minInterval) {
        setError(`Please wait ${Math.ceil((minInterval - timeSince) / 60000)} more minutes before refreshing`)
        return
      }
    }

    localStorage.setItem("last_manual_refresh", Date.now().toString())
    await fetchTweets()
  }, [fetchTweets])

  // Initial fetch - only once
  useEffect(() => {
    if (!hasInitialLoad) {
      fetchTweets()
    }
  }, [fetchTweets, hasInitialLoad])

  // Much longer refresh interval and only if live mode
  useEffect(() => {
    if (refreshInterval > 0 && isLiveMode && hasInitialLoad) {
      console.log(`Setting up conservative auto-refresh every ${refreshInterval / 60000} minutes`)
      const interval = setInterval(() => {
        // Only auto-refresh if we haven't hit rate limits recently
        const rateLimitTime = localStorage.getItem("twitter_rate_limit_hit")
        if (!rateLimitTime || Date.now() - Number.parseInt(rateLimitTime) > 15 * 60 * 1000) {
          fetchTweets()
        }
      }, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchTweets, refreshInterval, isLiveMode, hasInitialLoad])

  return {
    tweets,
    loading,
    error,
    refreshTweets,
    lastUpdated,
    isLiveMode,
  }
}

// Mock data for development/fallback
function getMockTweets(): ProcessedTweet[] {
  return [
    {
      id: "1",
      handle: "@JackPosobiec",
      name: "Jack Posobiec 🇺🇸",
      content:
        "BREAKING: New documents reveal the extent of government censorship operations targeting American citizens. This is the biggest story of the year and mainstream media is silent.",
      timestamp: "2h",
      likes: "12.3K",
      retweets: "4.2K",
      verified: true,
      category: "politics",
      featured: true,
      timeAgo: "2 hours ago",
      profileImage: "",
      author_id: "123456789",
    },
    {
      id: "2",
      handle: "@charliekirk11",
      name: "Charlie Kirk",
      content:
        "The mainstream media won't report this, but small businesses are thriving in red states while blue states continue to hemorrhage jobs and residents. The data doesn't lie.",
      timestamp: "4h",
      likes: "8.7K",
      retweets: "2.1K",
      verified: true,
      category: "economy",
      featured: true,
      timeAgo: "4 hours ago",
      profileImage: "",
      author_id: "987654321",
    },
    {
      id: "3",
      handle: "@EndWokeness",
      name: "End Wokeness",
      content:
        "Universities are now requiring 'diversity statements' for faculty positions. This is ideological discrimination disguised as inclusion. Academic freedom is dead.",
      timestamp: "1h",
      likes: "15.2K",
      retweets: "5.8K",
      verified: true,
      category: "culture",
      featured: false,
      timeAgo: "1 hour ago",
      profileImage: "",
      author_id: "456789123",
    },
    {
      id: "4",
      handle: "@VivekGRamaswamy",
      name: "Vivek Ramaswamy",
      content:
        "America First means putting American workers, American families, and American values first. It's not complicated. It's common sense that Washington has forgotten.",
      timestamp: "3h",
      likes: "9.4K",
      retweets: "3.1K",
      verified: true,
      category: "politics",
      featured: false,
      timeAgo: "3 hours ago",
      profileImage: "",
      author_id: "789123456",
    },
    {
      id: "5",
      handle: "@DC_Draino",
      name: "DC_Draino",
      content:
        "Border Patrol agents report record-breaking encounters at the southern border. This crisis demands immediate action from Congress, but they're too busy with political theater.",
      timestamp: "5h",
      likes: "6.8K",
      retweets: "1.9K",
      verified: true,
      category: "border",
      featured: false,
      timeAgo: "5 hours ago",
      profileImage: "",
      author_id: "321654987",
    },
    {
      id: "6",
      handle: "@libsoftiktok",
      name: "Libs of TikTok",
      content:
        "Another day, another example of radical ideology being pushed in our schools. Parents are waking up across America and demanding accountability from school boards.",
      timestamp: "2h",
      likes: "11.5K",
      retweets: "4.7K",
      verified: true,
      category: "culture",
      featured: false,
      timeAgo: "2 hours ago",
      profileImage: "",
      author_id: "654987321",
    },
  ]
}
