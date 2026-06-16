'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, LayoutList, Loader2, FileText, X } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { formatDate, isPast } from '@/lib/format-date'
import { ASSIGNMENT_TYPE_LABELS, ASSIGNMENT_TYPE_OPTIONS } from '../constants/assignment-type-labels'
import { assignmentSchema, type AssignmentFormValues } from '../schemas/assignment-schema'
import {
  useAssignments, useAssignmentDetail, useCreateAssignment,
  useUpdateAssignment, useDeleteAssignment,
} from '../hooks/use-assignments'
import { useSubjects } from '@/features/subjects/hooks/use-subjects'
import { useClassrooms } from '@/features/classrooms/hooks/use-classrooms'
import type { Assignment } from '@/types/assignment'

// ── List Page ────────────────────────────────────────────────────────────────
export function AssignmentsPage() {
  const { isTeacherOrAdmin, user } = useAuth()
  const { data: assignments = [], isLoading } = useAssignments()
  const deleteMutation = useDeleteAssignment()

  const visible = assignments.filter((a) => {
    if (isTeacherOrAdmin) return true
    return user?.classroomId != null && a.classroomIds.includes(user.classroomId)
  })

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tugas"
        description={`${visible.length} tugas`}
        action={isTeacherOrAdmin ? (
          <Button asChild size="sm"><Link href="/assignments/new"><Plus className="mr-2 h-4 w-4" />Tambah Tugas</Link></Button>
        ) : undefined}
      />
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <LayoutList className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">Belum ada tugas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((a) => (
            <AssignmentCard key={a.id} assignment={a} isTeacherOrAdmin={isTeacherOrAdmin}
              onDelete={() => deleteMutation.mutateAsync(a.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function AssignmentCard({ assignment: a, isTeacherOrAdmin, onDelete }: {
  assignment: Assignment; isTeacherOrAdmin: boolean; onDelete: () => Promise<void>
}) {
  const overdue = isPast(a.dueDate)
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link href={`/assignments/${a.id}`} className="font-semibold hover:underline truncate block">{a.title}</Link>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{a.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {a.types.map((t) => <Badge key={t} variant="outline" className="text-xs">{ASSIGNMENT_TYPE_LABELS[t] ?? t}</Badge>)}
              <Badge variant={overdue ? 'destructive' : 'secondary'} className="text-xs">{formatDate(a.dueDate)}</Badge>
            </div>
          </div>
          {isTeacherOrAdmin && (
            <div className="flex gap-1 shrink-0">
              <Button asChild variant="ghost" size="sm"><Link href={`/assignments/${a.id}/edit`}>Edit</Link></Button>
              <ConfirmDialog
                trigger={<Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Hapus</Button>}
                title="Hapus Tugas" description={`Yakin menghapus "${a.title}"?`}
                confirmLabel="Hapus" onConfirm={onDelete}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Shared Form ──────────────────────────────────────────────────────────────
function AssignmentForm({ defaultValues, onSubmit, isPending, submitLabel, onCancel }: {
  defaultValues?: Partial<AssignmentFormValues>; onSubmit: (v: AssignmentFormValues) => Promise<void>
  isPending: boolean; submitLabel: string; onCancel: () => void
}) {
  const { data: subjects = [] } = useSubjects()
  const { data: classrooms = [] } = useClassrooms()
  const moduleInputRef = useRef<HTMLInputElement>(null)
  const [moduleFiles, setModuleFiles] = useState<File[]>([])

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { types: [], classroomIds: [], ...defaultValues },
  })

  const selectedTypes = watch('types') ?? []
  const selectedClassrooms = watch('classroomIds') ?? []

  function toggleType(type: string) {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]
    setValue('types', next, { shouldValidate: true })
  }

  function toggleClassroom(id: number) {
    const next = selectedClassrooms.includes(id)
      ? selectedClassrooms.filter((c) => c !== id)
      : [...selectedClassrooms, id]
    setValue('classroomIds', next, { shouldValidate: true })
  }

  function addModules(files: File[]) {
    const updated = [...moduleFiles, ...files]
    setModuleFiles(updated)
    setValue('modules', updated)
  }

  function removeModule(idx: number) {
    const updated = moduleFiles.filter((_, i) => i !== idx)
    setModuleFiles(updated)
    setValue('modules', updated)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Judul Tugas</Label>
        <Input placeholder="Laporan Praktikum 1" {...register('title')} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Deskripsi</Label>
        <Textarea rows={3} {...register('description')} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Tipe Tugas</Label>
        <div className="flex flex-wrap gap-2">
          {ASSIGNMENT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value} type="button"
              onClick={() => toggleType(opt.value)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${selectedTypes.includes(opt.value) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
            >{opt.label}</button>
          ))}
        </div>
        {errors.types && <p className="text-xs text-destructive">{errors.types.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Mata Pelajaran</Label>
          <Select onValueChange={(v) => setValue('subjectId', Number(v))}>
            <SelectTrigger><SelectValue placeholder="Pilih mata pelajaran" /></SelectTrigger>
            <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
          {errors.subjectId && <p className="text-xs text-destructive">{errors.subjectId.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Tenggat Waktu</Label>
          <Input type="datetime-local" {...register('dueDate')} />
          {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Ukuran File Maks (MB)</Label>
        <Input type="number" min={1} placeholder="10" {...register('maxFileSize', { valueAsNumber: true })} />
        {errors.maxFileSize && <p className="text-xs text-destructive">{errors.maxFileSize.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Kelas</Label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
          {classrooms.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedClassrooms.includes(c.id)} onCheckedChange={() => toggleClassroom(c.id)} />
              {c.name}
            </label>
          ))}
        </div>
        {errors.classroomIds && <p className="text-xs text-destructive">{errors.classroomIds.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Modul / Lampiran (opsional)</Label>
        <div className="space-y-2">
          {moduleFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate flex-1">{f.name}</span>
              <button type="button" onClick={() => removeModule(i)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => moduleInputRef.current?.click()}>
            Tambah Modul
          </Button>
        </div>
        <input ref={moduleInputRef} type="file" multiple className="hidden"
          onChange={(e) => addModules(Array.from(e.target.files ?? []))} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  )
}

export function AddAssignmentPage() {
  const router = useRouter()
  const mutation = useCreateAssignment()
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Tambah Tugas" />
      <Card><CardContent className="pt-6">
        <AssignmentForm
          onSubmit={async (v) => { await mutation.mutateAsync(v); router.push('/assignments') }}
          isPending={mutation.isPending} submitLabel="Simpan" onCancel={() => router.back()}
        />
      </CardContent></Card>
    </div>
  )
}

export function EditAssignmentPage({ id }: { id: string }) {
  const router = useRouter()
  const { data: assignment, isLoading } = useAssignmentDetail(id)
  const mutation = useUpdateAssignment(id)
  if (isLoading) return <Skeleton className="h-[600px] max-w-2xl rounded-lg" />
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Edit Tugas" />
      <Card><CardContent className="pt-6">
        <AssignmentForm
          defaultValues={assignment ? { title: assignment.title, description: assignment.description, types: assignment.types, classroomIds: assignment.classroomIds, dueDate: assignment.dueDate, maxFileSize: assignment.maxFileSize, subjectId: assignment.subjectId } : undefined}
          onSubmit={async (v) => { await mutation.mutateAsync(v); router.push(`/assignments/${id}`) }}
          isPending={mutation.isPending} submitLabel="Simpan Perubahan" onCancel={() => router.back()}
        />
      </CardContent></Card>
    </div>
  )
}
