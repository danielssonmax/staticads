import type React from "react"
import type { Metadata } from "next"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Partner Program | Static Ad Templates",
  description: "Join our partner program and grow your business with Static Ad Templates.",
  alternates: {
    canonical: "/partners",
  },
}

export default function PartnersLayout({
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
