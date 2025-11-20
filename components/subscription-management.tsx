"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Calendar, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { getUserPlan } from "@/lib/user-utils"
import Link from "next/link"

export default function SubscriptionManagement() {
  const { user } = useAuth()
  const [userPlan, setUserPlan] = useState<string>("free")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (user) {
        try {
          const plan = await getUserPlan(user)
          setUserPlan(plan)
        } catch (error) {
          console.error("Error fetching user plan:", error)
        }
      }
      setIsLoading(false)
    }

    fetchUserPlan()
  }, [user])

  const handleCancelSubscription = () => {
    // Open Stripe billing portal in a new tab
    window.open("https://billing.stripe.com/p/login/aFa00jcVtetreRlasL48000", "_blank")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to manage your subscription.</p>
          <Button asChild className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isPaidUser = userPlan === "paid"

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-gray-600">Manage your Static Ad Templates subscription and billing information.</p>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Your current subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isPaidUser ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-lg font-semibold">{isPaidUser ? "Premium Plan" : "Free Plan"}</span>
                {isPaidUser && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                )}
              </div>
              <p className="text-gray-600">
                {isPaidUser
                  ? "Access to 1900+ premium ad templates and weekly updates"
                  : "Limited access to ad templates"}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Account: {user.email}</span>
              </div>
            </div>
            {isPaidUser && (
              <div className="text-right">
                <div className="text-2xl font-bold">€19</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>What's included in your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">{isPaidUser ? "Premium Features" : "Free Plan Features"}</h4>
              <ul className="space-y-2">
                {isPaidUser ? (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>1900+ premium ad templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>50+ new templates weekly</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Open templates in Canva & Figma</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Advanced filtering and sorting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Priority customer support</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span>Limited template access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span>Basic filtering options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span>Standard support</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            {!isPaidUser && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-900">Upgrade to Premium</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Get access to our full library of high-converting ad templates.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">Upgrade Now</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Management */}
      {isPaidUser && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Management</CardTitle>
            <CardDescription>Manage your subscription and billing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Manage Subscription</h4>
                  <p className="text-sm text-gray-600">
                    Update payment method, view invoices, or cancel your subscription
                  </p>
                </div>
                <Button
                  onClick={handleCancelSubscription}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4" />
                  Manage Billing
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600">⚠️</div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Cancellation Policy</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      You can cancel your subscription at any time. You'll continue to have access to premium features
                      until the end of your current billing period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Status:</span>
              <span className={`font-medium ${isPaidUser ? "text-green-600" : "text-gray-600"}`}>
                {isPaidUser ? "Premium Member" : "Free Member"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-medium">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Get support with your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-600">
              If you have any questions about your subscription or need assistance, we're here to help.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/blog">View FAQ</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
