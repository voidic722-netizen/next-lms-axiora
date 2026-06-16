/**
 * Downloads a file from the given URL using cookie-based credentials.
 * Uses the fetch API directly so credentials are forwarded.
 */
export async function downloadFile(url: string, fileName: string): Promise<void> {
  const res = await fetch(url, { credentials: 'include' })

  if (!res.ok) {
    throw new Error(`Failed to download file: ${res.statusText}`)
  }

  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = fileName
  anchor.click()

  URL.revokeObjectURL(objectUrl)
}
