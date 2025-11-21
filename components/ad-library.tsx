"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Copy, RefreshCw } from "lucide-react"
import { queryAds, getCanvaLinkForAd } from "@/lib/api"
import type { QueryParams, AdTemplate } from "@/types/api"
import { useToast } from "@/hooks/use-toast"

// Fallback data if the API fails on the very first page
const fallbackAds: AdTemplate[] = [
  {
    id: 1,
    name: "Fashion Sale Ad",
    url: "https://xn7q-nefz-qhlj.n7d.xano.io/vault/r4fM_Vz3/g2m59I9d7g-YmqpoMVMYY8Zk1Uk/fwcAIA../1058.webp",
    canva_url: "https://www.canva.com/design/template1",
    industry: "Fashion & Accessories",
    type: "Offer/Sale",
    ratio: "1:1 (Square)",
    created_at: "2024-01-01",
    is_free: true,
  },
  {
    id: 2,
    name: "Health Product Ad",
    url: "https://xn7q-nefz-qhlj.n7d.xano.io/vault/r4fM_Vz3/UDtt5pmNhO3cV9XP3egdF_iz8jw/yYzudg../1057.webp",
    canva_url: "https://www.canva.com/design/template2",
    industry: "Health & Wellness",
    type: "Before & After",
    ratio: "1:1 (Square)",
    created_at: "2024-01-02",
    is_free: false,
  },
]

