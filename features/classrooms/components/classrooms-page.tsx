'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/format-date'
import { classroomSchema, type ClassroomFormValues } from '../schemas/classroom-schema'
import {
  useClassrooms, useClassroomDetail, useCreateClassroom,
  useUpdateClassroom, useDeleteClassroom,
} from '../hooks/use-classrooms'
import { useDepartments } from '@/features/departments/hooks/use-departments'
import { useSemesters } from '@/features/semesters/hooks/use-semesters'
import { useSubjects } from '@/features/subjects/hooks/use-subjects'
import type { Classroom } from '@/types/classroom'

export function ClassroomsPage() {
  const { isAdmin } = useAuth()
  const { data: classrooms = [], isLoading } = useClassrooms()
  const deleteMutation = useDeleteClassroom()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null)

  function openAddModal() {
    setEditingClassroom(null)
    setIsModalOpen(true)
  }

  function openEditModal(c: Classroom) {
    setEditingClassroom(c)
    setIsModalOpen(true)
  }

  if (isLoading)
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded bg-[#E2E8F0]" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelas"
        description={`${classrooms.length} kelas`}
        action={
          isAdmin ? (
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />Tambah Kelas
            </Button>
          ) : undefined
        }
      />
      <DataTable
        data={classrooms as unknown as Record<string, unknown>[]}
        searchable
        searchPlaceholder="Cari kelas..."
        searchKeys={['name']}
        columns={[
          {
            key: 'name',
            header: 'Nama Kelas',
            render: (row) => {
              const c = row as unknown as Classroom
              return (
                <Link href={`/classrooms/${c.id}`} className="font-medium text-[#0F172A] hover:underline">
                  {c.name}
                </Link>
              )
            },
          },
          {
            key: 'subject',
            header: 'Mata Pelajaran',
            render: (row) => {
              const c = row as unknown as Classroom
              return <span className="text-sm text-[#64748B]">{c.subject?.name ?? '-'}</span>
            },
          },
          {
            key: 'semester',
            header: 'Semester',
            render: (row) => {
              const c = row as unknown as Classroom
              return c.semester ? (
                <Badge variant="secondary">{c.semester.name}</Badge>
              ) : (
                <span className="text-[#64748B]">-</span>
              )
            },
          },
          ...(isAdmin
            ? [
                {
                  key: 'actions',
                  header: '',
                  className: 'w-[100px]',
                  render: (row: Record<string, unknown>) => {
                    const c = row as unknown as Classroom
                    return (
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(c)}>
                          Edit
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deleteMutation.isPending}
                              className="text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10 transition-colors duration-200"
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Hapus'
                              )}
                            </Button>
                          }
                          title="Hapus Kelas"
                          description={`Yakin menghapus "${c.name}"?`}
                          confirmLabel="Hapus"
                          onConfirm={() => deleteMutation.mutateAsync(c.id).catch(() => {})}
                        />
                      </div>
                    )
                  },
                },
              ]
            : []),
        ]}
      />
      
      {isAdmin && (
        <ClassroomFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          classroom={editingClassroom}
        />
      )}
    </div>
  )
}

export function ClassroomDetailPage({ id }: { id: string }) {
  const { data: classroom, isLoading, isError } = useClassroomDetail(id)

  if (isLoading) return <Skeleton className="h-96 rounded-lg bg-[#E2E8F0]" />
  if (isError || !classroom) return <p className="text-[#EF4444]">Kelas tidak ditemukan atau terjadi kesalahan.</p>

  const students = classroom.students ?? []
  const assignments = classroom.assignments ?? []
  const exams = classroom.exams ?? []
  const schedules = classroom.schedules ?? []

  return (
    <div className="space-y-6">
      <PageHeader title={classroom.name} description={classroom.subject?.name} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Jurusan" value={classroom.department?.name ?? '-'} />
        <StatCard label="Semester" value={classroom.semester?.name ?? '-'} />
        <StatCard label="Mahasiswa" value={`${classroom.studentCount} orang`} />
      </div>
      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Mahasiswa ({students.length})</TabsTrigger>
          <TabsTrigger value="assignments">Tugas ({assignments.length})</TabsTrigger>
          <TabsTrigger value="exams">Ujian ({exams.length})</TabsTrigger>
          <TabsTrigger value="schedules">Jadwal ({schedules.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="students" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((s) => (
              <Card key={s.id} className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
                <CardContent className="pt-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-[#0F172A]">{s.name}</p>
                    <p className="text-xs text-[#64748B]">{s.nim ?? s.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="assignments" className="mt-4 space-y-2">
          {assignments.map((a) => (
            <Card key={a.id} className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <Link href={`/assignments/${a.id}`} className="font-medium text-sm text-[#0F172A] hover:underline">{a.title}</Link>
                <span className="text-xs text-[#64748B]">{formatDate(a.dueDate)}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="exams" className="mt-4 space-y-2">
          {exams.map((e) => (
            <Card key={e.id} className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <Link href={`/exams/${e.id}`} className="font-medium text-sm text-[#0F172A] hover:underline">{e.title}</Link>
                <span className="text-xs text-[#64748B]">{formatDate(e.deadlineDate)}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="schedules" className="mt-4 space-y-2">
          {schedules.map((s) => (
            <Card key={s.id} className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <p className="text-sm text-[#0F172A]">{s.topic}</p>
                <span className="text-xs text-[#64748B]">{formatDate(s.date)}</span>
              </CardContent>
            </Card>
          ))}
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

function ClassroomForm({
  form,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: {
  form: any
  onSubmit: (v: ClassroomFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
  onCancel: () => void
}) {
  const { data: departments = [] } = useDepartments()
  const { data: semesters = [] } = useSemesters()
  const { data: subjects = [] } = useSubjects()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kelas</FormLabel>
              <FormControl>
                <Input placeholder="Kelas A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {[
          { label: 'Jurusan', key: 'departmentId', items: departments.map((d) => ({ id: d.id, name: d.name })) },
          { label: 'Semester', key: 'semesterId', items: semesters.map((s) => ({ id: s.id, name: `${s.name} — ${s.academicYear}` })) },
          { label: 'Mata Pelajaran', key: 'subjectId', items: subjects.map((s) => ({ id: s.id, name: s.name })) },
        ].map(({ label, key, items }) => (
          <FormField
            key={key}
            control={form.control}
            name={key as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : undefined}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder={`Pilih ${label.toLowerCase()}`} /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {items.map((i) => (
                      <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function ClassroomFormModal({ isOpen, onClose, classroom }: {
  isOpen: boolean
  onClose: () => void
  classroom?: Classroom | null
}) {
  const isEditing = !!classroom
  const createMutation = useCreateClassroom()
  const updateMutation = useUpdateClassroom(String(classroom?.id ?? ''))
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    values: classroom
      ? {
          name: classroom.name,
          departmentId: classroom.departmentId,
          semesterId: classroom.semesterId,
          subjectId: classroom.subjectId,
        }
      : undefined,
  })

  async function onSubmit(v: ClassroomFormValues) {
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
          <DialogTitle>{isEditing ? 'Edit Kelas' : 'Tambah Kelas'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ClassroomForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            submitLabel={isEditing ? 'Simpan Perubahan' : 'Simpan'}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
      <CardContent className="pt-4">
        <p className="text-xs text-[#64748B]">{label}</p>
        <p className="font-semibold text-[#0F172A] mt-0.5">{value}</p>
      </CardContent>
    </Card>
  )
}