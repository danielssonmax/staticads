/**
 * Configuration for URL canonicalization
 */
export const urlConfig = {
  // Valid canonical domains
  validDomains: ["https://staticadtemplates.com", "https://staticflow.store"],
  // Default domain for server-side operations
  defaultDomain: process.env.NEXT_PUBLIC_BASE_URL || "https://staticadtemplates.com",
}

/**
 * Gets the current domain from the request headers or environment
 * @param headers Optional request headers to extract domain from
 * @returns The current domain URL
 */
export function getCurrentDomain(headers?: Headers): string {
  if (typeof window !== "undefined") {
    // Client-side: use window.location
    return `${window.location.protocol}//${window.location.host}`
  }

  if (headers) {
    // Server-side: extract from headers
    const host = headers.get("host")
    const protocol = headers.get("x-forwarded-proto") || "https"
    if (host) {
      return `${protocol}://${host}`
    }
  }

  // Fallback to default domain
  return urlConfig.defaultDomain
}

/**
 * Canonicalizes a URL using the current domain
 * @param path The path to canonicalize (e.g., "/blog" or "blog")
 * @param currentDomain Optional current domain, will be detected if not provided
 * @returns The full canonical URL using the current domain
 */
export function getCanonicalUrl(path: string, currentDomain?: string): string {
  const domain = currentDomain || urlConfig.defaultDomain

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path

  // For the root path, don't add a trailing slash
  if (cleanPath === "") {
    return domain
  }

  // Combine domain with path
  return `${domain}/${cleanPath}`
}

/**
 * Checks if a domain is a valid canonical domain
 * @param domain The domain to check
 * @returns True if the domain is valid for canonicalization
 */
export function isValidCanonicalDomain(domain: string): boolean {
  return urlConfig.validDomains.includes(domain)
}

/**
 * Gets the canonical version of a full URL, preserving the domain
 * @param url The full URL to canonicalize
 * @returns The canonical version of the URL preserving the original domain
 */
export function getCanonicalFromFullUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = `${urlObj.protocol}//${urlObj.host}`

    // Only canonicalize if it's one of our valid domains
    if (isValidCanonicalDomain(domain)) {
      return getCanonicalUrl(urlObj.pathname.slice(1), domain) // Remove leading slash
    }

    return url
  } catch (e) {
    // If URL parsing fails, return the original URL
    return url
  }
}
