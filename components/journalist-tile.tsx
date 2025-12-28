import type { Contributor } from "@/lib/types"

interface JournalistTileProps {
  contributor: Contributor
}

export function JournalistTile({ contributor }: JournalistTileProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded border border-gray-200 hover:shadow-md transition-shadow">
      <div className="w-14 h-14 bg-[#1a365d] text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
        {contributor.avatar}
      </div>
      <h3 className="font-bold text-sm text-[#1a365d]">{contributor.name}</h3>
      <p className="text-xs text-gray-600 mb-3">{contributor.handle}</p>
      <a
        href={`https://twitter.com/${contributor.handle.replace("@", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-bold text-[#dc2626] hover:underline"
      >
        View on X
      </a>
    </div>
  )
}
