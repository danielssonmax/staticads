"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import StripeCheckoutDialog from "./stripe-checkout-dialog"
import { SignupPopup } from "./signup-popup"

export default function PricingSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600">Start your journey to better ads today</p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-purple-600 p-8 shadow-lg max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Premium Plan</h3>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Best Value</div>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-4xl font-bold text-green-600">$0</span>
            <span className="text-gray-600">first 7 days</span>
          </div>
          <div className="flex items-center gap-2 justify-center mt-2">
            <span className="text-4xl font-bold">$4,99</span>
            <span className="text-gray-600 ml-2">per month after</span>
          </div>
        </div>
        <p className="text-gray-600 mb-6">Start with a 7-day free trial, then $5/month</p>
        <ul className="space-y-4 mb-8">
          <Feature text="1900+ static ads templates" />
          <Feature text="50+ new ads added weekly" />
          <Feature text="Winning ads for every industry & use case" />
          <Feature text="Open templates in Canva & Figma for easy editing" />
          <Feature text="Copy templates into your workspace" />
          <Feature text="Full access to all filtering and sorting options" />
        </ul>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
          onClick={() => setIsDialogOpen(true)}
        >
          Start 7-Day Free Trial
        </Button>
        <p className="text-sm text-gray-500 mt-4 text-center">Cancel anytime</p>
      </div>

      <StripeCheckoutDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      <SignupPopup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </div>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 rounded-full p-1 bg-purple-100">
        <Check className="w-4 h-4 text-purple-600" />
      </div>
      <span className="text-gray-700">{text}</span>
    </li>
  )
}
