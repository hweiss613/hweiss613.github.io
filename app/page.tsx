"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTwitterData } from "@/hooks/use-twitter-data"
import { BriefingCard } from "@/components/briefing-card"
import { EmailCapture } from "@/components/email-capture"
import type { Storyline } from "@/lib/types"

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

  const allStorylines: Storyline[] = useMemo(() => {
    return storylinesData.storylines.sort((a, b) => a.importanceLevel - b.importanceLevel)
  }, [])

  const menuItems = [
    { id: "all", label: "All Storylines", category: "all" },
    { id: "politics", label: "Politics", category: "Politics" },
    { id: "economy", label: "Economy", category: "Economy" },
    { id: "culture", label: "Culture", category: "Culture" },
    { id: "border", label: "Border", category: "Border" },
  ]

  const filteredStorylines = useMemo(() => {
    let results = allStorylines

    if (activeFilter !== "all") {
      results = results.filter((storyline) => storyline.category === activeFilter)
    }

    if (searchQuery) {
      results = results.filter(
        (storyline) =>
          storyline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          storyline.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return results
  }, [activeFilter, searchQuery])

  const leadStory = filteredStorylines.length > 0 ? filteredStorylines[0] : null
  const secondaryStories = filteredStorylines.slice(1, 3)
  const additionalStories = filteredStorylines.slice(3)

  // Toggle bookmark
  const toggleBookmark = (tweetId: string) => {
    const newBookmarks = bookmarkedTweets.includes(tweetId)
      ? bookmarkedTweets.filter((id) => id !== tweetId)
      : [...bookmarkedTweets, tweetId]

    setBookmarkedTweets(newBookmarks)
    localStorage.setItem("bookmarkedTweets", JSON.stringify(newBookmarks))
  }

  // Share functions
  const handleShare = (tweet: any, platform: "x" | "telegram" | "copy") => {
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-56">
                <Image src="/logo.png" alt="National Storyline Logo" fill style={{ objectFit: "contain" }} priority />
              </div>
            </Link>

            {/* Tagline */}
            <div className="hidden lg:block text-right">
              <p className="text-sm text-muted-foreground font-medium tracking-wide">
                Daily briefings curated from independent journalists
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-border py-3 flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.category)}
                className={`px-4 py-2 text-sm font-semibold tracking-wide transition-colors ${
                  activeFilter === item.category
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="py-4 border-t border-border">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search storylines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4">Today's Briefing</h1>
            <p className="text-lg leading-relaxed text-primary-foreground/90">
              The day's most consequential stories, assembled with clarity and rigor from America's independent
              journalists and voices.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {filteredStorylines.length > 0 ? (
          <>
            {/* Lead story - full width */}
            {leadStory && (
              <div className="mb-12 md:mb-16">
                <BriefingCard storyline={leadStory} variant="lead" />
              </div>
            )}

            {/* Secondary stories - 2-3 cards */}
            {secondaryStories.length > 0 && (
              <div className="mb-12 md:mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {secondaryStories.map((storyline) => (
                    <BriefingCard key={storyline.id} storyline={storyline} variant="secondary" />
                  ))}
                </div>
              </div>
            )}

            {/* Additional stories section */}
            {additionalStories.length > 0 && (
              <div className="mb-12 md:mb-16">
                <div className="mb-6 md:mb-8">
                  <h3 className="font-serif text-lg md:text-xl text-muted-foreground">More Developing Stories ↓</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {additionalStories.map((storyline) => (
                    <BriefingCard key={storyline.id} storyline={storyline} variant="additional" />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6 text-lg">No storylines match your search.</p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveFilter("all")
                setSearchQuery("")
              }}
              className="border-border text-foreground hover:bg-secondary"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Email capture */}
        <section className="bg-secondary/30 border border-border rounded-sm p-8 md:p-12 max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">Stay Informed</h2>
          <p className="text-muted-foreground mb-6">
            Daily briefings delivered to your inbox. Curated independent journalism without the noise.
          </p>
          <EmailCapture />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground border-t border-border mt-16">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-3xl">
            <h3 className="font-serif text-xl md:text-2xl mb-4">About National Storyline</h3>
            <p className="leading-relaxed text-primary-foreground/90 mb-6">
              We restore clarity to the national conversation by assembling rigorous independent journalism into
              coherent storylines. Rather than competing for attention with sensationalism, we prioritize coherence,
              depth, and truth.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-12 pt-8">
            <p className="text-sm text-primary-foreground/80">
              &copy; {new Date().getFullYear()} National Storyline. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
