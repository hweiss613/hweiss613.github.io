"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Storyline } from "@/lib/types"

interface StorylineCardProps {
  storyline: Storyline
}

export function StorylineCard({ storyline }: StorylineCardProps) {
  const statusColor =
    storyline.status === "Trending"
      ? "bg-red-100 text-red-700"
      : storyline.status === "Rising"
        ? "bg-amber-100 text-amber-700"
        : "bg-gray-100 text-gray-700"

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Category and Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#dc2626]">{storyline.category}</span>
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${statusColor}`}>
            {storyline.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-[#1a365d] mb-2 line-clamp-2">{storyline.title}</h3>

        {/* Summary */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{storyline.summary}</p>

        {/* Updated time */}
        <p className="text-xs text-gray-500 mb-4">Updated {storyline.updatedAgo}</p>

        {/* Contributors */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-600 mb-2">Contributors</p>
          <div className="flex items-center gap-2">
            {storyline.contributors.slice(0, 3).map((contributor) => (
              <div key={contributor.id} className="flex items-center gap-1">
                <div className="w-8 h-8 bg-[#1a365d] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {contributor.avatar}
                </div>
              </div>
            ))}
            {storyline.contributors.length > 3 && (
              <div className="text-xs font-bold text-gray-600">+{storyline.contributors.length - 3} more</div>
            )}
          </div>
        </div>

        {/* Key posts preview */}
        <div className="mb-4 flex-1">
          <p className="text-xs font-bold text-gray-600 mb-2">Key Posts</p>
          <div className="space-y-2">
            {storyline.keyPosts.slice(0, 2).map((post) => {
              const contributor = storyline.contributors.find((c) => c.id === post.journalistId)
              return (
                <div key={post.id} className="bg-gray-50 p-2 rounded text-xs">
                  <p className="font-bold text-[#1a365d]">{contributor?.name}</p>
                  <p className="text-gray-700 line-clamp-2">{post.text}</p>
                  <p className="text-gray-500 text-xs mt-1">{post.timestamp}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <Link href={`/storyline/${storyline.id}`}>
          <Button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white">Open Storyline</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
