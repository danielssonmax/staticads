import type { Metadata } from "next"
import HomeClient from "./home-client"

export const metadata: Metadata = {
  title: "Static Ad Templates - Winning Ad Templates",
  description: "Static ad templates that convert, discover our library of over 1500+ high converting ad templates",
}

export default function Home() {
  return <HomeClient />
}
