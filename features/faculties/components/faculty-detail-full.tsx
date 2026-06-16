'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Building2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { withStorageUrl } from '@/lib/storage'
import { useFacultyDetail, useDeleteFaculty } from '../hooks/use-faculties'

export function FacultyDetailPage({ id }: { id: string }) {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const { data: faculty, isLoading } = useFacultyDetail(id)
  const deleteMutation = useDeleteFaculty()

  if (isLoading) return <Skeleton className="h-96 rounded-lg bg-[#E2E8F0]" />
  if (!faculty) return <p className="text-[#64748B]">Fakultas tidak ditemukan.</p>
  const thumb = withStorageUrl(faculty.thumbnail)

  return (
    <div className="space-y-6">
      <PageHeader title={faculty.name} description={faculty.description}
        action={isAdmin ? (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/faculties/${id}/edit`}><Pencil className="mr-1.5 h-4 w-4" />Edit</Link>
            </Button>
            <ConfirmDialog
              trigger={<Button variant="destructive" size="sm"><Trash2 className="mr-1.5 h-4 w-4" />Hapus</Button>}
              title="Hapus Fakultas" description={`Yakin menghapus "${faculty.name}"?`} confirmLabel="Hapus"
              onConfirm={async () => { await deleteMutation.mutateAsync(faculty.id); router.push('/faculties') }}
            />
          </div>
        ) : undefined}
      />
      {thumb && <img src={thumb} alt={faculty.name} className="w-full max-h-64 object-cover rounded-lg border border-[#E2E8F0]" />}
      {faculty.dean && <p className="text-sm"><span className="text-[#64748B]">Dekan: </span><span className="font-medium text-[#0F172A]">{faculty.dean}</span></p>}
      <Tabs defaultValue="departments">
        <TabsList>
          <TabsTrigger value="departments">Jurusan ({faculty.departments.length})</TabsTrigger>
          <TabsTrigger value="teachers">Pengajar ({faculty.teachers.length})</TabsTrigger>
          <TabsTrigger value="students">Mahasiswa ({faculty.students.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="departments" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.departments.map((d) => (
            <Link key={d.id} href={`/departments/${d.id}`}>
              <Card className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
                <CardContent className="pt-4 flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-[#4B5CF0] shrink-0" />
                  <p className="font-medium text-sm text-[#0F172A]">{d.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>
        <TabsContent value="teachers" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.teachers.map((t) => (
            <Card key={t.id} className="border border-[#E2E8F0] bg-white shadow-sm">
              <CardContent className="pt-4 flex items-center gap-3">
                <Avatar><AvatarFallback>{t.name.charAt(0)}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-[#0F172A]">{t.name}</p>
                  <p className="text-xs text-[#64748B]">{t.nidn ?? t.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="students" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.students.map((s) => (
            <Card key={s.id} className="border border-[#E2E8F0] bg-white shadow-sm">
              <CardContent className="pt-4 flex items-center gap-3">
                <Avatar><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-[#0F172A]">{s.name}</p>
                  <p className="text-xs text-[#64748B]">{s.nim ?? s.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}