export default function AdLibrary() {
  const [ads, setAds] = useState<AdTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true) // initial page loading
  const [isLoadingMore, setIsLoadingMore] = useState(false) // subsequent pages loading
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true) // assume more pages until we hit an empty response

  // Keep all server-driven params here; page_id is the only pagination source of truth
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page_id: 1,
    industry: [],
    type: [],
    ratio: [],
    external_sorting: [{ sortBy: "created_at", orderBy: "desc" }],
    saved_ads: false,
    free_ads: false,
  })

  const { toast } = useToast()
  const firstLoadDoneRef = useRef(false)

  // Helper: compute a primary unique id for deduping
  const getPrimaryId = (ad: AdTemplate): string => {
    const raw =
      (ad.id as any) ??
      (ad as any).template_id ??
      (ad as any).templateId ??
      (ad as any)._id ??
      (ad as any).id_str ??
      Math.random().toString(36).slice(2)
    return String(raw)
  }

  // Fetch ads whenever queryParams change. Append if page_id > 1; replace if page_id === 1.
  const fetchAds = async () => {
    const isFirstPage = queryParams.page_id === 1
    try {
      setError(null)
      if (isFirstPage && !firstLoadDoneRef.current) setIsLoading(true)
      else setIsLoadingMore(true)

      const response = await queryAds(queryParams)

      const batch = Array.isArray(response.ads) ? response.ads : []
      // If we got 0 results, there are no more pages
      setHasMore(batch.length > 0)

      if (isFirstPage) {
        // Replace on first page
        setAds(batch)
      } else {
        // Append on subsequent pages with simple deduplication by primary id
        setAds((prev) => {
          const seen = new Set(prev.map(getPrimaryId))
          const newOnes = batch.filter((ad) => !seen.has(getPrimaryId(ad)))
          return prev.concat(newOnes)
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)

      if (queryParams.page_id === 1) {
        // First page error: show fallback
        setAds(fallbackAds)
        setHasMore(false)
      } else {
        // Subsequent page error: keep what we have, but prevent further loading
        setHasMore(false)
        toast({
          title: "Could not load more ads",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    } finally {
      if (isFirstPage && !firstLoadDoneRef.current) {
        setIsLoading(false)
        firstLoadDoneRef.current = true
      } else {
        setIsLoadingMore(false)
      }
    }
  }

  useEffect(() => {
    fetchAds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.page_id, queryParams.industry, queryParams.type, queryParams.ratio, queryParams.external_sorting])

  // Filter handlers reset to page 1 and clear previous items
  const handleFilterChange = (type: "industry" | "type" | "ratio", value: string) => {
    setHasMore(true)
    setAds([])
    setQueryParams((prev) => ({
      ...prev,
      [type]: value && value !== `All ${type.charAt(0).toUpperCase() + type.slice(1)}s` ? [value] : [],
      page_id: 1,
    }))
  }

  const handleSortChange = (value: string) => {
    const [sortBy, orderBy] = value.split("-")
    setHasMore(true)
    setAds([])
    setQueryParams((prev) => ({
      ...prev,
      external_sorting: [
        {
          sortBy,
          orderBy: orderBy as "asc" | "desc",
        },
      ],
      page_id: 1,
    }))
  }

  const clearFilters = () => {
    setHasMore(true)
    setAds([])
    setQueryParams((prev) => ({
      ...prev,
      industry: [],
      type: [],
      ratio: [],
      page_id: 1,
    }))
  }

  const loadMore = () => {
    if (!hasMore || isLoadingMore) return
    setQueryParams((prev) => ({
      ...prev,
      page_id: prev.page_id + 1, // increment pageId by +1
    }))
  }

  const handleOpenInCanva = async (ad: AdTemplate) => {
    const primaryId: string | number =
      ad.id ?? (ad as any).template_id ?? (ad as any).templateId ?? (ad as any)._id ?? (ad as any).id_str ?? "unknown"
    try {
      const canvaLink = await getCanvaLinkForAd(ad)
      window.open(canvaLink, "_blank", "noopener,noreferrer")
    } catch {
      toast({
        title: "Unable to open Canva link",
        description: "We couldn’t retrieve the Canva link for this template. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleAdAction = (action: () => void) => action()

  // Resolve image url from various possible fields
  const getImageUrl = (ad: AdTemplate) =>
    ad.url || ad.visual?.url || ad.thumbnail || ad.image || ad.preview_url || "/placeholder.svg"
  const getAdTitle = (ad: AdTemplate) => ad.name || ad.title || `Ad Template ${getPrimaryId(ad)}`
  const getAdMetadata = (ad: AdTemplate) => {
    const type = ad.type || (ad as any).template_type || (ad as any).category || "Template"
    const ratio = ad.ratio || (ad as any).aspect_ratio || "Unknown"
    return `${type} • ${ratio}`
  }
  const getBrandInfo = (ad: AdTemplate) => ad.brand || null
  const isAdFree = (ad: AdTemplate) => ad.is_free || (ad as any).free || !(ad as any).premium || false

  return (
    <div className="h-full flex flex-col">
      <div className="border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-semibold">Ad library</h1>
          <Tabs defaultValue="ads" className="w-auto">
            <TabsList>
              <TabsTrigger value="ads">Ads</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="landers">Landers</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="px-6 py-3 border-t flex items-center justify-between">
          <div className="flex gap-3">
            <Select
              value={queryParams.industry[0] || "All Industries"}
              onValueChange={(value) => handleFilterChange("industry", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Industries">All Industries</SelectItem>
                <SelectItem value="Fashion & Accessories">Fashion & Accessories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Pets">Pets</SelectItem>
                <SelectItem value="Home & Furniture">Home & Furniture</SelectItem>
                <SelectItem value="Skincare">Skincare</SelectItem>
                <SelectItem value="Saas/Apps">SaaS/Apps</SelectItem>
                <SelectItem value="Self Care">Self Care</SelectItem>
                <SelectItem value="Sports Outdoor">Sports & Outdoor</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Kids Baby">Kids/Baby</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={queryParams.type[0] || "All Types"}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Before & After">Before & After</SelectItem>
                <SelectItem value="Feature/Benefit">Feature/Benefit</SelectItem>
                <SelectItem value="Article/News">Article/News</SelectItem>
                <SelectItem value="Apple Notes">Apple Notes</SelectItem>
                <SelectItem value="Statistics">Statistics</SelectItem>
                <SelectItem value="Us vs Them">Us vs Them</SelectItem>
                <SelectItem value="Bold Claim">Bold Claim</SelectItem>
                <SelectItem value="Native">Native</SelectItem>
                <SelectItem value="Offer/Sale">Offer/Sale</SelectItem>
                <SelectItem value="Testimonial">Testimonial</SelectItem>
                <SelectItem value="Negative Hook">Negative Hook</SelectItem>
                <SelectItem value="Google Search">Google Search</SelectItem>
                <SelectItem value="What's Inside">What's Inside</SelectItem>
                <SelectItem value="AirDrop">AirDrop</SelectItem>
                <SelectItem value="Headline">Headline</SelectItem>
                <SelectItem value="Meme">Meme</SelectItem>
                <SelectItem value="Problem + Solution">Problem + Solution</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={queryParams.ratio[0] || "All Ratios"}
              onValueChange={(value) => handleFilterChange("ratio", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Ratios">All Ratios</SelectItem>
                <SelectItem value="1:1 (Square)">1:1</SelectItem>
                <SelectItem value="9:16 (Vertical)">16:9</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
            <Select defaultValue="created_at-desc" onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort: Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest</SelectItem>
                <SelectItem value="created_at-asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {error && queryParams.page_id === 1 && (
          <div className="px-6 py-2 bg-red-50 border-y border-red-100 text-sm text-red-600 flex justify-between items-center">
            <span>API Error: {error} (Showing fallback data)</span>
            <Button
              onClick={() => {
                setError(null)
                setAds([])
                setHasMore(true)
                setQueryParams((prev) => ({ ...prev, page_id: 1 }))
              }}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : ads.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ads.map((ad) => {
                const key =
                  (ad.id as any) ??
                  (ad as any).template_id ??
                  (ad as any).templateId ??
                  (ad as any)._id ??
                  (ad as any).id_str ??
                  Math.random()
                return (
                  <div key={key} className="group relative flex flex-col rounded-lg border bg-white overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={getImageUrl(ad) || "/placeholder.svg"}
                        alt={getAdTitle(ad)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=300&width=300"
                        }}
                      />
                      {isAdFree(ad) && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Free
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenInCanva(ad)}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in Canva
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAdAction(() => {
                              navigator.clipboard.writeText(getImageUrl(ad))
                            })
                          }
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm truncate" title={getAdTitle(ad)}>
                        {getAdTitle(ad)}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{getAdMetadata(ad)}</p>
                      {getBrandInfo(ad) && (
                        <p className="text-xs text-gray-400 mt-1" title={getBrandInfo(ad)!}>
                          {getBrandInfo(ad)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load more section */}
            <div className="flex justify-center items-center mt-8 pb-6">
              <Button
                onClick={loadMore}
                disabled={!hasMore || isLoadingMore}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading more...
                  </>
                ) : hasMore ? (
                  "Load more"
                ) : (
                  "No more results"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">No ads found.</div>
        )}
      </div>
    </div>
  )
}
