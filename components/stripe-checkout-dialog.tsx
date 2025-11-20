"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubscriptionSuccess?: () => void
}

export default function StripeCheckoutDialog({ isOpen, onClose, onSubscriptionSuccess }: StripeCheckoutDialogProps) {
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    if (isOpen) {
      fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: "price_1S6Ww7DPWoWpgTDwWWvly8YM" }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
    }
  }, [isOpen])

  const handleSubscriptionSuccess = () => {
    console.log("Subscription completed successfully")
    if (onSubscriptionSuccess) {
      onSubscriptionSuccess()
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white rounded-md overflow-y-auto"
        style={{ height: "100%", minHeight: "300px", maxHeight: "60vh" }}
      >
        {clientSecret ? (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret, onComplete: handleSubscriptionSuccess }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <div className="flex justify-center items-center h-full overflow-y-auto">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
