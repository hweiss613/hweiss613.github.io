import { ArrowRight, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import type { Storyline } from "@/lib/types"

interface BriefingCardProps {
  storyline: Storyline
  variant?: "lead" | "secondary" | "additional"
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Developing":
      return <AlertCircle className="w-4 h-4" />
    case "Gaining Attention":
      return <TrendingUp className="w-4 h-4" />
    case "Stabilizing":
      return <CheckCircle2 className="w-4 h-4" />
    default:
      return null
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Developing":
      return "text-accent"
    case "Gaining Attention":
      return "text-amber-600"
    case "Stabilizing":
      return "text-green-600"
    default:
      return "text-muted-foreground"
  }
}

export function BriefingCard({ storyline, variant = "secondary" }: BriefingCardProps) {
  const isLead = variant === "lead"
  const isAdditional = variant === "additional"

  // Display max 3 contributors in lead/secondary, max 2 in additional
  const visibleCount = isAdditional ? 2 : 3
  const visibleContributors = storyline.contributors.slice(0, visibleCount)
  const moreCount = storyline.contributors.length - visibleCount

  return (
    <Link href={`/storyline/${storyline.id}`}>
      <article
        className={`group border border-border bg-card hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col ${
          isLead ? "p-10 md:p-12 lg:col-span-2" : isAdditional ? "p-6 md:p-8" : "p-8 md:p-10"
        }`}
      >
        {/* Header section */}
        <div className="mb-4 md:mb-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-block text-xs font-bold tracking-widest uppercase ${isLead ? "text-sm" : ""}`}>
                {storyline.category}
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                {storyline.region}
              </span>
            </div>
            <h2
              className={`font-serif leading-tight text-foreground ${
                isLead
                  ? "text-4xl md:text-5xl mb-4"
                  : isAdditional
                    ? "text-lg md:text-xl mb-2"
                    : "text-2xl md:text-3xl mb-3"
              }`}
            >
              {storyline.title}
            </h2>
          </div>

          {/* Status badge */}
          <div className="flex-shrink-0">
            <div
              className={`flex items-center gap-1.5 px-3 py-2 rounded-sm ${getStatusColor(storyline.status)} bg-opacity-10`}
            >
              {getStatusIcon(storyline.status)}
              <span
                className={`font-bold uppercase tracking-widest ${getStatusColor(storyline.status)} ${isAdditional ? "text-xs" : "text-xs md:text-sm"}`}
              >
                {storyline.status}
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p
          className={`leading-relaxed text-muted-foreground mb-6 ${
            isLead ? "text-lg" : isAdditional ? "text-sm" : "text-base"
          } flex-grow`}
        >
          {storyline.summary}
        </p>

        {/* Why it matters - only in lead and secondary */}
        {!isAdditional && (
          <div className="mb-6 p-4 bg-secondary/20 border-l-2 border-accent rounded-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Why this matters
            </p>
            <p className={`leading-relaxed text-foreground ${isLead ? "text-base" : "text-sm"}`}>
              {storyline.whyItMatters}
            </p>
          </div>
        )}

        {/* Contributors */}
        {!isAdditional && (
          <div className="mb-6 pt-6 border-t border-border">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Featured Contributors {moreCount > 0 ? `(+${moreCount} more)` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {visibleContributors.map((contributor) => (
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
        )}

        {/* Footer */}
        <div className={`flex items-center justify-between pt-6 border-t border-border ${isAdditional ? "" : ""}`}>
          <span className="text-xs text-muted-foreground">Updated {storyline.updatedAgo}</span>
          <ArrowRight
            className={`${isAdditional ? "w-4 h-4" : "w-5 h-5"} text-accent group-hover:translate-x-1 transition-transform`}
          />
        </div>
      </article>
    </Link>
  )
}
