import api from '@/lib/axios'
import type {
  ExamSubmission,
  ExamSubmissionResult,
  StudentExamSubmissionRecord,
  SubmitExamPayload,
  SubmitExamOptions,
} from '@/types/exam-submission'

interface RawExamSubmission {
  id: number
  score: number
  correct_count: number
  total_questions: number
  submitted_at: string
}

interface RawStudentExamRecord {
  student_id: number
  student_name: string
  student_nim: string | null
  student_email: string | null
  classroom_id: number | null
  classroom_name: string | null
  is_submitted: boolean
  submission: {
    id: number
    score: number
    correct_count: number
    total_questions: number
    submitted_at: string
    created_at: string
    updated_at: string
  } | null
}

function mapSubmission(raw: RawExamSubmission): ExamSubmission {
  return {
    id: raw.id,
    score: raw.score,
    correctCount: raw.correct_count,
    totalQuestions: raw.total_questions,
    submittedAt: raw.submitted_at,
  }
}

export async function getMyExamSubmissionService(
  examId: number | string,
): Promise<ExamSubmission | null> {
  const { data } = await api.get<RawExamSubmission | null>(`/exams/${examId}/my-submission`)
  return data ? mapSubmission(data) : null
}

export async function getExamSubmissionsService(
  examId: number | string,
): Promise<StudentExamSubmissionRecord[]> {
  const { data } = await api.get<RawStudentExamRecord[]>(`/exams/${examId}/submissions`)
  return data.map((s) => ({
    studentId: s.student_id,
    studentName: s.student_name,
    studentNim: s.student_nim,
    studentEmail: s.student_email,
    classroomId: s.classroom_id,
    classroomName: s.classroom_name,
    isSubmitted: s.is_submitted,
    submission: s.submission
      ? {
          id: s.submission.id,
          score: s.submission.score,
          correctCount: s.submission.correct_count,
          totalQuestions: s.submission.total_questions,
          submittedAt: s.submission.submitted_at,
          createdAt: s.submission.created_at,
          updatedAt: s.submission.updated_at,
        }
      : null,
  }))
}

export async function submitExamService(
  examId: number | string,
  payload: SubmitExamPayload,
  options?: SubmitExamOptions,
): Promise<ExamSubmissionResult> {
  if (options?.keepalive) {
    const body = JSON.stringify({ answers: payload.answers })
    const sent = navigator.sendBeacon(
      `${process.env.NEXT_PUBLIC_API_URL}/exams/${examId}/submit`,
      new Blob([body], { type: 'application/json' }),
    )
    if (!sent) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams/${examId}/submit`, {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    }
    return { score: 0, correctCount: 0, totalQuestions: 0 }
  }

  const { data } = await api.post<RawExamSubmission>(`/exams/${examId}/submit`, {
    answers: payload.answers,
  })

  return {
    score: data.score,
    correctCount: data.correct_count,
    totalQuestions: data.total_questions,
  }
}