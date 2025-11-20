"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

// This is a mock data array. In a real application, you would fetch this data from an API.
const mockAds = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    title: `Ad ${i + 1}`,
    imageUrl: `https://xn7q-nefz-qhlj.n7d.xano.io/vault/r4fM_Vz3/KiNUkK7Qjzqkl78PydAiU5Gft1g/M3nT5A../1038.webp?height=300&width=300&text=Ad ${i + 1}`,
  }))

export default function AdGrid() {
  const [ads, setAds] = useState(mockAds)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ads.map((ad) => (
          <div key={ad.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={ad.imageUrl || "/placeholder.svg"} alt={ad.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{ad.title}</h3>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button onClick={() => setAds((prev) => [...prev, ...mockAds])} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
          Load More
        </Button>
      </div>
    </div>
  )
}
