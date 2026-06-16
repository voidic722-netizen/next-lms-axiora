import api from '@/lib/axios'
import type {
  AssignmentSubmission,
  StudentSubmissionRecord,
  GradeSubmissionPayload,
} from '@/types/assignment-submission'

interface RawFile {
  file_name: string
  file_path: string
  format: string
  file_size: string
}

interface RawSubmission {
  id: number
  tugas_id: number
  user_id: number
  files: RawFile[]
  status: 'submitted' | 'late'
  submitted_at: string
  grade?: number | null
  feedback?: string | null
  created_at: string
  updated_at: string
}

interface RawStudentRecord {
  student_id: number
  student_name: string
  kelas_id: number
  kelas_name: string
  is_submitted: boolean
  submission: {
    id: number
    files: RawFile[]
    status: 'submitted' | 'late'
    submitted_at: string
    grade?: number | null
    feedback?: string | null
  } | null
}

function mapFile(raw: RawFile) {
  return {
    fileName: raw.file_name,
    filePath: raw.file_path,
    format: raw.format,
    fileSize: raw.file_size,
  }
}

function mapSubmission(raw: RawSubmission): AssignmentSubmission {
  return {
    id: raw.id,
    assignmentId: raw.tugas_id,
    userId: raw.user_id,
    files: raw.files.map(mapFile),
    status: raw.status,
    submittedAt: raw.submitted_at,
    grade: raw.grade ?? null,
    feedback: raw.feedback ?? null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export async function getMyAssignmentSubmissionService(
  assignmentId: number | string,
): Promise<AssignmentSubmission | null> {
  const { data } = await api.get<{ submission: RawSubmission | null }>(`/tugas/${assignmentId}/my-submission`)
  return data.submission ? mapSubmission(data.submission) : null
}

export async function getAssignmentSubmissionsService(
  assignmentId: number | string,
): Promise<StudentSubmissionRecord[]> {
  const { data } = await api.get<{ submissions: RawStudentRecord[] }>(`/tugas/${assignmentId}/submissions`)
  return data.submissions.map((s) => ({
    studentId: s.student_id,
    studentName: s.student_name,
    classroomId: s.kelas_id,
    classroomName: s.kelas_name,
    isSubmitted: s.is_submitted,
    submission: s.submission
      ? {
          id: s.submission.id,
          files: s.submission.files.map(mapFile),
          status: s.submission.status,
          submittedAt: s.submission.submitted_at,
          grade: s.submission.grade ?? null,
          feedback: s.submission.feedback ?? null,
        }
      : null,
  }))
}

export async function submitAssignmentService(
  assignmentId: number | string,
  files: File[],
): Promise<AssignmentSubmission> {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  const { data } = await api.post<{ submission: RawSubmission }>(`/tugas/${assignmentId}/submit`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapSubmission(data.submission)
}

export async function gradeSubmissionService(
  submissionId: number,
  payload: GradeSubmissionPayload,
): Promise<AssignmentSubmission> {
  const { data } = await api.post<{ submission: RawSubmission }>(
    `/tugas-pengumpulan/${submissionId}/grade`,
    { grade: payload.grade, feedback: payload.feedback ?? '' },
  )
  return mapSubmission(data.submission)
}
