import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Storyline } from "@/lib/types"

interface BriefingCardProps {
  storyline: Storyline
}

export function BriefingCard({ storyline }: BriefingCardProps) {
  return (
    <Link href={`/storyline/${storyline.id}`}>
      <article className="group border border-border bg-card hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col p-8 md:p-10">
        {/* Header with category and status */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
              {storyline.category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl leading-tight text-foreground max-w-lg">
              {storyline.title}
            </h2>
          </div>
          <div className="flex-shrink-0">
            {storyline.status === "Trending" && (
              <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-sm">
                <TrendingUp className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-bold text-accent">TRENDING</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-base leading-relaxed text-muted-foreground mb-8 flex-grow">{storyline.summary}</p>

        {/* Journalists */}
        <div className="mb-8 pt-6 border-t border-border">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">
            Featured Contributors
          </p>
          <div className="flex flex-wrap gap-2">
            {storyline.contributors.map((contributor) => (
              <div
                key={contributor.id}
                className="flex items-center gap-2 bg-secondary/40 px-3 py-2 rounded-sm hover:bg-secondary transition-colors"
              >
                <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">{contributor.avatar}</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-semibold">{contributor.name}</p>
                  <p className="text-xs text-muted-foreground">{contributor.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with updated time and link */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <span className="text-xs text-muted-foreground">Updated {storyline.updatedAgo}</span>
          <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
        </div>
      </article>
    </Link>
  )
}
