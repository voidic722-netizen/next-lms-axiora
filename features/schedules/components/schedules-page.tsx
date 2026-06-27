'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, CalendarDays, Trash2, Pencil, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDay } from '@/lib/format-date'
import { sortByNearestDateAsc } from '@/utils/sort'
import { scheduleSchema, type ScheduleFormValues } from '@/features/schedules/schemas/schedule-schema'
import {
  useSchedules, useCreateSchedule,
  useUpdateSchedule, useDeleteSchedule,
} from '@/features/schedules/hooks/use-schedules'
import { useClassrooms } from '@/features/classrooms/hooks/use-classrooms'
import type { Schedule } from '@/types/schedule'

export function SchedulesPage() {
  const { isTeacherOrAdmin } = useAuth()
  const { data: schedules = [], isLoading } = useSchedules()
  const deleteMutation = useDeleteSchedule()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)

  function openAddModal() {
    setEditingSchedule(null)
    setIsModalOpen(true)
  }

  function openEditModal(s: Schedule) {
    setEditingSchedule(s)
    setIsModalOpen(true)
  }

  const sorted = sortByNearestDateAsc(schedules, (s) => s.date)

  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg bg-[#E2E8F0]" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal"
        description={`${schedules.length} jadwal`}
        action={
          isTeacherOrAdmin ? (
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />Tambah Jadwal
            </Button>
          ) : undefined
        }
      />
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CalendarDays className="h-12 w-12 text-[#64748B]/40" />
          <p className="text-[#64748B]">Belum ada jadwal</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((s) => (
            <ScheduleCard
              key={s.id}
              schedule={s}
              isTeacherOrAdmin={isTeacherOrAdmin}
              onEdit={() => openEditModal(s)}
              onDelete={() => deleteMutation.mutateAsync(s.id)}
            />
          ))}
        </div>
      )}

      {isTeacherOrAdmin && (
        <ScheduleFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          schedule={editingSchedule}
        />
      )}
    </div>
  )
}

function ScheduleCard({
  schedule: s,
  isTeacherOrAdmin,
  onEdit,
  onDelete,
}: {
  schedule: Schedule
  isTeacherOrAdmin: boolean
  onEdit: () => void
  onDelete: () => Promise<void>
}) {
  return (
    <Card className="group relative overflow-hidden bg-white border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(75,92,240,0.08)] hover:-translate-y-[2px] hover:border-indigo-500/30 transition-all duration-300 rounded-2xl">

      <CardContent className="py-4 px-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100/50 flex flex-col items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:border-indigo-600 transition-colors duration-300">
            <p className="text-[10px] uppercase font-bold text-indigo-600 group-hover:text-indigo-100 tracking-wider mb-0.5">{formatDay(s.date).split(',')[0].substring(0, 3)}</p>
            <p className="text-lg font-bold text-slate-800 group-hover:text-white leading-none">{new Date(s.date).getDate()}</p>
          </div>
          <div>
            <p className="font-semibold text-base text-slate-800 group-hover:text-indigo-700 transition-colors">{s.topic}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              {s.classroom?.name ?? `Kelas #${s.classroomId}`}
            </p>
          </div>
        </div>
        {isTeacherOrAdmin && (
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <ConfirmDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10 transition-colors duration-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
              title="Hapus Jadwal"
              description={`Yakin menghapus jadwal "${s.topic}"?`}
              confirmLabel="Hapus"
              onConfirm={onDelete}
            />
          </div>
        )}
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

function ScheduleForm({
  form,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: {
  form: any
  onSubmit: (v: ScheduleFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
  onCancel: () => void
}) {
  const { data: classrooms = [] } = useClassrooms()
  const { control } = form
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="classroomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kelas</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(Number(v))}
                value={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classrooms.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topik</FormLabel>
              <FormControl>
                <Input placeholder="Pengenalan Algoritma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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

export function ScheduleFormModal({ isOpen, onClose, schedule }: {
  isOpen: boolean
  onClose: () => void
  schedule?: Schedule | null
}) {
  const isEditing = !!schedule
  const createMutation = useCreateSchedule()
  const updateMutation = useUpdateSchedule(String(schedule?.id ?? ''))
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    values: schedule
      ? { classroomId: schedule.classroomId, date: schedule.date?.split('T')[0] ?? '', topic: schedule.topic }
      : { classroomId: 0, date: '', topic: '' } as any,
  })

  async function onSubmit(v: ScheduleFormValues) {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ScheduleForm
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