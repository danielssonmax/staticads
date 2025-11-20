"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const existingPartners = [
  {
    name: "DesignPro Agency",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://www.bostadscentralen.se",
  },
  {
    name: "Bilvård i Eskilstuna",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Creator Partner",
    url: "https://mnbilvardscenter.se",
  },
  {
    name: "Elektriker i Eskilstuna",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Technology Partner",
    url: "https://tornstrandelteknikab.se",
  },
  {
    name: "Plattsättare Eskilstuna",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://byggoplattsattning.se",
  },
  {
    name: "Leasa begagnad bil",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://leasabegagnadbil.se",
  },
  {
    name: "Seiko-Mod",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Technology Partner",
    url: "https://seiko-mod.se",
  },
  {
    name: "Old Money",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Creator Partner",
    url: "https://old-money.se",
  },
  {
    name: "Webbfix",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://webbfix.se",
  },
  {
    name: "Jämför Mäklare",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://jamfor-maklare.se",
  },
  {
    name: "Skapa ditt CV online",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://cvfixaren.se",
  },
  {
    name: "Aluns Motor",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://alunsmotor.se",
  },
  {
    name: "Marknadsbyrå",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://leapmarketing.se",
  },
  {
    name: "Bilverkstad Eskilstuna",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://bilverkstadeskilstuna.se",
  },
  {
    name: "Fordonspunkten",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://fordonspunkten.se",
  },
  {
    name: "Glammering",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://glammeringbh.se",
  },
  {
    name: "Dold-Adress",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://dold-adress.se",
  },
  {
    name: "Seiko Mod Watches",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://seikomodwatches.store",
  },
  {
    name: "Fairing Sports Nutrition",
    logo: "/placeholder.svg?height=80&width=180",
    type: "Agency Partner",
    url: "https://fairing.se",
  },
]

export default function PartnersClientPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 min-h-screen">
      <header className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/images/staticads-logo.png"
              alt="staticads logo"
              width={180}
              height={60}
              className="h-[40px] w-auto"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/ads-library">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await signOut()
                  } catch (error) {
                    console.error("Error signing out:", error)
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]" asChild>
                <Link href="/signup">Try for free</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Partner{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Program</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our growing network of agencies, creators, and technology partners who are building successful
            businesses with Static Ad Templates.
          </p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Partner With Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold mb-2">Grow Together</h3>
              <p className="text-gray-600">
                Build your business alongside our platform and benefit from our growing user base.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Revenue Share</h3>
              <p className="text-gray-600">Earn competitive commissions and revenue sharing opportunities.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">Marketing Support</h3>
              <p className="text-gray-600">
                Get access to marketing materials, co-marketing opportunities, and promotional support.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Current Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {existingPartners.map((partner, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
              >
                <a href={partner.url} target="_blank" rel="noreferrer dofollow">
                  <img
                    src={partner.logo || "/placeholder.svg"}
                    alt={`${partner.name} logo`}
                    className="h-16 w-auto mb-4 grayscale hover:grayscale-0 transition-all"
                  />
                </a>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noreferrer dofollow"
                  className="hover:text-purple-600 transition-colors"
                >
                  <h3 className="font-semibold text-center text-sm">{partner.name}</h3>
                </a>
                <p className="text-xs text-gray-500 text-center mt-1">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join our partner program and start growing your business with Static Ad Templates today.
          </p>
          <Button className="bg-white text-purple-600 hover:bg-gray-100" size="lg">
            Apply to Partner Program
          </Button>
        </div>
      </main>
    </div>
  )
}
