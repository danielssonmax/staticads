import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, RotateCcw } from "lucide-react"
import Image from "next/image"

export default function BrowserMockup() {
  return (
    <div className="rounded-lg shadow-2xl border bg-white w-full max-w-full overflow-hidden">
      <div className="border-b px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <ChevronLeft className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <RotateCcw className="w-4 h-4" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-gray-100 rounded-md py-1 px-3 flex items-center gap-2 max-w-md">
            <div className="w-4 h-4 rounded bg-gray-300" />
            <div className="text-sm text-gray-400 truncate">https://staticads.com/dashboard/ads-library</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-gray-400" />
          <div className="w-4 h-4 rounded bg-gray-200" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Ads library</h2>
          <Button variant="outline" className="text-sm">
            Upgrade plan
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "https://xn7q-nefz-qhlj.n7d.xano.io/vault/r4fM_Vz3/g2m59I9d7g-YmqpoMVMYY8Zk1Uk/fwcAIA../1058.webp",
            "https://xn7q-nefz-qhlj.n7d.xano.io/vault/r4fM_Vz3/UDtt5pmNhO3cV9XP3egdF_iz8jw/yYzudg../1057.webp",
            "https://xn7q-nefz-qhlj.n7d.xano.io/vault/r4fM_Vz3/ZwkUn0q0DaFvirs23dn1UlfAeK0/OJUyvA../1056.webp",
            "https://xn7q-nefz-qhlj.n7d.xano.io/vault/r4fM_Vz3/m2HgPcsiGPZvJpaIux6UGtYyDAU/_zeWcA../1055.webp",
          ].map((imageUrl, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg border bg-gray-50 hover:border-purple-500 transition-colors overflow-hidden"
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={`Ad Preview ${i + 1}`}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
