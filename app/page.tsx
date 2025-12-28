"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { TweetCard } from "@/components/tweet-card"
import { useTwitterData } from "@/hooks/use-twitter-data"
import { StorylineCard } from "@/components/storyline-card"
import { EmailCapture } from "@/components/email-capture"
import type { ProcessedTweet, Storyline } from "@/lib/types"

import storylinesData from "@/data/storylines.json"

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarkedTweets, setBookmarkedTweets] = useState<string[]>([])

  // Use Twitter API hook
  const { tweets, loading, error, refreshTweets, lastUpdated, isLiveMode } = useTwitterData({
    refreshInterval: 300000, // 5 minutes
    maxResults: 50,
    category: activeFilter,
  })

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedTweets")
    if (saved) {
      setBookmarkedTweets(JSON.parse(saved))
    }
  }, [])

  const allStorylines: Storyline[] = storylinesData.storylines

  const menuItems = [
    { id: "all", label: "All", category: "all" },
    { id: "politics", label: "Politics", category: "Politics" },
    { id: "economy", label: "Economy", category: "Economy" },
    { id: "culture", label: "Culture", category: "Culture" },
    { id: "border", label: "Border", category: "Border" },
    { id: "woke-watch", label: "Woke Watch", category: "Culture" },
    { id: "world", label: "World", category: "World" },
  ]

  // Filter tweets based on search query
  const filteredTweets = useMemo(() => {
    if (!searchQuery) return tweets

    return tweets.filter(
      (tweet) =>
        tweet.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tweet.handle.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [tweets, searchQuery])

  const filteredStorylines = useMemo(() => {
    let results = allStorylines

    // Filter by category
    if (activeFilter !== "all") {
      results = results.filter((storyline) => storyline.category === activeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (storyline) =>
          storyline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          storyline.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return results
  }, [activeFilter, searchQuery])

  // Toggle bookmark
  const toggleBookmark = (tweetId: string) => {
    const newBookmarks = bookmarkedTweets.includes(tweetId)
      ? bookmarkedTweets.filter((id) => id !== tweetId)
      : [...bookmarkedTweets, tweetId]

    setBookmarkedTweets(newBookmarks)
    localStorage.setItem("bookmarkedTweets", JSON.stringify(newBookmarks))
  }

  // Share functions
  const handleShare = (tweet: ProcessedTweet, platform: "x" | "telegram" | "copy") => {
    switch (platform) {
      case "x":
        const tweetText = `Check out this post from ${tweet.name}: "${tweet.content.substring(0, 100)}..."`
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
        window.open(tweetUrl, "_blank")
        break

      case "telegram":
        const telegramText = `${tweet.name}: ${tweet.content}`
        const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(telegramText)}`
        window.open(telegramUrl, "_blank")
        break

      case "copy":
        const copyText = `${tweet.name} (${tweet.handle}): ${tweet.content}`
        navigator.clipboard.writeText(copyText).then(() => {
          console.log("Tweet copied to clipboard")
        })
        break
    }
  }

  const topSharedHeadlines = allStorylines.slice(0, 7).map((s) => s.title)

  const editorsPicks = allStorylines.flatMap((s) => s.keyPosts.map((p) => p.text)).slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-48">
                <Image src="/logo.png" alt="National Storyline Logo" fill style={{ objectFit: "contain" }} priority />
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search tweets and headlines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Tagline and Refresh */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">Real news. Verified voices. No spin.</p>
                <div className="flex items-center justify-end space-x-2">
                  {lastUpdated && <p className="text-xs text-gray-400">Updated: {lastUpdated.toLocaleTimeString()}</p>}
                  {isLiveMode && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates enabled"></div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshTweets}
                disabled={loading}
                className="text-gray-500 hover:text-[#dc2626]"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 23h6v-6"></path>
                  <path d="M17 1v6h6"></path>
                  <path d="M23 17H17V1"></path>
                </svg>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-gray-200 py-2">
            <div className="flex flex-wrap justify-center gap-1 md:gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveFilter(item.category)}
                  className={`px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                    activeFilter === item.category
                      ? "text-[#dc2626] border-b-2 border-[#dc2626]"
                      : "text-[#1a365d] hover:text-[#dc2626]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile Search */}
          <div className="md:hidden py-3 border-t border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Today's Storyline */}
      <div className="bg-gradient-to-r from-[#1a365d] to-[#2d3748] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-serif text-lg font-bold mb-2">Today's Storyline</h2>
            <blockquote className="text-sm italic max-w-4xl mx-auto">
              {isLiveMode
                ? "Live updates from verified voices shape the national conversation as Americans seek truth beyond traditional media."
                : "Censorship hearings and rising border chaos dominate the national narrative as Americans demand transparency from their institutions."}
            </blockquote>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border border-gray-200 animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTweets.map((tweet) => (
                  <TweetCard
                    key={tweet.id}
                    tweet={tweet}
                    isBookmarked={bookmarkedTweets.includes(tweet.id)}
                    onBookmark={toggleBookmark}
                    onShare={handleShare}
                  />
                ))}
              </div>
            )}

            {filteredStorylines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStorylines.map((storyline) => (
                  <StorylineCard key={storyline.id} storyline={storyline} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No storylines found matching your search.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveFilter("all")
                    setSearchQuery("")
                  }}
                  className="bg-transparent"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Top Shared */}
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h2 className="font-serif text-lg font-bold text-[#1a365d] mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-[#dc2626]" />
                  Top Storylines
                </h2>
                <ul className="space-y-3">
                  {topSharedHeadlines.map((headline, index) => (
                    <li key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                      <Link
                        href="#"
                        className="text-sm text-black hover:text-[#dc2626] transition-colors leading-tight block"
                      >
                        {headline}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Editor's Picks */}
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h2 className="font-serif text-lg font-bold text-[#1a365d] mb-4">Editor's Picks</h2>
                <ul className="space-y-3">
                  {editorsPicks.map((pick, index) => (
                    <li key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                      <p className="text-sm text-black leading-tight line-clamp-2">{pick}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Follow Us */}
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h2 className="font-serif text-lg font-bold text-[#1a365d] mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#dc2626]" />
                  Follow Us
                </h2>
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-black rounded-full mr-2 flex items-center justify-center text-white font-bold text-xs">
                      NS
                    </div>
                    <div>
                      <p className="font-bold text-sm">@NationalStoryline</p>
                      <p className="text-xs text-gray-500">Official Account</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 italic">
                    "Curated storylines from verified independent journalists. Truth over narrative."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4">
          {/* Newsletter Signup */}
          <div className="text-center mb-6">
            <h3 className="font-serif text-xl font-bold text-[#1a365d] mb-4">Stay Informed</h3>
            <EmailCapture />
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm text-gray-600 max-w-3xl mx-auto mb-6">
            <p>
              National Storyline curates independent journalism into coherent storylines. We aggregate coverage from
              verified journalists to restore trust in media through transparency.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
            <p>&copy; {new Date().getFullYear()} National Storyline. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
