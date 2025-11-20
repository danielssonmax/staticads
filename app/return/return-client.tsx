"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ReturnClient() {
  const [status, setStatus] = useState<"success" | "cancel" | "processing" | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          switch (data.status) {
            case "complete":
              setStatus("success")
              break
            case "open":
              setStatus("processing")
              break
            default:
              setStatus("cancel")
              break
          }
        })
    }
  }, [searchParams])

  if (status === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {status === "success" && <h1>Thank you for your purchase!</h1>}
      {status === "processing" && <h1>Your payment is being processed.</h1>}
      {status === "cancel" && <h1>Your payment was cancelled.</h1>}
    </div>
  )
}
