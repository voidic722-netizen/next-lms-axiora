/**
 * Downloads a file from the given URL using cookie-based credentials.
 * Uses the fetch API directly so credentials are forwarded.
 */
export async function downloadFile(url: string, fileName: string): Promise<void> {
  // Proxy the download through our Next.js API route to bypass CORS issues
  // when downloading static files from the backend (which lack CORS headers).
  const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&fileName=${encodeURIComponent(fileName)}`

  const anchor = document.createElement('a')
  anchor.href = proxyUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
