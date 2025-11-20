"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, TrendingUp, Clock } from "lucide-react"
import StripeCheckoutDialog from "./stripe-checkout-dialog"
import { SignupPopup } from "./signup-popup"

export default function PricingSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          🎉 Limited Time Offer
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
          Start Creating Winning Ads in{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Under 5 Minutes
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join 2,500+ marketers who are already crushing it with our proven ad templates
        </p>
      </div>

      {/* Pricing Card */}
      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-600 p-1 shadow-2xl max-w-3xl mx-auto mb-8">
        {/* Popular Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
          ⚡ MOST POPULAR - 89% Choose This
        </div>
        
        <div className="bg-white rounded-3xl p-8 md:p-10">
          {/* Pricing Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="inline-block">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl md:text-7xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    FREE
                  </span>
                </div>
                <p className="text-gray-600 font-semibold mt-2">for 7 days, then just $4.99/month</p>
              </div>
            </div>
            
            {/* Value Proposition */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
              <p className="text-lg font-bold text-gray-900">
                🔥 That's less than a coffee per month for unlimited winning ads!
              </p>
              <p className="text-sm text-gray-600 mt-1">
                (Compare: Hiring a designer = $500+/month | Stock photos alone = $29/month)
              </p>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 text-purple-600 mb-2" />
              <div className="font-bold text-black">1900+</div>
              <div className="text-xs text-gray-600">Templates</div>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <div className="font-bold text-black">50+</div>
              <div className="text-xs text-gray-600">Added Weekly</div>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-blue-600 mb-2" />
              <div className="font-bold text-black">100%</div>
              <div className="text-xs text-gray-600">Money Back</div>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-orange-600 mb-2" />
              <div className="font-bold text-black">5 Min</div>
              <div className="text-xs text-gray-600">Setup Time</div>
            </div>
          </div>

          {/* Benefits (Not Features) */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-black">Everything You Need to Scale Your Ads:</h3>
            <ul className="space-y-3">
              <Benefit 
                text="Launch winning ads in minutes, not days"
                subtext="Save 10+ hours per week on creative production"
              />
              <Benefit 
                text="Access proven templates from top-performing brands"
                subtext="Only ads that have run 30+ days with real results"
              />
              <Benefit 
                text="Edit instantly in Canva or Figma"
                subtext="No design skills needed - just click and customize"
              />
              <Benefit 
                text="50+ fresh templates added every week"
                subtext="Never run out of creative ideas again"
              />
              <Benefit 
                text="Covers all industries and use cases"
                subtext="E-commerce, SaaS, services, and more"
              />
              <Benefit 
                text="Advanced filtering to find perfect ads fast"
                subtext="Sort by industry, style, format, and performance"
              />
            </ul>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-6 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              onClick={() => setIsDialogOpen(true)}
            >
              🚀 Start My FREE 7-Day Trial Now
            </Button>
            
            {/* Risk Reversal */}
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-green-600">✓ Cancel anytime with 1 click</p>
              <p className="text-sm font-semibold text-green-600">✓ 30-day money-back guarantee</p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white" />
                ))}
              </div>
              <span className="font-semibold text-black">2,500+ marketers</span> 
              <span>joined this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Trust Elements */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-gray-600 italic">
          "I went from spending hours scouting ads to launching winners in minutes. Best $5/month I spend!" 
          <span className="font-semibold text-black"> - Sofia R., E-commerce Brand Owner</span>
        </p>
      </div>

      <StripeCheckoutDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      <SignupPopup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} onSignupSuccess={() => setIsSignupOpen(false)} />
    </div>
  )
}

function Benefit({ text, subtext }: { text: string; subtext: string }) {
  return (
    <li className="flex items-start gap-3 group">
      <div className="mt-1 rounded-full p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
        <Check className="w-4 h-4 text-white" />
      </div>
      <div>
        <span className="text-gray-900 font-semibold">{text}</span>
        <p className="text-sm text-gray-600 mt-0.5">{subtext}</p>
      </div>
    </li>
  )
}
