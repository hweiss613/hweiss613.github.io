"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { JournalistTile } from "@/components/journalist-tile"
import { TimelineItem } from "@/components/timeline-item"
import { EmailCapture } from "@/components/email-capture"
import type { Storyline } from "@/lib/types"

import storylinesData from "@/data/storylines.json"

interface StorylineDetailPageProps {
  params: {
    id: string
  }
}

export default function StorylineDetailPage({ params }: StorylineDetailPageProps) {
  const storyline: Storyline | undefined = storylinesData.storylines.find((s) => s.id === params.id)

  if (!storyline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a365d] mb-4">Storyline Not Found</h1>
          <Link href="/">
            <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">Back to Homepage</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusColor =
    storyline.status === "Trending"
      ? "bg-red-100 text-red-700"
      : storyline.status === "Rising"
        ? "bg-amber-100 text-amber-700"
        : "bg-gray-100 text-gray-700"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - PRESERVED */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-48">
                <Image src="/logo.png" alt="National Storyline Logo" fill style={{ objectFit: "contain" }} priority />
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-[#1a365d] hover:text-[#dc2626]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Storyline Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#dc2626]">{storyline.category}</span>
              <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded ${statusColor}`}>
                {storyline.status}
              </span>
            </div>

            <h1 className="font-serif text-4xl font-bold text-[#1a365d] mb-4">{storyline.title}</h1>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{storyline.summary}</p>

            <div className="flex items-center justify-between text-sm text-gray-600 border-t border-b border-gray-200 py-4">
              <span>Updated {storyline.updatedAgo}</span>
              <Button variant="ghost" className="text-[#dc2626] hover:text-[#b91c1c]">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Contributors Section */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-[#1a365d] mb-6">Contributors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storyline.contributors.map((contributor) => (
                <JournalistTile key={contributor.id} contributor={contributor} />
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-[#1a365d] mb-6">Timeline of Updates</h2>
            <div className="bg-white rounded border border-gray-200 p-6">
              {storyline.keyPosts.map((post) => {
                const contributor = storyline.contributors.find((c) => c.id === post.journalistId)
                return <TimelineItem key={post.id} post={post} contributor={contributor} />
              })}
            </div>
          </div>

          {/* Newsletter CTA */}
          <Card className="border border-gray-200 bg-gradient-to-r from-gray-50 to-white mb-12">
            <CardContent className="p-8 text-center">
              <h3 className="font-serif text-2xl font-bold text-[#1a365d] mb-4">Stay Updated on This Storyline</h3>
              <p className="text-gray-700 mb-6 max-w-md mx-auto">
                Get notifications when new developments break on this storyline.
              </p>
              <EmailCapture />
            </CardContent>
          </Card>

          {/* Back to All Storylines */}
          <div className="text-center">
            <Link href="/">
              <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">View All Storylines</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} National Storyline. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
