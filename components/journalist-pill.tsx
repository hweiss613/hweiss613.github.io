import type { Contributor } from "@/lib/types"

interface JournalistPillProps {
  contributor: Contributor
}

export function JournalistPill({ contributor }: JournalistPillProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-[#1a365d] text-white rounded-full flex items-center justify-center font-bold text-sm">
        {contributor.avatar}
      </div>
      <div>
        <p className="font-bold text-sm text-[#1a365d]">{contributor.name}</p>
        <p className="text-xs text-gray-500">{contributor.handle}</p>
      </div>
    </div>
  )
}
