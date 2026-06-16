'use client'

import { useState } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { downloadFile } from '@/lib/download-file'
import { formatDate } from '@/lib/format-date'
import type { AssignmentSubmissionFile } from '@/types/assignment-submission'

interface UserSubmissionCardProps {
  studentName: string
  classroomName?: string
  isSubmitted: boolean
  submission?: {
    id: number
    files: AssignmentSubmissionFile[]
    status: 'submitted' | 'late'
    submittedAt: string
    grade?: number | null
    feedback?: string | null
  } | null
  onGrade?: (submissionId: number, grade: number, feedback?: string) => Promise<void>
  isSaving?: boolean
}

export function UserSubmissionCard({
  studentName,
  classroomName,
  isSubmitted,
  submission,
  onGrade,
  isSaving,
}: UserSubmissionCardProps) {
  const [grade, setGrade] = useState(submission?.grade != null ? String(submission.grade) : '')
  const [feedback, setFeedback] = useState(submission?.feedback ?? '')

  async function handleGradeSubmit() {
    if (!submission || !onGrade || !grade) return
    await onGrade(submission.id, Number(grade), feedback || undefined)
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="text-sm">{studentName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{studentName}</p>
              {classroomName && (
                <p className="text-xs text-muted-foreground">{classroomName}</p>
              )}
            </div>
          </div>
          {isSubmitted ? (
            <Badge variant={submission?.status === 'late' ? 'destructive' : 'default'}>
              {submission?.status === 'late' ? 'Terlambat' : 'Tepat Waktu'}
            </Badge>
          ) : (
            <Badge variant="secondary">Belum Kumpul</Badge>
          )}
        </div>

        {/* Files */}
        {submission && submission.files.length > 0 && (
          <div className="space-y-1.5 border-t pt-2">
            {submission.files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate flex-1">{f.fileName}</span>
                <span className="text-xs text-muted-foreground shrink-0">{f.fileSize}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0"
                  onClick={() => downloadFile(f.filePath, f.fileName).catch(() => toast.error('Gagal mengunduh'))}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Dikumpulkan: {formatDate(submission.submittedAt)}
            </p>
          </div>
        )}

        {/* Grading */}
        {submission && onGrade && (
          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number" min={0} max={100} placeholder="Nilai (0-100)"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="flex h-8 w-28 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button size="sm" onClick={handleGradeSubmit}
                disabled={isSaving || !grade}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
              </Button>
              {submission.grade != null && (
                <span className="text-sm text-muted-foreground">Nilai: {submission.grade}</span>
              )}
            </div>
            <input
              type="text" placeholder="Feedback (opsional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
