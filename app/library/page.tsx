import { Button } from "@/components/ui/button"
import AdGrid from "@/components/ad-grid"
import Image from "next/image"

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
      <header className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/images/staticads-logo.png"
            alt="staticads logo"
            width={180}
            height={60}
            className="h-[40px] w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Login</Button>
          <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]">Try for free</Button>
        </div>
      </header>

      <main className="px-4 py-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Ad Library</h1>
        <AdGrid />
      </main>
    </div>
  )
}
