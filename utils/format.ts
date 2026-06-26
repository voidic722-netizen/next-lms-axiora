/**
 * Formats a file size in bytes to a human-readable string.
 * Examples: 1024 → "1 KB", 1048576 → "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i] ?? 'B'}`
}

/**
 * Resolves the canonical max file size in bytes.
 *
 * The backend stores max_file_size inconsistently:
 * values <= 1000 are treated as megabytes; larger values as bytes.
 * This helper centralises that heuristic in one place.
 *
 * helper once the API is standardised.
 */
export function resolveMaxFileSizeBytes(maxFileSize: number): number {
  return maxFileSize <= 1000
    ? maxFileSize * 1024 * 1024
    : maxFileSize
}

/**
 * Returns a human-readable string of the max file size.
 * Examples: 2 → "2 MB", 5 → "5 MB"
 */
export function formatMaxFileSize(maxFileSize: number): string {
  const bytes = resolveMaxFileSizeBytes(maxFileSize)
  return formatFileSize(bytes)
}
