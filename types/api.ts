export type AdTemplate = {
  id: number | string
  name?: string
  title?: string
  url: string
  canva_url?: string
  figma_url?: string
  industry?: string
  type?: string
  ratio?: string
  created_at?: string
  is_free?: boolean
  visual?: {
    url: string
  }
  // StaticFlow API specific fields
  thumbnail?: string
  preview_url?: string
  image?: string
  template_url?: string
  tags?: string[]
  brand?: string
  description?: string
  // Additional possible fields from StaticFlow
  category?: string
  aspect_ratio?: string
  template_type?: string
  free?: boolean
  premium?: boolean

  // Potential alternative ID fields returned by different endpoints
  template_id?: string | number
  templateId?: string | number
  _id?: string | number
  id_str?: string
}

export type QueryParams = {
  page_id: number
  industry: string[]
  type: string[]
  ratio: string[]
  external_sorting: Array<{
    sortBy: string
    orderBy: "asc" | "desc"
  }>
  saved_ads: boolean
  free_ads: boolean
}

export type ApiResponse = {
  ads: AdTemplate[]
  total_count: number
  current_page: number
  total_pages: number
}

// Request body structure for StaticFlow API
export type StaticFlowRequest = {
  industryFilters: string[]
  typeFilters: string[]
  ratioFilters: string[]
}

// Possible response structures from StaticFlow API
export type StaticFlowApiResponse = {
  data?: AdTemplate[]
  ads?: AdTemplate[]
  results?: AdTemplate[]
  templates?: AdTemplate[]
  items?: AdTemplate[]
  total?: number
  totalCount?: number
  total_count?: number
  count?: number
  page?: number
  currentPage?: number
  current_page?: number
  totalPages?: number
  total_pages?: number
  pages?: number
  success?: boolean
  message?: string
  status?: string
}
