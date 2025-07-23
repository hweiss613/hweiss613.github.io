interface RateLimitInfo {
  remaining: number
  reset: number
  limit: number
  endpoint: string
  lastUpdated: Date
}

class RateLimiter {
  private static instance: RateLimiter
  private limits: Map<string, RateLimitInfo> = new Map()
  private requestQueue: Array<() => Promise<void>> = []
  private processing = false

  private constructor() {}

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  updateLimits(endpoint: string, rateLimitInfo: any) {
    const info: RateLimitInfo = {
      remaining: rateLimitInfo.remaining || 0,
      reset: rateLimitInfo.reset || 0,
      limit: rateLimitInfo.limit || 300,
      endpoint,
      lastUpdated: new Date(),
    }

    this.limits.set(endpoint, info)
    console.log(`Rate limit updated for ${endpoint}:`, info)
  }

  canMakeRequest(endpoint: string): boolean {
    const info = this.limits.get(endpoint)
    if (!info) return true // No info means we haven't hit limits yet

    const now = Date.now() / 1000
    const resetTime = info.reset

    // If reset time has passed, we can make requests
    if (now >= resetTime) {
      return true
    }

    // Check if we have remaining requests
    return info.remaining > 0
  }

  getWaitTime(endpoint: string): number {
    const info = this.limits.get(endpoint)
    if (!info) return 0

    const now = Date.now() / 1000
    const resetTime = info.reset

    if (now >= resetTime) return 0
    if (info.remaining > 0) return 0

    // Return seconds until reset
    return Math.ceil(resetTime - now)
  }

  async waitForRateLimit(endpoint: string): Promise<void> {
    const waitTime = this.getWaitTime(endpoint)
    if (waitTime > 0) {
      console.log(`Rate limit hit for ${endpoint}. Waiting ${waitTime} seconds...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime * 1000))
    }
  }

  // Queue requests to avoid overwhelming the API
  async queueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.requestQueue.length === 0) return

    this.processing = true

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        try {
          await request()
          // Add delay between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          console.error("Queued request failed:", error)
        }
      }
    }

    this.processing = false
  }

  getRateLimitStatus(): Record<string, RateLimitInfo> {
    const status: Record<string, RateLimitInfo> = {}
    this.limits.forEach((info, endpoint) => {
      status[endpoint] = { ...info }
    })
    return status
  }
}

export { RateLimiter, type RateLimitInfo }
