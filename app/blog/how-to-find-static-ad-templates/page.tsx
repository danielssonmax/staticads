import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "How to Find High-Converting Static Ad Templates | Complete Guide",
  description:
    "Learn how to find, evaluate, and select the best static ad templates for your business with our comprehensive step-by-step guide.",
  alternates: {
    canonical: "https://staticadtemplates.com/blog/how-to-find-static-ad-templates",
  },
}

export default function BlogPost() {
  return <ClientPage />
}
