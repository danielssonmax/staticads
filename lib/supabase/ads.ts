import { createClient } from "@/lib/supabase/server"
import type { AdTemplate } from "@/types/api"

export interface StoredAdTemplate {
  id: string
  title: string | null
  description: string | null
  image_url: string | null
  thumbnail_url: string | null
  canva_url: string | null
  industry: string[] | null
  type: string | null
  ratio: string | null
  format: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
  last_synced_at: string
}

/**
 * Upsert (insert or update) ad templates in Supabase
 */
export async function upsertAdTemplates(ads: AdTemplate[], canvaUrls: Map<string, string>) {
  const supabase = await createClient()

  const adsToUpsert = ads.map((ad) => ({
    id: ad.id,
    title: ad.title || ad.name || null,
    description: ad.description || null,
    image_url: ad.url || ad.visual?.url || ad.image || null,
    thumbnail_url: ad.thumbnail || ad.preview_url || null,
    canva_url: canvaUrls.get(ad.id) || null,
    industry: ad.industry ? [ad.industry] : [],
    type: ad.type || null,
    ratio: ad.ratio || null,
    format: ad.format || null,
    tags: ad.tags || [],
    last_synced_at: new Date().toISOString(),
  }))

  const { data, error } = await supabase.from("ad_templates").upsert(adsToUpsert, {
    onConflict: "id",
    ignoreDuplicates: false,
  })

  if (error) {
    throw new Error(`Failed to upsert ads: ${error.message}`)
  }

  return data
}

/**
 * Get all ad templates from Supabase with optional filters
 */
export async function getAdTemplates(filters?: {
  industry?: string[]
  type?: string[]
  ratio?: string[]
  page?: number
  pageSize?: number
}) {
  const supabase = await createClient()

  let query = supabase.from("ad_templates").select("*", { count: "exact" })

  // Apply filters
  if (filters?.industry && filters.industry.length > 0) {
    query = query.overlaps("industry", filters.industry)
  }

  if (filters?.type && filters.type.length > 0) {
    query = query.in("type", filters.type)
  }

  if (filters?.ratio && filters.ratio.length > 0) {
    query = query.in("ratio", filters.ratio)
  }

  // Apply pagination
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to).order("last_synced_at", { ascending: false })

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch ads: ${error.message}`)
  }

  return {
    ads: data as StoredAdTemplate[],
    total: count || 0,
    page,
    pageSize,
  }
}

/**
 * Log cron job execution
 */
export async function logCronJob(log: {
  job_name: string
  status: "started" | "completed" | "failed"
  total_ads_processed?: number
  total_pages_processed?: number
  errors_count?: number
  error_details?: any
  started_at?: string
  completed_at?: string
  duration_seconds?: number
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("cron_job_logs").insert(log).select().single()

  if (error) {
    console.error("Failed to log cron job:", error)
    return null
  }

  return data
}

/**
 * Update cron job log
 */
export async function updateCronJobLog(
  logId: string,
  updates: {
    status?: "started" | "completed" | "failed"
    total_ads_processed?: number
    total_pages_processed?: number
    errors_count?: number
    error_details?: any
    completed_at?: string
    duration_seconds?: number
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("cron_job_logs").update(updates).eq("id", logId).select().single()

  if (error) {
    console.error("Failed to update cron job log:", error)
    return null
  }

  return data
}

