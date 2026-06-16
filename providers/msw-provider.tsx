'use client'

import { useEffect, useState } from 'react'

interface MSWProviderProps {
  children: React.ReactNode
}

/**
 * Aktifkan Mock Service Worker hanya di development mode.
 * Di production, komponen ini langsung render children tanpa MSW.
 *
 * Import dinamis menghindari MSW masuk ke bundle production.
 */
export function MSWProvider({ children }: MSWProviderProps) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== 'development')

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (process.env.NEXT_PUBLIC_MSW !== 'true') {
      setReady(true)
      return
    }

    import('@/src/mocks/browser').then(({ worker }) => {
      worker.start({
        onUnhandledRequest: 'bypass', // request ke luar API tidak diblokir
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      }).then(() => {
        console.info('[MSW] Mock Service Worker aktif')
        setReady(true)
      })
    })
  }, [])

  // Tampilkan loading singkat agar MSW aktif sebelum request pertama
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Memuat mock data...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}