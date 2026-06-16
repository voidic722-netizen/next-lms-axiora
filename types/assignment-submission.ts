export interface AssignmentSubmissionFile {
  fileName: string
  filePath: string
  format: string
  fileSize: string
}

export interface AssignmentSubmission {
  id: number
  assignmentId: number
  userId: number
  files: AssignmentSubmissionFile[]
  status: 'submitted' | 'late'
  submittedAt: string
  grade?: number | null
  feedback?: string | null
  createdAt: string
  updatedAt: string
}

export interface StudentSubmissionRecord {
  studentId: number
  studentName: string
  classroomId: number
  classroomName: string
  isSubmitted: boolean
  submission: {
    id: number
    files: AssignmentSubmissionFile[]
    status: 'submitted' | 'late'
    submittedAt: string
    grade?: number | null
    feedback?: string | null
  } | null
}

export interface GradeSubmissionPayload {
  grade: number
  feedback?: string
}
