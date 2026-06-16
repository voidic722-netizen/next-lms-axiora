'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, GraduationCap, Loader2, Trash2, PlusCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/shared/data-table'
import { formatDate, isFuture } from '@/lib/format-date'
import { examSchema, type ExamFormValues } from '../schemas/exam-schema'
import {
  useExams, useExamDetail, useCreateExam,
  useUpdateExam, useDeleteExam,
} from '../hooks/use-exams'
import { useExamSubmissions } from '@/features/exam-submissions/hooks/use-exam-submissions'
import { useMyExamSubmission } from '@/features/exam-submissions/hooks/use-exam-submissions'
import { useClassrooms } from '@/features/classrooms/hooks/use-classrooms'
import { useExamList } from '../hooks/use-exam-list'
import { USER_ROLE } from '@/types/roles'
import type { Exam } from '@/types/exam'
import type { StudentExamSubmissionRecord } from '@/types/exam-submission'

// ── List Page ────────────────────────────────────────────────────────────────
export function ExamsPage() {
  const { user, isTeacherOrAdmin } = useAuth()
  const { data: exams = [], isLoading } = useExams()
  const deleteMutation = useDeleteExam()
  const { handleExamClick, isStartDialogOpen, setIsStartDialogOpen, handleStartExam, isNotAvailableOpen, setIsNotAvailableOpen, notAvailableFrom } = useExamList()

  const visible = exams.filter((e) => {
    if (isTeacherOrAdmin) return true
    return user?.classroomId != null && e.classroomIds.map(Number).includes(user.classroomId)
  })

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}</div>

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ujian"
        description={`${visible.length} ujian`}
        action={isTeacherOrAdmin ? (
          <Button asChild size="sm"><Link href="/exams/new"><Plus className="mr-2 h-4 w-4" />Tambah Ujian</Link></Button>
        ) : undefined}
      />
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <GraduationCap className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">Belum ada ujian</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((e) => (
            <ExamCard key={e.id} exam={e} isTeacherOrAdmin={isTeacherOrAdmin}
              onExamClick={handleExamClick}
              onDelete={() => deleteMutation.mutateAsync(e.id)} />
          ))}
        </div>
      )}

      {/* Dialog konfirmasi mulai ujian */}
      {isStartDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold">Mulai Ujian?</h2>
            <p className="text-sm text-muted-foreground">
              Pastikan koneksi internet stabil. Ujian akan dimulai dalam mode layar penuh.
              Berpindah tab dihitung sebagai pelanggaran.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsStartDialogOpen(false)}>Batal</Button>
              <Button onClick={handleStartExam}>Mulai</Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog ujian belum tersedia */}
      {isNotAvailableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold">Ujian Belum Dibuka</h2>
            <p className="text-sm text-muted-foreground">
              Ujian ini baru bisa diakses mulai{' '}
              <span className="font-medium text-foreground">{formatDate(notAvailableFrom ?? '')}</span>.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setIsNotAvailableOpen(false)}>Mengerti</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExamCard({ exam: e, isTeacherOrAdmin, onExamClick, onDelete }: {
  exam: Exam
  isTeacherOrAdmin: boolean
  onExamClick: (ev: React.MouseEvent, id: number, isCompleted: boolean, availableFrom?: string) => void
  onDelete: () => Promise<void>
}) {
  const notYet = isFuture(e.availableDate)
  const expired = !isFuture(e.deadlineDate)
  return (
    <Card className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={(ev) => onExamClick(ev, e.id, false, e.availableDate)}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{e.title}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {e.examTypes.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
              <Badge variant={expired ? 'destructive' : notYet ? 'secondary' : 'default'} className="text-xs">
                {expired ? 'Berakhir' : notYet ? 'Belum Dimulai' : 'Aktif'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {formatDate(e.availableDate)} — {formatDate(e.deadlineDate)} · {e.durationMinutes} menit · {e.questions.length} soal
            </p>
          </div>
          {isTeacherOrAdmin && (
            <div className="flex gap-1 shrink-0" onClick={(ev) => ev.stopPropagation()}>
              <Button asChild variant="ghost" size="sm"><Link href={`/exams/${e.id}/edit`}>Edit</Link></Button>
              <ConfirmDialog
                trigger={<Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Hapus</Button>}
                title="Hapus Ujian" description={`Yakin menghapus "${e.title}"?`}
                confirmLabel="Hapus" onConfirm={onDelete}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Submitted Page ───────────────────────────────────────────────────────────
export function ExamSubmittedPage({ id }: { id: string }) {
  const { data: submission, isLoading } = useMyExamSubmission(id)
  const { data: exam } = useExamDetail(id)

  if (isLoading) return <Skeleton className="h-64 rounded-lg max-w-md mx-auto" />

  return (
    <div className="max-w-md mx-auto py-12 space-y-6 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
      <div>
        <h1 className="text-2xl font-bold">Ujian Selesai</h1>
        <p className="text-muted-foreground mt-1">{exam?.title}</p>
      </div>
      {submission && (
        <div className="grid grid-cols-3 gap-4">
          <ResultCard label="Nilai" value={String(submission.score)} highlight />
          <ResultCard label="Benar" value={`${submission.correctCount}/${submission.totalQuestions}`} />
          <ResultCard label="Status" value="Selesai" />
        </div>
      )}
      <Button asChild variant="outline"><Link href="/exams">Kembali ke Daftar Ujian</Link></Button>
    </div>
  )
}

function ResultCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${highlight ? 'text-primary' : ''}`}>{value}</p>
    </div>
  )
}

// ── Submissions Page ─────────────────────────────────────────────────────────
export function ExamSubmissionsPage({ id }: { id: string }) {
  const { data: exam } = useExamDetail(id)
  const { data: submissions = [], isLoading } = useExamSubmissions(id)

  const submitted = submissions.filter((s) => s.isSubmitted).length

  return (
    <div className="space-y-6">
      <PageHeader title={`Pengumpulan — ${exam?.title ?? '...'}`} description={`${submitted} / ${submissions.length} mahasiswa telah mengerjakan`} />
      <DataTable
        data={submissions as unknown as Record<string, unknown>[]}
        searchable searchPlaceholder="Cari mahasiswa..." searchKeys={['studentName']}
        columns={[
          { key: 'student', header: 'Mahasiswa', render: (row) => {
            const s = row as unknown as StudentExamSubmissionRecord
            return <div><p className="font-medium text-sm">{s.studentName}</p><p className="text-xs text-muted-foreground">{s.classroomName}</p></div>
          }},
          { key: 'status', header: 'Status', render: (row) => {
            const s = row as unknown as StudentExamSubmissionRecord
            return s.isSubmitted
              ? <Badge>Selesai</Badge>
              : <Badge variant="secondary">Belum</Badge>
          }},
          { key: 'score', header: 'Nilai', render: (row) => {
            const s = row as unknown as StudentExamSubmissionRecord
            if (!s.submission) return <span className="text-muted-foreground text-sm">-</span>
            return <span className="font-semibold">{s.submission.score}</span>
          }},
          { key: 'correct', header: 'Benar', render: (row) => {
            const s = row as unknown as StudentExamSubmissionRecord
            if (!s.submission) return <span className="text-muted-foreground text-sm">-</span>
            return <span className="text-sm">{s.submission.correctCount}/{s.submission.totalQuestions}</span>
          }},
        ]}
      />
    </div>
  )
}

// ── Add/Edit Form ────────────────────────────────────────────────────────────
function ExamForm({ defaultValues, onSubmit, isPending, submitLabel, onCancel }: {
  defaultValues?: Partial<ExamFormValues>; onSubmit: (v: ExamFormValues) => Promise<void>
  isPending: boolean; submitLabel: string; onCancel: () => void
}) {
  const { data: classrooms = [] } = useClassrooms()
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: { examTypes: [], classroomIds: [], questions: [], ...defaultValues },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })
  const selectedClassrooms = watch('classroomIds') ?? []

  function toggleClassroom(id: number) {
    const next = selectedClassrooms.includes(id)
      ? selectedClassrooms.filter((c) => c !== id)
      : [...selectedClassrooms, id]
    setValue('classroomIds', next, { shouldValidate: true })
  }

  function addQuestion() {
    append({
      id: `q-${Date.now()}`, text: '', type: 'multiple-choice', image: null,
      options: [
        { id: `o-${Date.now()}-1`, label: '', isCorrect: false },
        { id: `o-${Date.now()}-2`, label: '', isCorrect: false },
        { id: `o-${Date.now()}-3`, label: '', isCorrect: false },
        { id: `o-${Date.now()}-4`, label: '', isCorrect: false },
      ],
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Judul Ujian</Label>
          <Input placeholder="UTS Semester 1" {...register('title')} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Tanggal Mulai</Label>
          <Input type="datetime-local" {...register('availableDate')} />
          {errors.availableDate && <p className="text-xs text-destructive">{errors.availableDate.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Tenggat Waktu</Label>
          <Input type="datetime-local" {...register('deadlineDate')} />
          {errors.deadlineDate && <p className="text-xs text-destructive">{errors.deadlineDate.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Durasi (menit)</Label>
          <Input type="number" min={1} placeholder="90" {...register('durationMinutes', { valueAsNumber: true })} />
          {errors.durationMinutes && <p className="text-xs text-destructive">{errors.durationMinutes.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Kelas</Label>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border rounded-md p-2">
            {classrooms.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={selectedClassrooms.includes(c.id)} onCheckedChange={() => toggleClassroom(c.id)} />
                {c.name}
              </label>
            ))}
          </div>
          {errors.classroomIds && <p className="text-xs text-destructive">{errors.classroomIds.message}</p>}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Soal ({fields.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
            <PlusCircle className="mr-2 h-4 w-4" />Tambah Soal
          </Button>
        </div>
        {errors.questions && <p className="text-xs text-destructive">{errors.questions.message}</p>}
        {fields.map((field, qi) => (
          <Card key={field.id}>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Soal {qi + 1}</CardTitle>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(qi)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Teks pertanyaan..." {...register(`questions.${qi}.text`)} />
              {errors.questions?.[qi]?.text && <p className="text-xs text-destructive">{errors.questions[qi]?.text?.message}</p>}
              <div className="space-y-2">
                {(field.options ?? []).map((_, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <Checkbox {...register(`questions.${qi}.options.${oi}.isCorrect`)} />
                    <Input placeholder={`Pilihan ${oi + 1}`} {...register(`questions.${qi}.options.${oi}.label`)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
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

export function AddExamPage() {
  const router = useRouter()
  const mutation = useCreateExam()
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Tambah Ujian" />
      <Card><CardContent className="pt-6">
        <ExamForm
          onSubmit={async (v) => { await mutation.mutateAsync(v); router.push('/exams') }}
          isPending={mutation.isPending} submitLabel="Simpan" onCancel={() => router.back()}
        />
      </CardContent></Card>
    </div>
  )
}

export function EditExamPage({ id }: { id: string }) {
  const router = useRouter()
  const { data: exam, isLoading } = useExamDetail(id)
  const mutation = useUpdateExam(id)
  if (isLoading) return <Skeleton className="h-[600px] max-w-3xl rounded-lg" />
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Edit Ujian" />
      <Card><CardContent className="pt-6">
        <ExamForm
          defaultValues={exam ? {
            title: exam.title, description: exam.description ?? undefined,
            examTypes: exam.examTypes, classroomIds: exam.classroomIds,
            availableDate: exam.availableDate, deadlineDate: exam.deadlineDate,
            durationMinutes: exam.durationMinutes,
            questions: exam.questions.map((q) => ({ ...q, image: q.image })),
          } : undefined}
          onSubmit={async (v) => { await mutation.mutateAsync(v); router.push(`/exams/${id}`) }}
          isPending={mutation.isPending} submitLabel="Simpan Perubahan" onCancel={() => router.back()}
        />
      </CardContent></Card>
    </div>
  )
}
