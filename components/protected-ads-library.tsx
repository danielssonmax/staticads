"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import AdLibrary from "@/components/ad-library"
import { Loader2, Lock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignupPopup } from "./signup-popup"
import { hasAccessToAdsLibrary, debugProfilesTable } from "@/lib/user-utils"
import StripeCheckoutDialog from "./stripe-checkout-dialog"

export default function ProtectedAdsLibrary() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      console.log("=== ProtectedAdsLibrary: checkAccess called ===")
      console.log("Current user:", user)
      console.log("User email:", user?.email)
      console.log("User ID:", user?.id)

      setIsLoading(true)

      // Debug: Check what's in the profiles table
      await debugProfilesTable()

      if (!user) {
        console.log("No user found, access denied")
        setHasAccess(false)
        setIsLoading(false)
        return
      }

      try {
        const access = await hasAccessToAdsLibrary(user)
        console.log("Final access check result:", access)
        setHasAccess(access)
      } catch (error) {
        console.error("Error checking access:", error)
        setHasAccess(false)
      } finally {
        setIsLoading(false)
        console.log("=== ProtectedAdsLibrary: checkAccess completed ===")
      }
    }

    checkAccess()
  }, [user])

  const handleSignupSuccess = () => {
    setIsSignupOpen(false)
    // After signup, user will still need to upgrade to paid plan
  }

  const handleSubscriptionSuccess = () => {
    setIsCheckoutOpen(false)
    // Refresh the access check after successful payment
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  // If user is not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8">
        <div className="text-center max-w-md">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            You need to sign in to access the ads library. Create an account or sign in to continue.
          </p>
          <Button onClick={() => setIsSignupOpen(true)} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            Sign In / Sign Up
          </Button>
        </div>
        <SignupPopup
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          onSignupSuccess={handleSignupSuccess}
        />
      </div>
    )
  }

  // If user is logged in but doesn't have paid access
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8">
        <div className="text-center max-w-md">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Upgrade Required</h1>
          <p className="text-gray-600 mb-2">
            Hi {user.email}! You need a paid subscription to access our premium ads library.
          </p>
          <p className="text-gray-600 mb-6">Upgrade now to unlock 1900+ high-converting ad templates.</p>
          <div className="space-y-3">
            <Button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white w-full"
            >
              Upgrade to Premium
            </Button>
            <p className="text-sm text-gray-500">7-day free trial • Cancel anytime</p>
          </div>

          {/* Debug info in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left">
              <strong>Debug Info:</strong>
              <br />
              Email: {user.email}
              <br />
              User ID: {user.id}
              <br />
              Has Access: {hasAccess.toString()}
              <br />
              <em>Check console for detailed logs</em>
            </div>
          )}
        </div>
        <StripeCheckoutDialog
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSubscriptionSuccess={handleSubscriptionSuccess}
        />
      </div>
    )
  }

  // User has access, show the ads library
  return <AdLibrary />
}
