interface ApiHealthCheck {
  status: "healthy" | "degraded" | "down"
  lastCheck: Date
  responseTime: number
  rateLimitRemaining: number
  rateLimitReset: Date | null
  errorCount: number
  successCount: number
}

interface ApiMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  lastError: string | null
  lastErrorTime: Date | null
}

class ApiMonitor {
  private static instance: ApiMonitor
  private health: ApiHealthCheck
  private metrics: ApiMetrics
  private listeners: ((health: ApiHealthCheck) => void)[] = []

  private constructor() {
    this.health = {
      status: "healthy",
      lastCheck: new Date(),
      responseTime: 0,
      rateLimitRemaining: 300,
      rateLimitReset: null,
      errorCount: 0,
      successCount: 0,
    }

    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      lastError: null,
      lastErrorTime: null,
    }
  }

  static getInstance(): ApiMonitor {
    if (!ApiMonitor.instance) {
      ApiMonitor.instance = new ApiMonitor()
    }
    return ApiMonitor.instance
  }

  recordRequest(success: boolean, responseTime: number, error?: string, rateLimitInfo?: any) {
    const now = new Date()

    this.metrics.totalRequests++

    if (success) {
      this.metrics.successfulRequests++
      this.health.successCount++
      this.health.errorCount = Math.max(0, this.health.errorCount - 1) // Decay errors on success
    } else {
      this.metrics.failedRequests++
      this.health.errorCount++
      this.metrics.lastError = error || "Unknown error"
      this.metrics.lastErrorTime = now
    }

    // Update response time (rolling average)
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) / this.metrics.totalRequests

    this.health.responseTime = responseTime
    this.health.lastCheck = now

    // Update rate limit info if provided
    if (rateLimitInfo) {
      this.health.rateLimitRemaining = rateLimitInfo.remaining || 0
      this.health.rateLimitReset = rateLimitInfo.reset ? new Date(rateLimitInfo.reset * 1000) : null
    }

    // Determine health status
    this.updateHealthStatus()

    // Notify listeners
    this.notifyListeners()
  }

  private updateHealthStatus() {
    const errorRate = this.metrics.totalRequests > 0 ? this.metrics.failedRequests / this.metrics.totalRequests : 0
    const recentErrors = this.health.errorCount

    if (recentErrors >= 5 || errorRate > 0.5) {
      this.health.status = "down"
    } else if (recentErrors >= 2 || errorRate > 0.2 || this.health.rateLimitRemaining < 10) {
      this.health.status = "degraded"
    } else {
      this.health.status = "healthy"
    }
  }

  getHealth(): ApiHealthCheck {
    return { ...this.health }
  }

  getMetrics(): ApiMetrics {
    return { ...this.metrics }
  }

  subscribe(callback: (health: ApiHealthCheck) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.getHealth()))
  }

  reset() {
    this.health.errorCount = 0
    this.health.successCount = 0
    this.metrics.failedRequests = 0
    this.metrics.successfulRequests = 0
    this.metrics.totalRequests = 0
    this.metrics.lastError = null
    this.metrics.lastErrorTime = null
    this.updateHealthStatus()
    this.notifyListeners()
  }
}

export { ApiMonitor, type ApiHealthCheck, type ApiMetrics }
