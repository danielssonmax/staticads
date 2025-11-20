"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Shield, CreditCard } from "lucide-react"
import BrowserMockup from "@/components/browser-mockup"
import PricingSection from "@/components/pricing-section"
import { SignupPopup } from "@/components/signup-popup"
import FeaturesSection from "@/components/features-section"
import TestimonialsSection from "@/components/testimonials-section"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function HomeClient() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <div className="bg-white text-black">
      <header className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/images/staticads-logo.png"
            alt="staticads logo"
            width={180}
            height={60}
            className="h-[40px] w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            // Logged in user buttons
            <>
              <Button variant="outline" asChild>
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
            // Logged out user buttons
            <>
              <Button variant="outline">Login</Button>
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]" onClick={() => setIsSignupOpen(true)}>
                Try for free
              </Button>
            </>
          )}
        </div>
      </header>

      <main>
        <div className="px-4 max-w-7xl mx-auto">
          <div className="text-center py-16 md:py-24 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto text-black">
              Rapidly create{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                high-converting
              </span>{" "}
              static ads that{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">win</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Your all-in-one hub for discovering and launching high-converting static ads for your brand.
            </p>
            <div className="space-y-4">
              <Button
                size="lg"
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-lg px-8"
                onClick={() => setIsSignupOpen(true)}
              >
                Try For Free
              </Button>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Ads that convert</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Free 7-day trial</span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-8 md:py-16">
            <BrowserMockup />
          </div>
        </div>

        <FeaturesSection />
        <TestimonialsSection />

        <div className="bg-white py-16 md:py-24">
          <PricingSection />
        </div>
      </main>

      <SignupPopup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} onSignupSuccess={() => setIsSignupOpen(false)} />
    </div>
  )
}
