'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Building2, Loader2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { withStorageUrl } from '@/lib/storage'
import { departmentSchema, type DepartmentFormValues } from '../schemas/department-schema'
import {
  useDepartments, useDepartmentDetail, useCreateDepartment,
  useUpdateDepartment, useDeleteDepartment,
} from '../hooks/use-departments'
import { useFaculties } from '@/features/faculties/hooks/use-faculties'
import type { Department } from '@/types/department'

export function DepartmentsPage() {
  const { isAdmin } = useAuth()
  const { data: departments = [], isLoading } = useDepartments()
  const deleteMutation = useDeleteDepartment()

  if (isLoading) return <GridSkeleton />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jurusan"
        description={`${departments.length} jurusan terdaftar`}
        action={
          isAdmin ? (
            <Button asChild size="sm">
              <Link href="/departments/new"><Plus className="mr-2 h-4 w-4" />Tambah Jurusan</Link>
            </Button>
          ) : undefined
        }
      />
      {departments.length === 0 ? (
        <EmptyState icon={<Building2 className="h-12 w-12 text-[#64748B]/40" />} text="Belum ada jurusan" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <DepartmentCard key={d.id} department={d} isAdmin={isAdmin}
              onDelete={() => deleteMutation.mutateAsync(d.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function DepartmentCard({ department: d, isAdmin, onDelete }: {
  department: Department; isAdmin: boolean; onDelete: () => Promise<void>
}) {
  const thumb = withStorageUrl(d.thumbnail)
  return (
    <Card className="overflow-hidden group border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
      <Link href={`/departments/${d.id}`}>
        <div className="aspect-video bg-[#F8FAFC]">
          {thumb
            ? <img src={thumb} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="w-full h-full flex items-center justify-center"><Building2 className="h-10 w-10 text-[#64748B]/30" /></div>}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/departments/${d.id}`}>
          <h3 className="font-semibold text-[#0F172A] truncate hover:underline">{d.name}</h3>
        </Link>
        <p className="text-sm text-[#64748B] line-clamp-2 mt-1">{d.description}</p>
        {isAdmin && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#E2E8F0]">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/departments/${d.id}/edit`}><Pencil className="mr-1.5 h-3.5 w-3.5" />Edit</Link>
            </Button>
            <ConfirmDialog
              trigger={<Button variant="outline" size="sm" className="text-[#EF4444] hover:text-[#DC2626] border-[#EF4444]/30 hover:border-[#EF4444]/50">Hapus</Button>}
              title="Hapus Jurusan" description={`Yakin ingin menghapus "${d.name}"?`}
              confirmLabel="Hapus" onConfirm={onDelete}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DepartmentDetailPage({ id }: { id: string }) {
  const { data: dept, isLoading } = useDepartmentDetail(id)
  if (isLoading) return <Skeleton className="h-96 rounded-lg bg-[#E2E8F0]" />
  if (!dept) return <p className="text-[#64748B]">Jurusan tidak ditemukan.</p>
  return (
    <div className="space-y-6">
      <PageHeader title={dept.name} description={dept.description} />
      <Tabs defaultValue="teachers">
        <TabsList>
          <TabsTrigger value="teachers">Pengajar ({dept.teachers.length})</TabsTrigger>
          <TabsTrigger value="students">Mahasiswa ({dept.students.length})</TabsTrigger>
          <TabsTrigger value="subjects">Mata Pelajaran ({dept.subjects.length})</TabsTrigger>
          <TabsTrigger value="classrooms">Kelas ({dept.classrooms.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="teachers" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dept.teachers.map((t) => (
              <Card key={t.id} className="border border-[#E2E8F0] bg-white shadow-sm">
                <CardContent className="pt-4 flex items-center gap-3">
                  <Avatar><AvatarFallback>{t.name.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-medium text-sm text-[#0F172A]">{t.name}</p>
                    <p className="text-xs text-[#64748B]">{t.nidn ?? t.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="students" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dept.students.map((s) => (
              <Card key={s.id} className="border border-[#E2E8F0] bg-white shadow-sm">
                <CardContent className="pt-4 flex items-center gap-3">
                  <Avatar><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-medium text-sm text-[#0F172A]">{s.name}</p>
                    <p className="text-xs text-[#64748B]">{s.nim ?? s.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="subjects" className="mt-4">
          <div className="space-y-2">
            {dept.subjects.map((s) => (
              <Card key={s.id} className="border border-[#E2E8F0] bg-white shadow-sm">
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <p className="font-medium text-sm text-[#0F172A]">{s.name}</p>
                  <Badge variant="secondary">{s.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="classrooms" className="mt-4">
          <div className="space-y-2">
            {dept.classrooms.map((c) => (
              <Card key={c.id} className="border border-[#E2E8F0] bg-white shadow-sm">
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <p className="font-medium text-sm text-[#0F172A]">{c.name}</p>
                  <p className="text-xs text-[#64748B]">{c.semester?.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DepartmentForm({ defaultValues, onSubmit, isPending, submitLabel, onCancel }: {
  defaultValues?: Partial<DepartmentFormValues>
  onSubmit: (v: DepartmentFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
  onCancel: () => void
}) {
  const { data: faculties = [] } = useFaculties()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues,
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function clearThumbnail() {
    setValue('thumbnail', undefined)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nama Jurusan</Label>
        <Input placeholder="Teknik Informatika" {...register('name')} />
        {errors.name && <p className="text-xs text-[#EF4444]">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Deskripsi</Label>
        <Textarea rows={3} {...register('description')} />
        {errors.description && <p className="text-xs text-[#EF4444]">{errors.description.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Fakultas</Label>
        <Select onValueChange={(v) => setValue('facultyId', Number(v))}>
          <SelectTrigger><SelectValue placeholder="Pilih fakultas" /></SelectTrigger>
          <SelectContent>
            {faculties.map((f) => <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.facultyId && <p className="text-xs text-[#EF4444]">{errors.facultyId.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Thumbnail (opsional)</Label>
        {preview ? (
          <div className="relative inline-block">
            <img src={preview} alt="preview" className="h-32 rounded border border-[#E2E8F0] object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1.5 right-1.5 h-6 w-6"
              onClick={clearThumbnail}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Pilih Gambar
          </Button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0]; if (!f) return
          setValue('thumbnail', f); setPreview(URL.createObjectURL(f))
        }} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  )
}

export function AddDepartmentPage() {
  const router = useRouter()
  const mutation = useCreateDepartment()
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Tambah Jurusan" />
      <Card><CardContent className="pt-6">
        <DepartmentForm
          onSubmit={async (v) => { await mutation.mutateAsync(v); router.push('/departments') }}
          isPending={mutation.isPending} submitLabel="Simpan" onCancel={() => router.back()}
        />
      </CardContent></Card>
    </div>
  )
}

export function EditDepartmentPage({ id }: { id: string }) {
  const router = useRouter()
  const { data: dept, isLoading } = useDepartmentDetail(id)
  const mutation = useUpdateDepartment(Number(id))
  if (isLoading) return <Skeleton className="h-96 rounded-lg max-w-xl bg-[#E2E8F0]" />
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Edit Jurusan" />
      <Card><CardContent className="pt-6">
        <DepartmentForm
          defaultValues={dept ? { name: dept.name, description: dept.description, facultyId: dept.facultyId } : undefined}
          onSubmit={async (v) => { await mutation.mutateAsync(v); router.push(`/departments/${id}`) }}
          isPending={mutation.isPending} submitLabel="Simpan Perubahan" onCancel={() => router.back()}
        />
      </CardContent></Card>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex flex-col items-center justify-center py-16 text-center gap-3">{icon}<p className="text-[#64748B]">{text}</p></div>
}
function GridSkeleton() {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-lg bg-[#E2E8F0]" />)}</div>
}