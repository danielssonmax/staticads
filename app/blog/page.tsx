import type { Metadata } from "next"
import BlogClientPage from "./BlogClientPage"

export const metadata: Metadata = {
  title: "Static Ad Templates Blog - Tips, Guides & Best Practices",
  description:
    "Discover expert tips, guides, and best practices for creating high-converting static ad templates for your marketing campaigns.",
  alternates: {
    canonical: "/blog",
  },
}

export default function BlogPage() {
  return <BlogClientPage />
}
