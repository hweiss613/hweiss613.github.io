import Image from "next/image"
import Link from "next/link"
import { Twitter, Linkedin, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  // Sample data for headlines
  const headlines = [
    {
      id: 1,
      title: "Fed Signals Rate Cut Timeline as Inflation Cools",
      summary:
        "Federal Reserve officials indicated a potential rate cut in September as inflation data shows consistent cooling. Markets responded positively with major indices climbing on the news.",
      sources: [
        { name: "WSJ", url: "#" },
        { name: "Bloomberg", url: "#" },
        { name: "CNBC", url: "#" },
      ],
      bias: "center",
      timestamp: new Date(2023, 6, 15, 9, 30),
      category: "economy",
    },
    {
      id: 2,
      title: "Supreme Court Rules on Presidential Immunity Case",
      summary:
        "In a landmark 6-3 decision, the Supreme Court established new guidelines on presidential immunity, ruling that presidents have broad immunity for official acts but can face prosecution for personal conduct.",
      sources: [
        { name: "Fox News", url: "#" },
        { name: "CNN", url: "#" },
        { name: "NPR", url: "#" },
      ],
      bias: "right",
      timestamp: new Date(2023, 6, 15, 10, 15),
      category: "politics",
    },
    {
      id: 3,
      title: "Tech Earnings Beat Expectations as AI Investments Pay Off",
      summary:
        "Major tech companies reported stronger than anticipated Q2 earnings, with AI investments driving significant growth. Several firms raised guidance for the remainder of the fiscal year.",
      sources: [
        { name: "Axios", url: "#" },
        { name: "Reuters", url: "#" },
        { name: "TechCrunch", url: "#" },
      ],
      bias: "center",
      timestamp: new Date(2023, 6, 15, 8, 45),
      category: "business",
    },
    {
      id: 4,
      title: "Infrastructure Bill Advances with Bipartisan Support",
      summary:
        "A $1.2 trillion infrastructure package moved forward with support from both parties. The bill includes significant funding for transportation, broadband, and clean energy initiatives.",
      sources: [
        { name: "Washington Post", url: "#" },
        { name: "Politico", url: "#" },
        { name: "The Hill", url: "#" },
      ],
      bias: "left",
      timestamp: new Date(2023, 6, 15, 11, 20),
      category: "politics",
    },
    {
      id: 5,
      title: "Global Trade Tensions Ease as New Agreements Reached",
      summary:
        "New trade agreements between major economies have reduced tariff concerns. Supply chain improvements are expected in coming quarters as international commerce restrictions are lifted.",
      sources: [
        { name: "Financial Times", url: "#" },
        { name: "WSJ", url: "#" },
        { name: "Bloomberg", url: "#" },
      ],
      bias: "center",
      timestamp: new Date(2023, 6, 15, 7, 50),
      category: "economy",
    },
    {
      id: 6,
      title: "Healthcare Innovation Summit Highlights Digital Transformation",
      summary:
        "Industry leaders gathered to discuss post-pandemic healthcare solutions. Digital health investments reached record levels this quarter as telehealth adoption continues to grow.",
      sources: [
        { name: "STAT News", url: "#" },
        { name: "Healthcare IT News", url: "#" },
        { name: "Modern Healthcare", url: "#" },
      ],
      bias: "left",
      timestamp: new Date(2023, 6, 15, 12, 10),
      category: "business",
    },
  ]

  // Group headlines by category
  const groupedHeadlines = headlines.reduce((acc, headline) => {
    if (!acc[headline.category]) {
      acc[headline.category] = []
    }
    acc[headline.category].push(headline)
    return acc
  }, {})

  // Trending topics
  const trendingTopics = [
    "Trump DOJ Memo",
    "Fed Rate Pause",
    "TikTok Ban",
    "Ukraine Aid Package",
    "AI Regulation",
    "Climate Summit",
  ]

  // Format bias tag
  const getBiasTag = (bias) => {
    switch (bias) {
      case "left":
        return "🟦 Leans Left"
      case "right":
        return "🟥 Leans Right"
      default:
        return "⬜ Center"
    }
  }

  // Format timestamp
  const formatTimestamp = (date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "pm" : "am"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `Posted ${formattedHours}:${formattedMinutes}${ampm} ET`
  }

  // Category icons
  const categoryIcons = {
    politics: "🇺🇸",
    business: "💼",
    economy: "📉",
  }

  // Category names
  const categoryNames = {
    politics: "Politics",
    business: "Business",
    economy: "Economy",
  }

  return (
    <div className="min-h-screen bg-[#f9f9f7] dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-0">
            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-60">
                <Image
                  src="/logo.png"
                  alt="National Storyline Logo"
                  fill
                  style={{ objectFit: "contain", objectPosition: "left" }}
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:px-6 md:py-8">
        {/* Site Header Box */}
        <div className="mb-6 border border-gray-200 dark:border-gray-700 p-4 rounded-md bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-serif text-xl font-bold text-[#0a2342] dark:text-gray-100">National Storyline</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
                What the Nation's Talking About — Without the Spin
              </p>
            </div>
            <div className="mt-2 md:mt-0 text-xs text-gray-500 dark:text-gray-400">
              Last updated:{" "}
              {new Date().toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </div>

        {/* Trending Ticker */}
        <div className="mb-6 border-y border-gray-200 dark:border-gray-700 py-2 bg-gray-50 dark:bg-gray-800 overflow-hidden">
          <div className="flex items-center">
            <span className="font-medium text-xs text-gray-700 dark:text-gray-300 mr-3">TRENDING:</span>
            <div className="flex space-x-4 animate-marquee whitespace-nowrap">
              {trendingTopics.map((topic, index) => (
                <span key={index} className="text-sm">
                  {topic} {index < trendingTopics.length - 1 ? "•" : ""}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Headlines by Category */}
        <div className="space-y-8">
          {Object.keys(groupedHeadlines).map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="font-serif text-lg font-bold border-b pb-1 text-[#0a2342] dark:text-gray-100">
                {categoryIcons[category]} {categoryNames[category]}
              </h2>
              <div className="space-y-6">
                {groupedHeadlines[category].map((headline) => (
                  <div key={headline.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="font-serif text-lg font-bold mb-2 text-[#0a2342] dark:text-gray-100">
                      <Link href="#" className="hover:text-[#b22234] dark:hover:text-[#ff6b6b]">
                        {headline.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{headline.summary}</p>
                    <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 mt-2 gap-x-4 gap-y-1">
                      <div>
                        Sources:{" "}
                        {headline.sources.map((source, index) => (
                          <span key={index}>
                            <Link href={source.url} className="text-[#0a2342] dark:text-blue-400 hover:underline">
                              {source.name}
                            </Link>
                            {index < headline.sources.length - 1 ? " " : ""}
                          </span>
                        ))}
                      </div>
                      <div>{getBiasTag(headline.bias)}</div>
                      <div>{formatTimestamp(headline.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Email Signup */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-serif text-base font-medium text-[#0a2342] dark:text-gray-100">
                Get the Daily Digest in Your Inbox
              </h3>
            </div>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email address" className="max-w-xs" />
              <Button className="bg-[#b22234] hover:bg-[#8b1a28] text-white">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="container px-4 py-6 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} National Storyline. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0a2342] dark:hover:text-white">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0a2342] dark:hover:text-white">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0a2342] dark:hover:text-white">
                <Send className="h-4 w-4" />
                <span className="sr-only">Telegram</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
