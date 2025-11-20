"use client"

import { usePathname } from "next/navigation"
import Head from "next/head"
import { getCanonicalUrl, getCurrentDomain } from "@/lib/url-utils"

export default function CanonicalLink() {
  const pathname = usePathname()
  const currentDomain = getCurrentDomain()
  const canonicalUrl = getCanonicalUrl(pathname || "", currentDomain)

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}
