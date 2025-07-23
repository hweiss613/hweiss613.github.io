import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Share2, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  // Sample embedded tweet data (placeholder for actual X API integration)
  const tweetPosts = [
    {
      id: 1,
      handle: "@JackPosobiec",
      name: "Jack Posobiec 🇺🇸",
      content:
        "BREAKING: New documents reveal the extent of government censorship operations targeting American citizens. This is bigger than we thought.",
      timestamp: "2h",
      likes: "12.3K",
      retweets: "4.2K",
      verified: true,
    },
    {
      id: 2,
      handle: "@charliekirk11",
      name: "Charlie Kirk",
      content:
        "The mainstream media won't report this, but small businesses are thriving in red states while blue states continue to hemorrhage jobs and residents.",
      timestamp: "4h",
      likes: "8.7K",
      retweets: "2.1K",
      verified: true,
    },
    {
      id: 3,
      handle: "@EndWokeness",
      name: "End Wokeness",
      content:
        "Universities are now requiring 'diversity statements' for faculty positions. This is ideological discrimination disguised as inclusion.",
      timestamp: "1h",
      likes: "15.2K",
      retweets: "5.8K",
      verified: true,
    },
    {
      id: 4,
      handle: "@VivekGRamaswamy",
      name: "Vivek Ramaswamy",
      content:
        "America First means putting American workers, American families, and American values first. It's not complicated.",
      timestamp: "3h",
      likes: "9.4K",
      retweets: "3.1K",
      verified: true,
    },
    {
      id: 5,
      handle: "@DC_Draino",
      name: "DC_Draino",
      content:
        "While Democrats focus on pronouns, Republicans are focused on prosperity. The choice couldn't be clearer.",
      timestamp: "5h",
      likes: "6.8K",
      retweets: "1.9K",
      verified: true,
    },
    {
      id: 6,
      handle: "@libsoftiktok",
      name: "Libs of TikTok",
      content: "Another day, another example of radical ideology being pushed in our schools. Parents are waking up.",
      timestamp: "2h",
      likes: "11.5K",
      retweets: "4.7K",
      verified: true,
    },
  ]

  const topSharedHeadlines = [
    "Border Crisis Reaches Breaking Point as Migrant Encounters Surge",
    "Federal Reserve's Rate Decision Sparks Market Volatility",
    "Supreme Court to Hear Major Second Amendment Case",
    "Energy Independence: America's Oil Production Hits Record High",
    "Big Tech Censorship Exposed in Congressional Hearing",
  ]

  const editorsPicks = [
    "The Real Cost of Green Energy Mandates",
    "How Woke Policies Are Destroying American Cities",
    "China's Economic Warfare Against America",
    "The Truth About Crime Statistics Media Won't Report",
    "Why School Choice Is Winning Across America",
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-gray-200">
        <div className="container mx-auto px-4 py-4">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative h-16 w-80 mb-2">
              <Image src="/logo.png" alt="National Storyline Logo" fill style={{ objectFit: "contain" }} priority />
            </div>
            <p className="text-gray-700 font-medium text-sm tracking-wide">Real news. Verified voices. No spin.</p>
          </div>

          {/* Navigation */}
          <nav className="border-t border-b border-gray-300 py-3">
            <div className="flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-wider">
              <Link href="/politics" className="text-[#1a365d] hover:text-[#dc2626] transition-colors">
                Politics
              </Link>
              <Link href="/economy" className="text-[#1a365d] hover:text-[#dc2626] transition-colors">
                Economy
              </Link>
              <Link href="/culture" className="text-[#1a365d] hover:text-[#dc2626] transition-colors">
                Culture
              </Link>
              <Link href="/border" className="text-[#1a365d] hover:text-[#dc2626] transition-colors">
                Border
              </Link>
              <Link href="/woke-watch" className="text-[#1a365d] hover:text-[#dc2626] transition-colors">
                Woke Watch
              </Link>
              <Link href="/world" className="text-[#1a365d] hover:text-[#dc2626] transition-colors">
                World
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed - 3 columns on desktop */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tweetPosts.map((post) => (
                <Card key={post.id} className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4">
                    {/* Tweet Header */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-bold text-sm text-black">{post.name}</h3>
                          {post.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full ml-1 flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">{post.handle}</p>
                      </div>
                      <span className="text-gray-400 text-xs">{post.timestamp}</span>
                    </div>

                    {/* Tweet Content */}
                    <p className="text-black text-sm mb-4 leading-relaxed">{post.content}</p>

                    {/* Tweet Actions */}
                    <div className="flex items-center justify-between text-gray-500 text-xs">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Share2 className="w-3 h-3 mr-1" />
                          {post.retweets}
                        </span>
                        <span className="flex items-center">
                          <span className="w-3 h-3 mr-1">♥</span>
                          {post.likes}
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Top Shared */}
            <div className="border border-gray-200 p-4">
              <h2 className="font-serif text-lg font-bold text-[#1a365d] mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-[#dc2626]" />
                Top Shared
              </h2>
              <ul className="space-y-3">
                {topSharedHeadlines.map((headline, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="text-sm text-black hover:text-[#dc2626] transition-colors leading-tight block"
                    >
                      {headline}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Editor's Picks */}
            <div className="border border-gray-200 p-4">
              <h2 className="font-serif text-lg font-bold text-[#1a365d] mb-4">Editor's Picks</h2>
              <ul className="space-y-3">
                {editorsPicks.map((pick, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="text-sm text-black hover:text-[#dc2626] transition-colors leading-tight block"
                    >
                      {pick}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4">
          {/* Newsletter Signup */}
          <div className="text-center mb-6">
            <h3 className="font-serif text-lg font-bold text-[#1a365d] mb-3">Stay Informed</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6">Subscribe</Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-xs text-gray-600 max-w-2xl mx-auto">
            <p>
              National Storyline curates news directly from verified sources on X. We aim to restore trust in media
              through transparency.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>&copy; {new Date().getFullYear()} National Storyline. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
