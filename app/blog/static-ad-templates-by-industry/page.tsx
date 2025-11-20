import type { Metadata } from "next"
import StaticAdTemplatesClient from "./StaticAdTemplatesClient"

export const metadata: Metadata = {
  title: "Static Ad Templates by Industry: Finding the Perfect Match | Guide",
  description:
    "Discover industry-specific static ad templates that address unique audience needs and pain points for maximum conversion rates.",
  alternates: {
    canonical: "https://staticadtemplates.com/blog/static-ad-templates-by-industry",
  },
}

export default function BlogPost() {
  return <StaticAdTemplatesClient />
}
