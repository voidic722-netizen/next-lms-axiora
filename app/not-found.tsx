import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold">Halaman tidak ditemukan</h2>
      <p className="text-muted-foreground">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Button asChild>
        <Link href="/dashboard">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}
