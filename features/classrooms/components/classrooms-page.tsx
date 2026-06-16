'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, School, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
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

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded" />)}</div>

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelas"
        description={`${classrooms.length} kelas`}
        action={isAdmin ? (
          <Button asChild size="sm"><Link href="/classrooms/new"><Plus className="mr-2 h-4 w-4" />Tambah Kelas</Link></Button>
        ) : undefined}
      />
      <DataTable
        data={classrooms as unknown as Record<string, unknown>[]}
        searchable searchPlaceholder="Cari kelas..." searchKeys={['name']}
        columns={[
          { key: 'name', header: 'Nama Kelas', render: (row) => {
            const c = row as unknown as Classroom
            return <Link href={`/classrooms/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
          }},
          { key: 'subject', header: 'Mata Pelajaran', render: (row) => {
            const c = row as unknown as Classroom
            return <span className="text-sm text-muted-foreground">{c.subject?.name ?? '-'}</span>
          }},
          { key: 'semester', header: 'Semester', render: (row) => {
            const c = row as unknown as Classroom
            return c.semester ? <Badge variant="secondary">{c.semester.name}</Badge> : <span className="text-muted-foreground">-</span>
          }},
          ...(isAdmin ? [{
            key: 'actions', header: '', className: 'w-[100px]',
            render: (row: Record<string, unknown>) => {
              const c = row as unknown as Classroom
              return (
                <div className="flex gap-1 justify-end">
                  <Button asChild variant="ghost" size="sm"><Link href={`/classrooms/${c.id}/edit`}>Edit</Link></Button>
                  <ConfirmDialog
                    trigger={<Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Hapus</Button>}
                    title="Hapus Kelas" description={`Yakin menghapus "${c.name}"?`}
                    confirmLabel="Hapus" onConfirm={() => deleteMutation.mutateAsync(c.id)}
                  />
                </div>
              )
            }
          }] : []),
        ]}
      />
    </div>
  )
}

export function ClassroomDetailPage({ id }: { id: string }) {
  const { data: classroom, isLoading } = useClassroomDetail(id)
  if (isLoading) return <Skeleton className="h-96 rounded-lg" />
  if (!classroom) return <p className="text-muted-foreground">Kelas tidak ditemukan.</p>
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
          <TabsTrigger value="students">Mahasiswa ({classroom.students.length})</TabsTrigger>
          <TabsTrigger value="assignments">Tugas ({classroom.assignments.length})</TabsTrigger>
          <TabsTrigger value="exams">Ujian ({classroom.exams.length})</TabsTrigger>
          <TabsTrigger value="schedules">Jadwal ({classroom.schedules.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="students" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classroom.students.map((s) => (
              <Card key={s.id}><CardContent className="pt-4 flex items-center gap-3">
                <Avatar><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                <div><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.nim ?? s.email}</p></div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="assignments" className="mt-4 space-y-2">
          {classroom.assignments.map((a) => (
            <Card key={a.id}><CardContent className="py-3 px-4 flex items-center justify-between">
              <Link href={`/assignments/${a.id}`} className="font-medium text-sm hover:underline">{a.title}</Link>
              <span className="text-xs text-muted-foreground">{formatDate(a.dueDate)}</span>
            </CardContent></Card>
          ))}
        </TabsContent>
        <TabsContent value="exams" className="mt-4 space-y-2">
          {classroom.exams.map((e) => (
            <Card key={e.id}><CardContent className="py-3 px-4 flex items-center justify-between">
              <Link href={`/exams/${e.id}`} className="font-medium text-sm hover:underline">{e.title}</Link>
              <span className="text-xs text-muted-foreground">{formatDate(e.deadlineDate)}</span>
            </CardContent></Card>
          ))}
        </TabsContent>
        <TabsContent value="schedules" className="mt-4 space-y-2">
          {classroom.schedules.map((s) => (
            <Card key={s.id}><CardContent className="py-3 px-4 flex items-center justify-between">
              <p className="text-sm">{s.topic}</p>
              <span className="text-xs text-muted-foreground">{formatDate(s.date)}</span>
            </CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ClassroomForm({ defaultValues, onSubmit, isPending, submitLabel, onCancel }: {
  defaultValues?: Partial<ClassroomFormValues>; onSubmit: (v: ClassroomFormValues) => Promise<void>
  isPending: boolean; submitLabel: string; onCancel: () => void
}) {
  const { data: departments = [] } = useDepartments()
  const { data: semesters = [] } = useSemesters()
  const { data: subjects = [] } = useSubjects()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema), defaultValues,
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nama Kelas</Label>
        <Input placeholder="Kelas A" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      {[
        { label: 'Jurusan', key: 'departmentId', items: departments.map((d) => ({ id: d.id, name: d.name })), error: errors.departmentId },
        { label: 'Semester', key: 'semesterId', items: semesters.map((s) => ({ id: s.id, name: `${s.name} — ${s.academicYear}` })), error: errors.semesterId },
        { label: 'Mata Pelajaran', key: 'subjectId', items: subjects.map((s) => ({ id: s.id, name: s.name })), error: errors.subjectId },
      ].map(({ label, key, items, error }) => (
        <div key={key} className="space-y-1.5">
          <Label>{label}</Label>
          <Select onValueChange={(v) => setValue(key as keyof ClassroomFormValues, Number(v) as never)}>
            <SelectTrigger><SelectValue placeholder={`Pilih ${label.toLowerCase()}`} /></SelectTrigger>
            <SelectContent>{items.map((i) => <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>)}</SelectContent>
          </Select>
          {error && <p className="text-xs text-destructive">{error.message}</p>}
        </div>
      ))}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  )
}

export function AddClassroomPage() {
  const router = useRouter()
  const mutation = useCreateClassroom()
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Tambah Kelas" />
      <Card><CardContent className="pt-6">
        <ClassroomForm onSubmit={async (v) => { await mutation.mutateAsync(v); router.push('/classrooms') }}
          isPending={mutation.isPending} submitLabel="Simpan" onCancel={() => router.back()} />
      </CardContent></Card>
    </div>
  )
}

export function EditClassroomPage({ id }: { id: string }) {
  const router = useRouter()
  const { data: classroom, isLoading } = useClassroomDetail(id)
  const mutation = useUpdateClassroom(id)
  if (isLoading) return <Skeleton className="h-96 max-w-xl rounded-lg" />
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Edit Kelas" />
      <Card><CardContent className="pt-6">
        <ClassroomForm
          defaultValues={classroom ? { name: classroom.name, departmentId: classroom.departmentId, semesterId: classroom.semesterId, subjectId: classroom.subjectId } : undefined}
          onSubmit={async (v) => { await mutation.mutateAsync(v); router.push(`/classrooms/${id}`) }}
          isPending={mutation.isPending} submitLabel="Simpan Perubahan" onCancel={() => router.back()}
        />
      </CardContent></Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card><CardContent className="pt-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold mt-0.5">{value}</p>
    </CardContent></Card>
  )
}
