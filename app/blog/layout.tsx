import type React from "react"
import type { Metadata } from "next"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Static Ad Templates Blog",
  description: "Discover expert tips, guides, and best practices for creating high-converting static ad templates.",
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  )
}
