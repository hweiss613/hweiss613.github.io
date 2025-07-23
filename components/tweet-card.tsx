"use client"

import { useState } from "react"
import Image from "next/image"
import { Bookmark, ExternalLink, Copy, Send, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ProcessedTweet } from "@/lib/tweet-processor"

interface TweetCardProps {
  tweet: ProcessedTweet
  isBookmarked: boolean
  onBookmark: (tweetId: string) => void
  onShare: (tweet: ProcessedTweet, platform: "x" | "telegram" | "copy") => void
}

export function TweetCard({ tweet, isBookmarked, onBookmark, onShare }: TweetCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const getProfileImage = () => {
    if (imageError || !tweet.profileImage) {
      // Generate a colored avatar based on the user's name
      const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500"]
      const colorIndex = tweet.author_id.charCodeAt(0) % colors.length
      return (
        <div
          className={`w-10 h-10 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-sm`}
        >
          {tweet.name.charAt(0)}
        </div>
      )
    }

    return (
      <Image
        src={tweet.profileImage || "/placeholder.svg"}
        alt={`${tweet.name} profile`}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover"
        onError={handleImageError}
      />
    )
  }

  return (
    <Card
      className={`border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
        tweet.featured ? "md:col-span-2 xl:col-span-2 ring-2 ring-blue-100" : ""
      }`}
    >
      <CardContent className="p-4">
        {/* Timestamp */}
        <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
          <span>{tweet.timeAgo}</span>
          {tweet.featured && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Featured</span>
          )}
        </div>

        {/* Tweet Header */}
        <div className="flex items-center mb-3">
          {getProfileImage()}
          <div className="flex-1 ml-3">
            <div className="flex items-center">
              <h3 className="font-bold text-sm text-black">{tweet.name}</h3>
              {tweet.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full ml-1 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-xs">{tweet.handle}</p>
          </div>
        </div>

        {/* Tweet Content */}
        <blockquote className="text-black text-sm mb-4 leading-relaxed border-l-4 border-gray-200 pl-4 italic">
          {tweet.content}
        </blockquote>

        {/* Tweet Metrics */}
        <div className="flex items-center justify-between text-gray-500 text-xs mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <RefreshCw className="w-3 h-3 mr-1" />
              {tweet.retweets}
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 mr-1">♥</span>
              {tweet.likes}
            </span>
          </div>
          <a
            href={`https://twitter.com/${tweet.handle.substring(1)}/status/${tweet.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(tweet.id)}
            className={`flex items-center space-x-1 text-xs transition-colors ${
              isBookmarked ? "text-yellow-600 hover:text-yellow-700" : "text-gray-500 hover:text-yellow-600"
            }`}
          >
            <Bookmark className={`w-3 h-3 ${isBookmarked ? "fill-current" : ""}`} />
            <span>Save</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(tweet, "x")}
              className="text-gray-500 hover:text-black transition-colors p-1"
              title="Share to X"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(tweet, "telegram")}
              className="text-gray-500 hover:text-blue-500 transition-colors p-1"
              title="Share to Telegram"
            >
              <Send className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(tweet, "copy")}
              className="text-gray-500 hover:text-green-500 transition-colors p-1"
              title="Copy Link"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
