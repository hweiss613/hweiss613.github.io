interface CacheEntry<T> {
  data: T
  timestamp: Date
  ttl: number // Time to live in milliseconds
}

class CacheManager {
  private static instance: CacheManager
  private cache: Map<string, CacheEntry<any>> = new Map()

  private constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  set<T>(key: string, data: T, ttlMinutes = 5): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: new Date(),
      ttl: ttlMinutes * 60 * 1000,
    }

    this.cache.set(key, entry)
    console.log(`Cached data for key: ${key} (TTL: ${ttlMinutes}m)`)
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    const age = now - entry.timestamp.getTime()

    if (age > entry.ttl) {
      this.cache.delete(key)
      console.log(`Cache expired for key: ${key}`)
      return null
    }

    console.log(`Cache hit for key: ${key} (age: ${Math.round(age / 1000)}s)`)
    return entry.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
    console.log("Cache cleared")
  }

  private cleanup(): void {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp.getTime()
      if (age > entry.ttl) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired cache entries`)
    }
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

export { CacheManager, type CacheEntry }
