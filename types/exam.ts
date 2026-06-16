export interface ExamOption {
  id: string
  label: string
  isCorrect?: boolean
}

export interface ExamQuestion {
  id: string
  text: string
  type: 'multiple-choice'
  image: string | null
  options: ExamOption[]
}

export interface Exam {
  id: number
  title: string
  description: string | null
  examTypes: string[]
  classroomIds: number[]
  availableDate: string
  deadlineDate: string
  durationMinutes: number
  questions: ExamQuestion[]
  createdAt: string
  updatedAt: string
}

export interface ExamQuestion_CreateOrUpdate extends Omit<ExamQuestion, 'image'> {
  image: File | string | null
}

export interface CreateOrUpdateExamPayload {
  title: string
  description?: string
  examTypes: string[]
  classroomIds: number[]
  availableDate: string
  deadlineDate: string
  durationMinutes: number
  questions: ExamQuestion_CreateOrUpdate[]
}