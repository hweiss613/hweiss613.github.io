import type { KeyPost, Contributor } from "@/lib/types"

interface TimelineItemProps {
  post: KeyPost
  contributor: Contributor | undefined
}

export function TimelineItem({ post, contributor }: TimelineItemProps) {
  return (
    <div className="flex gap-4 mb-6">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 bg-[#dc2626] rounded-full mb-2"></div>
        <div className="w-0.5 h-16 bg-gray-200"></div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="bg-white border border-gray-200 rounded p-4">
          <p className="font-bold text-sm text-[#1a365d] mb-1">{contributor?.name}</p>
          <p className="text-xs text-gray-500 mb-2">{contributor?.handle}</p>
          <p className="text-sm text-gray-700 mb-3">{post.text}</p>
          <p className="text-xs text-gray-500">{post.timestamp}</p>
        </div>
      </div>
    </div>
  )
}
