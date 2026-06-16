'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, CalendarDays, Trash2, Pencil, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { formatDay } from '@/lib/format-date'
import { sortByNearestDateAsc } from '@/utils/sort'
import { scheduleSchema, type ScheduleFormValues } from '@/features/schedules/schemas/schedule-schema'
import {
  useSchedules, useScheduleDetail, useCreateSchedule,
  useUpdateSchedule, useDeleteSchedule,
} from '@/features/schedules/hooks/use-schedules'
import { useClassrooms } from '@/features/classrooms/hooks/use-classrooms'
import type { Schedule } from '@/types/schedule'

export function SchedulesPage() {
  const { isTeacherOrAdmin } = useAuth()
  const { data: schedules = [], isLoading } = useSchedules()
  const deleteMutation = useDeleteSchedule()

  const sorted = sortByNearestDateAsc(schedules, (s) => s.date)

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal"
        description={`${schedules.length} jadwal`}
        action={isTeacherOrAdmin ? (
          <Button asChild size="sm"><Link href="/schedules/new"><Plus className="mr-2 h-4 w-4" />Tambah Jadwal</Link></Button>
        ) : undefined}
      />
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CalendarDays className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">Belum ada jadwal</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((s) => (
            <ScheduleCard key={s.id} schedule={s} isTeacherOrAdmin={isTeacherOrAdmin}
              onDelete={() => deleteMutation.mutateAsync(s.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function ScheduleCard({ schedule: s, isTeacherOrAdmin, onDelete }: {
  schedule: Schedule; isTeacherOrAdmin: boolean; onDelete: () => Promise<void>
}) {
  return (
    <Card>
      <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 text-center">
            <p className="text-xs text-muted-foreground leading-none">{formatDay(s.date).split(',')[0]}</p>
            <p className="text-lg font-bold leading-tight">{new Date(s.date).getDate()}</p>
          </div>
          <div>
            <p className="font-medium text-sm">{s.topic}</p>
            <p className="text-xs text-muted-foreground">{s.classroom?.name ?? `Kelas #${s.classroomId}`}</p>
          </div>
        </div>
        {isTeacherOrAdmin && (
          <div className="flex items-center gap-1 shrink-0">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href={`/schedules/${s.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
            </Button>
            <ConfirmDialog
              trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
              title="Hapus Jadwal" description={`Yakin menghapus jadwal "${s.topic}"?`}
              confirmLabel="Hapus" onConfirm={onDelete}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ScheduleForm({ defaultValues, onSubmit, isPending, submitLabel, onCancel }: {
  defaultValues?: Partial<ScheduleFormValues>; onSubmit: (v: ScheduleFormValues) => Promise<void>
  isPending: boolean; submitLabel: string; onCancel: () => void
}) {
  const { data: classrooms = [] } = useClassrooms()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema), defaultValues,
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Kelas</Label>
        <Select onValueChange={(v) => setValue('classroomId', Number(v))}>
          <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
          <SelectContent>{classrooms.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
        {errors.classroomId && <p className="text-xs text-destructive">{errors.classroomId.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Tanggal</Label>
        <Input type="date" {...register('date')} />
        {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Topik</Label>
        <Input placeholder="Pengenalan Algoritma" {...register('topic')} />
        {errors.topic && <p className="text-xs text-destructive">{errors.topic.message}</p>}
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

export function AddSchedulePage() {
  const router = useRouter()
  const mutation = useCreateSchedule()
  return (
    <div className="space-y-6 max-w-md">
      <PageHeader title="Tambah Jadwal" />
      <Card><CardContent className="pt-6">
        <ScheduleForm onSubmit={async (v) => { await mutation.mutateAsync(v); router.push('/schedules') }}
          isPending={mutation.isPending} submitLabel="Simpan" onCancel={() => router.back()} />
      </CardContent></Card>
    </div>
  )
}

export function EditSchedulePage({ id }: { id: string }) {
  const router = useRouter()
  const { data: schedule, isLoading } = useScheduleDetail(id)
  const mutation = useUpdateSchedule(id)
  if (isLoading) return <Skeleton className="h-80 max-w-md rounded-lg" />
  return (
    <div className="space-y-6 max-w-md">
      <PageHeader title="Edit Jadwal" />
      <Card><CardContent className="pt-6">
        <ScheduleForm
          defaultValues={schedule ? { classroomId: schedule.classroomId, date: schedule.date, topic: schedule.topic } : undefined}
          onSubmit={async (v) => { await mutation.mutateAsync(v); router.push('/schedules') }}
          isPending={mutation.isPending} submitLabel="Simpan Perubahan" onCancel={() => router.back()}
        />
      </CardContent></Card>
    </div>
  )
}
