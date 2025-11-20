"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SignupPopupProps {
  isOpen: boolean
  onClose: () => void
  onSignupSuccess: () => void // Add this line
}

export function SignupPopup({ isOpen, onClose, onSignupSuccess }: SignupPopupProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"register" | "login">("register")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        onClose()
        onSignupSuccess()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        onClose()
        router.push("/dashboard/ads-library")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://staticadtemplates.com/dashboard/ads-library",
        },
      })
      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <div className="px-6 pt-6 pb-4 space-y-6">
          <div className="text-center">
            <Image
              src="/images/design-mode/Namnl%C3%B6s%20(300%20x%20100%20px)%20(5).png"
              alt="WEBBFIX.SE Logo"
              width={160}
              height={40}
              className="mx-auto mb-6"
            />
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "register" | "login")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-transparent"
            onClick={handleGoogleSignIn}
          >
            <Image
              src="/images/design-mode/google%20logo.png"
              alt="Google"
              width={18}
              height={18}
              className="object-contain"
            />
            <span>Continue with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <form onSubmit={activeTab === "register" ? handleSignup : handleLogin} className="space-y-4">
            {activeTab === "register" && (
              <div>
                <Input
                  placeholder="What's your name?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]" disabled={isLoading}>
              {activeTab === "register" ? "Sign Up" : "Log In"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-[#7C3AED] hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#7C3AED] hover:underline">
              Privacy
            </Link>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
