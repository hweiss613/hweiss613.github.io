// Twitter API types - keeping these for the processor
export interface TwitterUser {
  id: string
  name: string
  username: string
  verified: boolean
  profile_image_url: string
  public_metrics: {
    followers_count: number
    following_count: number
    tweet_count: number
  }
}

export interface TwitterTweet {
  id: string
  text: string
  created_at: string
  author_id: string
  public_metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
    quote_count: number
  }
  context_annotations?: Array<{
    domain: {
      id: string
      name: string
      description: string
    }
    entity: {
      id: string
      name: string
      description: string
    }
  }>
}

export interface TwitterApiResponse {
  data: TwitterTweet[]
  includes?: {
    users: TwitterUser[]
  }
  meta: {
    result_count: number
    next_token?: string
  }
}
