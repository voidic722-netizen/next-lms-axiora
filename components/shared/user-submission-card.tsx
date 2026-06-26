'use client'

import { useState } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    <Card className="border border-[#E2E8F0] bg-white shadow-premium">
      <CardContent className="pt-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="text-sm bg-[#EEF1FF] text-[#4B5CF0] font-semibold">{studentName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-[#0F172A]">{studentName}</p>
              {classroomName && <p className="text-xs text-[#64748B]">{classroomName}</p>}
            </div>
          </div>
          {isSubmitted ? (
            <Badge className={`border-0 ${submission?.status === 'late' ? 'bg-[#EF4444] text-white' : 'bg-[#22C55E] text-white'}`}>
              {submission?.status === 'late' ? 'Terlambat' : 'Tepat Waktu'}
            </Badge>
          ) : (
            <Badge variant="secondary">Belum Kumpul</Badge>
          )}
        </div>

        {/* Files */}
        {submission && submission.files.length > 0 && (
          <div className="space-y-2 border-t border-[#E2E8F0]/60 pt-3">
            {submission.files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="inline-flex items-center justify-center size-7 rounded-md bg-[#F1F5F9] shrink-0">
                  <FileText className="h-3.5 w-3.5 text-[#64748B]" />
                </div>
                <span className="truncate flex-1 text-[#0F172A] font-medium">{f.fileName}</span>
                <span className="text-xs text-[#94A3B8] shrink-0">{f.fileSize}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 text-[#64748B] hover:text-[#4B5CF0]"
                  onClick={() => downloadFile(f.filePath, f.fileName).catch(() => toast.error('Gagal mengunduh'))}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <p className="text-xs text-[#94A3B8]">Dikumpulkan: {formatDate(submission.submittedAt)}</p>
          </div>
        )}

        {/* Grading */}
        {submission && onGrade && (
          <div className="border-t border-[#E2E8F0]/60 pt-3 space-y-2.5">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Nilai (0-100)"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-28 h-8 text-sm"
              />
              <Button size="sm" onClick={handleGradeSubmit} disabled={isSaving || !grade}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
              </Button>
              {submission.grade != null && (
                <span className="text-sm text-[#64748B]">Nilai: <strong className="text-[#0F172A]">{submission.grade}</strong></span>
              )}
            </div>
            <Input
              type="text"
              placeholder="Feedback (opsional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}