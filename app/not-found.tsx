import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center p-6 bg-[#F8FAFC]">
      <div className="space-y-1">
        <h1 className="text-7xl font-extrabold tracking-tighter text-[#E2E8F0]">404</h1>
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">Halaman tidak ditemukan</h2>
        <p className="text-[#64748B] max-w-md leading-relaxed">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/dashboard">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}
