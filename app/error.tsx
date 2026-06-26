'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
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
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center p-6 bg-[#F8FAFC]">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-[#FEF2F2]">
            <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Terjadi kesalahan</h1>
            <p className="text-[#64748B] max-w-md leading-relaxed">
              Sesuatu yang tidak terduga terjadi. Silakan coba lagi.
            </p>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-left text-sm bg-[#F1F5F9] text-[#0F172A] p-4 rounded-xl max-w-lg overflow-auto border border-[#E2E8F0]">
              {error.message}
            </pre>
          )}
          <Button onClick={reset} size="lg">Coba lagi</Button>
        </div>
      </body>
    </html>
  )
}
