'use client'

import Link from 'next/link'
import { Pencil, Trash2, Download, FileText, Upload, Loader2 } from 'lucide-react'
import { useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { formatDate, isPast } from '@/lib/format-date'
import { formatMaxFileSize, resolveMaxFileSizeBytes } from '@/utils/format'
import { downloadFile } from '@/lib/download-file'
import { ASSIGNMENT_TYPE_LABELS } from '@/features/assignments/constants/assignment-type-labels'
import { useAssignmentDetail, useDeleteAssignment } from '@/features/assignments/hooks/use-assignments'
import { useFileUpload } from '@/features/assignments/hooks/use-file-upload'
import {
  useMyAssignmentSubmission,
  useAssignmentSubmissions,
  useSubmitAssignment,
  useGradeSubmission,
} from '@/features/assignment-submissions/hooks/use-assignment-submissions'
import { useClassrooms } from '@/features/classrooms/hooks/use-classrooms'
import type { StudentSubmissionRecord } from '@/types/assignment-submission'

export function AssignmentDetailPage({ id }: { id: string }) {
  const { user, isTeacherOrAdmin } = useAuth()
  const { data: assignment, isLoading } = useAssignmentDetail(id)

  if (isLoading) return <AssignmentDetailSkeleton />
  if (!assignment) return <p className="text-[#64748B]">Tugas tidak ditemukan.</p>

  return (
    <div className="space-y-6">
      <AssignmentDetailHeader id={id} assignment={assignment} isTeacherOrAdmin={isTeacherOrAdmin} />

      {isTeacherOrAdmin ? (
        <TeacherSubmissionsPanel assignmentId={id} />
      ) : (
        <StudentSubmissionPanel assignmentId={id} maxFileSizeRaw={assignment.maxFileSize} />
      )}
    </div>
  )
}

function AssignmentDetailHeader({
  id,
  assignment,
  isTeacherOrAdmin,
}: {
  id: string
  assignment: NonNullable<ReturnType<typeof useAssignmentDetail>['data']>
  isTeacherOrAdmin: boolean
}) {
  const router = useRouter()
  const deleteMutation = useDeleteAssignment()
  const overdue = isPast(assignment.dueDate)

  return (
    <div className="space-y-4">
      <PageHeader
        title={assignment.title}
        action={
          isTeacherOrAdmin ? (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/assignments/${id}/edit`}>
                  <Pencil className="mr-1.5 h-4 w-4" /> Edit
                </Link>
              </Button>
              <ConfirmDialog
                trigger={
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-1.5 h-4 w-4" /> Hapus
                  </Button>
                }
                title="Hapus Tugas"
                description={`Yakin ingin menghapus "${assignment.title}"?`}
                confirmLabel="Hapus"
                onConfirm={async () => {
                  await deleteMutation.mutateAsync(assignment.id)
                  router.push('/assignments')
                }}
              />
            </div>
          ) : undefined
        }
      />

      <Card>
        <CardContent className="pt-4 space-y-3">
          <p className="text-sm text-[#0F172A]">{assignment.description}</p>
          <div className="flex flex-wrap gap-2">
            {assignment.types.map((t) => (
              <Badge key={t} variant="secondary">{ASSIGNMENT_TYPE_LABELS[t] ?? t}</Badge>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            <div>
              <span className="text-[#64748B]">Tenggat: </span>
              <span className={overdue ? 'text-[#EF4444] font-medium' : 'text-[#0F172A]'}>
                {formatDate(assignment.dueDate)}
              </span>
            </div>
            <div>
              <span className="text-[#64748B]">Maks ukuran file: </span>
              <span className="text-[#0F172A]">{formatMaxFileSize(assignment.maxFileSize)}</span>
            </div>
          </div>
          {assignment.modules.length > 0 && (
            <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
              <p className="text-sm font-medium text-[#0F172A]">Modul</p>
              {assignment.modules.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-[#64748B] shrink-0" />
                    <span className="truncate text-[#0F172A]">{m.name}</span>
                    <span className="text-[#64748B]">({m.fileSize})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => downloadFile(m.filePath, m.name).catch(() => toast.error('Gagal mengunduh'))}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StudentSubmissionPanel({
  assignmentId,
  maxFileSizeRaw,
}: {
  assignmentId: string
  maxFileSizeRaw: number
}) {
  const { data: submission } = useMyAssignmentSubmission(assignmentId)
  const submitMutation = useSubmitAssignment(assignmentId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { stagedFiles, sizeError, handleDrop, handleDragOver, handleDragLeave, handleInputChange, dragActive, removeFile } = useFileUpload({ maxFileSizeRaw })

  async function handleSubmit() {
    if (stagedFiles.length === 0) return
    await submitMutation.mutateAsync(stagedFiles.map((f) => f.file))
  }

  if (submission) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Pengumpulan Saya</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className={submission.status === 'late' ? 'bg-[#EF4444] text-white border-0' : 'bg-[#22C55E] text-white border-0'}>
              {submission.status === 'late' ? 'Terlambat' : 'Tepat Waktu'}
            </Badge>
            {submission.grade != null && (
              <Badge variant="secondary">Nilai: {submission.grade}</Badge>
            )}
          </div>
          {submission.files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-[#64748B]" />
              <span className="truncate text-[#0F172A]">{f.fileName}</span>
              <Button
                variant="ghost" size="icon" className="h-6 w-6 shrink-0 ml-auto"
                onClick={() => downloadFile(f.filePath, f.fileName).catch(() => toast.error('Gagal mengunduh'))}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {submission.feedback && (
            <div className="border-t border-[#E2E8F0] pt-3">
              <p className="text-sm text-[#64748B]">Feedback: {submission.feedback}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Kumpulkan Tugas</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-[#4B5CF0] bg-[#EEF1FF]' : 'border-[#E2E8F0] hover:border-[#4B5CF0]/50'
          }`}
        >
          <Upload className="h-8 w-8 mx-auto text-[#64748B] mb-2" />
          <p className="text-sm text-[#64748B]">
            Klik atau seret file ke sini · Maks {formatMaxFileSize(maxFileSizeRaw)}
          </p>
        </div>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleInputChange} />
        {sizeError && <p className="text-xs text-[#EF4444]">{sizeError}</p>}
        {stagedFiles.length > 0 && (
          <div className="space-y-2">
            {stagedFiles.map((sf) => (
              <div key={sf.id} className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-[#64748B] shrink-0" />
                <span className="truncate flex-1 text-[#0F172A]">{sf.file.name}</span>
                <button onClick={() => removeFile(sf.id)} className="text-[#64748B] hover:text-[#EF4444] text-xs">Hapus</button>
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={handleSubmit}
          disabled={stagedFiles.length === 0 || submitMutation.isPending}
          className="w-full"
        >
          {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Kumpulkan
        </Button>
      </CardContent>
    </Card>
  )
}

function TeacherSubmissionsPanel({ assignmentId }: { assignmentId: string }) {
  const { data: submissions = [], isLoading } = useAssignmentSubmissions(assignmentId)
  const { data: classrooms = [] } = useClassrooms()
  const gradeMutation = useGradeSubmission(assignmentId)
  const [classroomFilter, setClassroomFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [grades, setGrades] = useState<Record<number, string>>({})

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchClass = classroomFilter === 'all' || String(s.classroomId) === classroomFilter
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'submitted' && s.isSubmitted) ||
        (statusFilter === 'not_submitted' && !s.isSubmitted)
      return matchClass && matchStatus
    })
  }, [submissions, classroomFilter, statusFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select value={classroomFilter} onValueChange={setClassroomFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Semua kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {classrooms.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="submitted">Sudah Kumpul</SelectItem>
            <SelectItem value="not_submitted">Belum Kumpul</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-[#64748B]">
        {filtered.filter((s) => s.isSubmitted).length} / {filtered.length} sudah mengumpulkan
      </p>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded bg-[#E2E8F0]" />)
          : filtered.map((record) => (
              <SubmissionCard
                key={record.studentId}
                record={record}
                grade={grades[record.studentId] ?? ''}
                onGradeChange={(v) => setGrades((prev) => ({ ...prev, [record.studentId]: v }))}
                onGradeSubmit={async () => {
                  if (!record.submission) return
                  await gradeMutation.mutateAsync({
                    submissionId: record.submission.id,
                    payload: { grade: Number(grades[record.studentId]) },
                  })
                }}
                isSaving={gradeMutation.isPending}
              />
            ))}
      </div>
    </div>
  )
}

function SubmissionCard({
  record,
  grade,
  onGradeChange,
  onGradeSubmit,
  isSaving,
}: {
  record: StudentSubmissionRecord
  grade: string
  onGradeChange: (v: string) => void
  onGradeSubmit: () => Promise<void>
  isSaving: boolean
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-medium text-[#0F172A]">{record.studentName}</p>
            <p className="text-xs text-[#64748B]">{record.classroomName}</p>
          </div>
          {record.isSubmitted ? (
            <Badge className={record.submission?.status === 'late' ? 'bg-[#EF4444] text-white border-0' : 'bg-[#22C55E] text-white border-0'}>
              {record.submission?.status === 'late' ? 'Terlambat' : 'Tepat Waktu'}
            </Badge>
          ) : (
            <Badge variant="secondary">Belum Kumpul</Badge>
          )}
        </div>
        {record.submission && (
          <div className="mt-3 space-y-2">
            {record.submission.files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-[#64748B] shrink-0" />
                <span className="truncate flex-1 text-[#0F172A]">{f.fileName}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min={0}
                max={100}
                placeholder="Nilai (0-100)"
                value={grade}
                onChange={(e) => onGradeChange(e.target.value)}
                className="flex h-8 w-28 rounded-md border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#64748B] focus-visible:border-[#4B5CF0] focus-visible:ring-2 focus-visible:ring-[#4B5CF0]/20 outline-none transition-all duration-200"
              />
              <Button size="sm" onClick={onGradeSubmit} disabled={isSaving || !grade}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
              </Button>
              {record.submission.grade != null && (
                <span className="text-sm text-[#64748B]">Nilai saat ini: {record.submission.grade}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AssignmentDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64 bg-[#E2E8F0]" />
      <Skeleton className="h-40 rounded-lg bg-[#E2E8F0]" />
      <Skeleton className="h-64 rounded-lg bg-[#E2E8F0]" />
    </div>
  )
}