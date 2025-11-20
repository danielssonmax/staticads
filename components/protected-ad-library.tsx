"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import AdLibrary from "@/components/ad-library"
import { Loader2 } from "lucide-react"
import { SignupPopup } from "./signup-popup"

export default function ProtectedAdLibrary() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  useEffect(() => {
    // Just a brief loading state, then show the library
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleSignupSuccess = () => {
    setIsSignupOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  // Show the library to everyone, no restrictions
  return (
    <>
      <AdLibrary />
      <SignupPopup isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} onSignupSuccess={handleSignupSuccess} />
    </>
  )
}
