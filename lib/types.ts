export interface Contributor {
  id: string
  name: string
  handle: string
  avatar: string
}

export interface KeyPost {
  id: string
  journalistId: string
  text: string
  timestamp: string
}

export interface Storyline {
  id: string
  title: string
  summary: string
  category: string
  status: "Trending" | "Rising" | "Stable"
  updatedAgo: string
  contributors: Contributor[]
  keyPosts: KeyPost[]
}
