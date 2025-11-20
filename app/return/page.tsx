import { Suspense } from "react"
import ReturnClient from "./return-client"

export default function ReturnPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <ReturnClient />
    </Suspense>
  )
}
