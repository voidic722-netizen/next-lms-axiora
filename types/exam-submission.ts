export interface ExamSubmission {
  id: number
  score: number
  correctCount: number
  totalQuestions: number
  submittedAt: string
}

export interface ExamSubmissionResult {
  score: number
  correctCount: number
  totalQuestions: number
}

export interface StudentExamSubmissionRecord {
  studentId: number
  studentName: string
  studentNim: string | null
  studentEmail: string | null
  classroomId: number | null
  classroomName: string | null
  isSubmitted: boolean
  submission: {
    id: number
    score: number
    correctCount: number
    totalQuestions: number
    submittedAt: string
    createdAt: string
    updatedAt: string
  } | null
}

export interface SubmitExamPayload {
  answers: Record<string, string>
}

export interface SubmitExamOptions {
  keepalive?: boolean
}
