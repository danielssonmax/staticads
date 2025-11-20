import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "15 Best Static Ad Templates That Convert in 2025 | Static Ad Templates",
  description:
    "Discover the top 15 static ad templates that are driving exceptional conversion rates across Facebook, Instagram, and Google in 2025.",
  alternates: {
    canonical: "/blog/best-static-ad-templates-2025",
  },
}

export default function BlogPost() {
  return <ClientPage />
}
