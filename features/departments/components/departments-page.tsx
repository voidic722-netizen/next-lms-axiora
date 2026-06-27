'use client'

import Link from 'next/link'
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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)

  function openAddModal() {
    setEditingDept(null)
    setIsModalOpen(true)
  }

  function openEditModal(dept: Department) {
    setEditingDept(dept)
    setIsModalOpen(true)
  }

  if (isLoading) return <GridSkeleton />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jurusan"
        description={`${departments.length} jurusan terdaftar`}
        action={
          isAdmin ? (
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />Tambah Jurusan
            </Button>
          ) : undefined
        }
      />
      {departments.length === 0 ? (
        <EmptyState icon={<Building2 className="h-12 w-12 text-[#64748B]/40" />} text="Belum ada jurusan" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {departments.map((d) => (
            <DepartmentCard key={d.id} department={d} isAdmin={isAdmin}
              onEdit={() => openEditModal(d)}
              onDelete={() => deleteMutation.mutateAsync(d.id)} />
          ))}
        </div>
      )}
      
      {isAdmin && (
        <DepartmentFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          department={editingDept}
        />
      )}
    </div>
  )
}

function DepartmentCard({ department: d, isAdmin, onEdit, onDelete }: {
  department: Department; isAdmin: boolean; onEdit: () => void; onDelete: () => Promise<void>
}) {
  const thumb = withStorageUrl(d.thumbnail)
  return (
    <Card className="p-0 gap-0 overflow-hidden group border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
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
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />Edit
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
  const thumb = withStorageUrl(dept.thumbnail)
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader title={dept.name} />
      <div className="grid gap-6 md:grid-cols-3 items-start">
        <div className="md:col-span-1">
          <Card className="p-0 gap-0 overflow-hidden border-[#E2E8F0]">
            <div className="w-full aspect-video md:aspect-square bg-slate-50 flex items-center justify-center border-b border-[#E2E8F0]">
              {thumb ? (
                <img
                  src={thumb}
                  alt={dept.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 text-slate-300" />
              )}
            </div>
            <CardContent className="p-4 flex flex-col gap-4">
              {/* @ts-ignore */}
              {dept.faculty && (
                <div className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                   <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Fakultas</p>
                   {/* @ts-ignore */}
                   <p className="font-medium text-slate-800">{dept.faculty.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Tentang Jurusan</h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base">
                <p className="whitespace-pre-wrap">{dept.description || 'Belum ada deskripsi untuk jurusan ini.'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Tabs defaultValue="teachers" className="mt-4">
        <TabsList>
          <TabsTrigger value="teachers">Pengajar ({dept.teachers.length})</TabsTrigger>
          <TabsTrigger value="students">Mahasiswa ({dept.students.length})</TabsTrigger>
          <TabsTrigger value="subjects">Mata Pelajaran ({dept.subjects.length})</TabsTrigger>
          <TabsTrigger value="classrooms">Kelas ({dept.classrooms.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="teachers" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { handleApiError } from '@/lib/error-handler'

function DepartmentForm({ form, onSubmit, isPending, submitLabel, onCancel, initialPreview }: {
  form: any
  onSubmit: (v: DepartmentFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
  onCancel: () => void
  initialPreview?: string | null
}) {
  const { data: faculties = [] } = useFaculties()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(initialPreview || null)

  function clearThumbnail() {
    form.setValue('thumbnail', undefined)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Jurusan</FormLabel>
              <FormControl>
                <Input placeholder="Teknik Informatika" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facultyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fakultas</FormLabel>
              <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : undefined}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Pilih fakultas" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {faculties.map((f) => <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field: { value, onChange, ref, ...field } }) => (
            <FormItem>
              <FormLabel>Thumbnail (opsional)</FormLabel>
              <FormControl>
                <div>
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
                    form.setValue('thumbnail', f); setPreview(URL.createObjectURL(f))
                  }} {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        </div>
      </form>
    </Form>
  )
}

export function DepartmentFormModal({ isOpen, onClose, department }: {
  isOpen: boolean
  onClose: () => void
  department?: Department | null
}) {
  const isEditing = !!department
  const createMutation = useCreateDepartment()
  const updateMutation = useUpdateDepartment(department?.id ?? 0)
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    values: department ? { name: department.name, description: department.description, facultyId: department.facultyId } : undefined,
  })

  async function onSubmit(v: DepartmentFormValues) {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(v)
      } else {
        await createMutation.mutateAsync(v)
      }
      form.reset()
      onClose()
    } catch (error) {
      handleApiError(error, form.setError)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Jurusan' : 'Tambah Jurusan'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <DepartmentForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending} submitLabel={isEditing ? 'Simpan Perubahan' : 'Simpan'} onCancel={onClose}
            initialPreview={department?.thumbnail ? withStorageUrl(department.thumbnail) : null}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex flex-col items-center justify-center py-16 text-center gap-3">{icon}<p className="text-[#64748B]">{text}</p></div>
}
function GridSkeleton() {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-lg bg-[#E2E8F0]" />)}</div>
}