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
        <TabsContent value="students" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.map((s) => (
              <Card key={s.id} className="group border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-10 w-10 ring-2 ring-indigo-50 group-hover:ring-indigo-100 transition-all">
                    <AvatarFallback className="bg-indigo-50 text-indigo-700 font-semibold">{s.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-800 truncate group-hover:text-indigo-700 transition-colors">{s.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{s.nim ?? s.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="assignments" className="mt-6 space-y-3">
          {assignments.map((a) => (
            <Card key={a.id} className="group border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-300 rounded-xl">
              <CardContent className="py-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Link href={`/assignments/${a.id}`} className="font-semibold text-slate-700 hover:text-indigo-600 transition-colors block truncate">{a.title}</Link>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-slate-200 shrink-0 w-fit">{formatDate(a.dueDate)}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="exams" className="mt-6 space-y-3">
          {exams.map((e) => (
            <Card key={e.id} className="group border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-300 rounded-xl">
              <CardContent className="py-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Link href={`/exams/${e.id}`} className="font-semibold text-slate-700 hover:text-indigo-600 transition-colors block truncate">{e.title}</Link>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-slate-200 shrink-0 w-fit">{formatDate(e.deadlineDate)}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="schedules" className="mt-6 space-y-3">
          {schedules.map((s) => (
            <Card key={s.id} className="group border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-300 rounded-xl">
              <CardContent className="py-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{s.topic}</p>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-slate-200 shrink-0 w-fit">{formatDate(s.date)}</Badge>
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
    <Card className="group relative overflow-hidden bg-white border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(75,92,240,0.08)] hover:-translate-y-[2px] transition-all duration-300 rounded-2xl">

      <CardContent className="p-5">
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</p>
        <p className="font-bold text-2xl text-slate-800 mt-1">{value}</p>
      </CardContent>
    </Card>
  )
}