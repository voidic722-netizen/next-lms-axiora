'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, isPast } from '@/lib/format-date'
import { ASSIGNMENT_TYPE_LABELS, ASSIGNMENT_TYPE_OPTIONS } from '../constants/assignment-type-labels'
import { assignmentSchema, type AssignmentFormValues } from '../schemas/assignment-schema'
import {
  useAssignments, useCreateAssignment,
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)

  function openAddModal() {
    setEditingAssignment(null)
    setIsModalOpen(true)
  }

  function openEditModal(a: Assignment) {
    setEditingAssignment(a)
    setIsModalOpen(true)
  }

  const visible = assignments.filter((a) => {
    if (isTeacherOrAdmin) return true
    return user?.classroomId != null && a.classroomIds.includes(user.classroomId)
  })

  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg bg-[#E2E8F0]" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tugas"
        description={`${visible.length} tugas`}
        action={
          isTeacherOrAdmin ? (
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />Tambah Tugas
            </Button>
          ) : undefined
        }
      />
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <LayoutList className="h-12 w-12 text-[#64748B]/40" />
          <p className="text-[#64748B]">Belum ada tugas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              isTeacherOrAdmin={isTeacherOrAdmin}
              onEdit={() => openEditModal(a)}
              onDelete={() => deleteMutation.mutateAsync(a.id)}
            />
          ))}
        </div>
      )}

      {isTeacherOrAdmin && (
        <AssignmentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          assignment={editingAssignment}
        />
      )}
    </div>
  )
}

function AssignmentCard({
  assignment: a,
  isTeacherOrAdmin,
  onEdit,
  onDelete,
}: {
  assignment: Assignment
  isTeacherOrAdmin: boolean
  onEdit: () => void
  onDelete: () => Promise<void>
}) {
  const overdue = isPast(a.dueDate)
  return (
    <Card className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link
              href={`/assignments/${a.id}`}
              className="font-semibold text-[#0F172A] hover:underline truncate block"
            >
              {a.title}
            </Link>
            <p className="text-sm text-[#64748B] line-clamp-1 mt-0.5">{a.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {a.types.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {ASSIGNMENT_TYPE_LABELS[t] ?? t}
                </Badge>
              ))}
              <Badge
                variant={overdue ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {formatDate(a.dueDate)}
              </Badge>
            </div>
          </div>
          {isTeacherOrAdmin && (
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Edit
              </Button>
              <ConfirmDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10 transition-colors duration-200"
                  >
                    Hapus
                  </Button>
                }
                title="Hapus Tugas"
                description={`Yakin menghapus "${a.title}"?`}
                confirmLabel="Hapus"
                onConfirm={onDelete}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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

function AssignmentForm({
  form,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: {
  form: any
  onSubmit: (v: AssignmentFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
  onCancel: () => void
}) {
  const { data: subjects = [] } = useSubjects()
  const { data: classrooms = [] } = useClassrooms()
  const moduleInputRef = useRef<HTMLInputElement>(null)
  const [moduleFiles, setModuleFiles] = useState<File[]>([])

  const { control, watch } = form
  const selectedTypes = watch('types') ?? []
  const selectedClassrooms = watch('classroomIds') ?? []

  function toggleType(type: string) {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t: string) => t !== type)
      : [...selectedTypes, type]
    form.setValue('types', next, { shouldValidate: true })
  }

  function toggleClassroom(id: number) {
    const next = selectedClassrooms.includes(id)
      ? selectedClassrooms.filter((c: number) => c !== id)
      : [...selectedClassrooms, id]
    form.setValue('classroomIds', next, { shouldValidate: true })
  }

  function addModules(files: File[]) {
    const updated = [...moduleFiles, ...files]
    setModuleFiles(updated)
    form.setValue('modules', updated)
  }

  function removeModule(idx: number) {
    const updated = moduleFiles.filter((_, i) => i !== idx)
    setModuleFiles(updated)
    form.setValue('modules', updated)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Tugas</FormLabel>
              <FormControl>
                <Input placeholder="Laporan Praktikum 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
          control={control}
          name="types"
          render={() => (
            <FormItem>
              <FormLabel>Tipe Tugas</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {ASSIGNMENT_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleType(opt.value)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition-colors duration-200 ${
                        selectedTypes.includes(opt.value)
                          ? 'bg-[#4B5CF0] text-white border-[#4B5CF0]'
                          : 'border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mata Pelajaran</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata pelajaran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenggat Waktu</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={control}
          name="maxFileSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ukuran File Maks (MB)</FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="10" {...field} onChange={e => field.onChange(e.target.valueAsNumber || e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="classroomIds"
          render={() => (
            <FormItem>
              <FormLabel>Kelas</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-[#E2E8F0] rounded-md p-2">
                  {classrooms.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                      <Checkbox
                        checked={selectedClassrooms.includes(c.id)}
                        onCheckedChange={() => toggleClassroom(c.id)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-1.5">
          <Label>Modul / Lampiran (opsional)</Label>
          <div className="space-y-2">
            {moduleFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#0F172A]">
                <FileText className="h-4 w-4 text-[#64748B] shrink-0" />
                <span className="truncate flex-1">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeModule(i)}
                  className="text-[#64748B] hover:text-[#EF4444] transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => moduleInputRef.current?.click()}>
              Tambah Modul
            </Button>
          </div>
          <input
            ref={moduleInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addModules(Array.from(e.target.files ?? []))}
          />
        </div>
        
        <div className="flex gap-3 pt-2">
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

export function AssignmentFormModal({ isOpen, onClose, assignment }: {
  isOpen: boolean
  onClose: () => void
  assignment?: Assignment | null
}) {
  const isEditing = !!assignment
  const createMutation = useCreateAssignment()
  const updateMutation = useUpdateAssignment(String(assignment?.id ?? ''))
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    values: assignment
      ? {
          title: assignment.title,
          description: assignment.description,
          types: assignment.types,
          classroomIds: assignment.classroomIds,
          dueDate: assignment.dueDate?.slice(0, 16) ?? '',
          maxFileSize: assignment.maxFileSize,
          subjectId: assignment.subjectId,
        }
      : { types: [], classroomIds: [] } as any,
  })

  async function onSubmit(v: AssignmentFormValues) {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tugas' : 'Tambah Tugas'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <AssignmentForm
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