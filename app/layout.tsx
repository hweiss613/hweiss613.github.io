import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "National Storyline - Real News. Verified Voices. No Spin.",
  description:
    "National Storyline curates news directly from verified sources on X. We aim to restore trust in media through transparency.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
