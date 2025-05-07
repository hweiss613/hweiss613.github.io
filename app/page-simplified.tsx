import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <header className="w-full border-b bg-white">
        <div className="container flex h-24 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-0">
            <Link href="/" className="flex items-center">
              <div className="relative h-24 w-72">
                <Image
                  src="/logo.png"
                  alt="National Storyline Logo"
                  fill
                  style={{ objectFit: "contain", objectPosition: "left" }}
                  priority
                />
              </div>
            </Link>
            <p className="hidden md:block font-serif text-[#0a2342] text-base italic whitespace-nowrap -ml-2">
              The National Conversation, Distilled.
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link href="/business" className="text-sm font-medium hover:underline">
              Business
            </Link>
            <Link href="/politics" className="text-sm font-medium hover:underline">
              Politics
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button className="bg-[#b22234] hover:bg-[#8b1a28] text-white">Subscribe</Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:px-6 md:py-12">
        {/* Hero Section */}
        <section className="py-6">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="font-serif text-3xl font-bold tracking-tighter sm:text-5xl text-[#0a2342]">
              The Day, Summarized.
            </h1>
            <p className="max-w-[600px] text-gray-600 md:text-xl">
              Concise news and data-driven analysis for the busy citizen.
            </p>
            <div>
              <Button className="bg-[#b22234] hover:bg-[#8b1a28] text-white">View Today&apos;s Brief</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
