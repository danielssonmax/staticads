import type { Metadata } from "next"
import PartnersClientPage from "./PartnersClientPage"

export const metadata: Metadata = {
  title: "Partner Program | Static Ad Templates",
  description:
    "Join our partner program and grow your business with Static Ad Templates. Connect with agencies, creators, and technology partners.",
  alternates: {
    canonical: "/partners",
  },
}

export default function PartnersPage() {
  return <PartnersClientPage />
}
