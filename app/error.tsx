'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <html lang="id">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center p-4">
          <h1 className="text-2xl font-semibold">Terjadi kesalahan</h1>
          <p className="text-muted-foreground max-w-md">
            Sesuatu yang tidak terduga terjadi. Silakan coba lagi.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-left text-sm bg-muted p-4 rounded max-w-lg overflow-auto">
              {error.message}
            </pre>
          )}
          <Button onClick={reset}>Coba lagi</Button>
        </div>
      </body>
    </html>
  )
}
