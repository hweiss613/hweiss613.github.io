import type { TwitterTweet, TwitterUser } from "./twitter-api"

export interface ProcessedTweet {
  id: string
  handle: string
  name: string
  content: string
  timestamp: string
  likes: string
  retweets: string
  verified: boolean
  category: string
  featured: boolean
  timeAgo: string
  profileImage: string
  author_id: string
}

export class TweetProcessor {
  static processTweets(tweets: TwitterTweet[], users: TwitterUser[]): ProcessedTweet[] {
    const userMap = new Map(users.map((user) => [user.id, user]))

    return tweets
      .map((tweet, index) => {
        const author = userMap.get(tweet.author_id)
        if (!author) return null

        return {
          id: tweet.id,
          handle: `@${author.username}`,
          name: author.name,
          content: tweet.text,
          timestamp: this.formatTimestamp(tweet.created_at),
          likes: this.formatNumber(tweet.public_metrics.like_count),
          retweets: this.formatNumber(tweet.public_metrics.retweet_count),
          verified: author.verified,
          category: this.categorizeContent(tweet),
          featured: index < 2, // First 2 tweets are featured
          timeAgo: this.getTimeAgo(tweet.created_at),
          profileImage: author.profile_image_url,
          author_id: author.id,
        }
      })
      .filter(Boolean) as ProcessedTweet[]
  }

  private static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  private static formatTimestamp(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m`
    }
    if (diffInHours < 24) {
      return `${diffInHours}h`
    }
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d`
  }

  private static getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    }
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
    }
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
  }

  private static categorizeContent(tweet: TwitterTweet): string {
    const content = tweet.text.toLowerCase()

    // Use context annotations if available
    if (tweet.context_annotations) {
      for (const annotation of tweet.context_annotations) {
        const domain = annotation.domain.name.toLowerCase()
        if (domain.includes("politic")) return "politics"
        if (domain.includes("business") || domain.includes("financ")) return "economy"
        if (domain.includes("entertainment") || domain.includes("sport")) return "culture"
      }
    }

    // Keyword-based categorization
    const politicsKeywords = ["politics", "election", "congress", "biden", "trump", "government", "policy", "vote"]
    const economyKeywords = ["economy", "market", "stock", "inflation", "fed", "jobs", "business", "trade"]
    const cultureKeywords = ["woke", "culture", "education", "school", "university", "media", "hollywood"]
    const borderKeywords = ["border", "immigration", "migrant", "asylum", "ice", "mexico"]
    const worldKeywords = ["china", "russia", "ukraine", "nato", "international", "global", "foreign"]

    if (politicsKeywords.some((keyword) => content.includes(keyword))) return "politics"
    if (economyKeywords.some((keyword) => content.includes(keyword))) return "economy"
    if (cultureKeywords.some((keyword) => content.includes(keyword))) return "culture"
    if (borderKeywords.some((keyword) => content.includes(keyword))) return "border"
    if (worldKeywords.some((keyword) => content.includes(keyword))) return "world"

    return "politics" // Default category
  }
}
