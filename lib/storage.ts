const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? ''

/**
 * Prepends the storage base URL to a relative path.
 * Returns null if the path is null.
 * Returns the path unchanged if it already starts with http/https.
 */
export function withStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return STORAGE_URL + path
}

/**
 * Strips the storage base URL from a full URL, returning just the relative path.
 * Used when sending existing image paths back to the backend.
 */
export function toStoragePath(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith(STORAGE_URL)) return url.replace(STORAGE_URL, '')
  return url
}
