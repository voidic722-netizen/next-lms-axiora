import api from '@/lib/axios'
import type { Exam, ExamQuestion, CreateOrUpdateExamPayload } from '@/types/exam'

interface RawOption {
  id: string
  label: string
  is_correct?: boolean
}

interface RawQuestion {
  id: string
  text: string
  type: 'multiple-choice'
  image: string | null
  options: RawOption[]
}

interface RawExam {
  id: number
  title: string
  description: string | null
  exam_categories: string[]
  classroom_ids: number[]
  available_at: string
  deadline_at: string
  duration_minutes: number
  questions: RawQuestion[]
  created_at: string
  updated_at: string
}

function mapQuestion(raw: RawQuestion): ExamQuestion {
  return {
    id: raw.id,
    text: raw.text,
    type: raw.type,
    image: raw.image,
    options: raw.options.map((o) => ({
      id: o.id,
      label: o.label,
      isCorrect: o.is_correct,
    })),
  }
}

function mapExam(raw: RawExam): Exam {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    examTypes: raw.exam_categories,
    classroomIds: raw.classroom_ids,
    availableDate: raw.available_at,
    deadlineDate: raw.deadline_at,
    durationMinutes: raw.duration_minutes,
    questions: raw.questions.map(mapQuestion),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function buildExamFormData(payload: CreateOrUpdateExamPayload): FormData {
  const form = new FormData()
  form.append('title', payload.title)
  if (payload.description) form.append('description', payload.description)
  form.append('exam_categories', JSON.stringify(payload.examTypes))
  form.append('classroom_ids', JSON.stringify(payload.classroomIds))
  form.append('available_at', payload.availableDate)
  form.append('deadline_at', payload.deadlineDate)
  form.append('duration_minutes', String(payload.durationMinutes))

  payload.questions.forEach((q, i) => {
    form.append(`questions[${i}][id]`, q.id)
    form.append(`questions[${i}][text]`, q.text)
    form.append(`questions[${i}][type]`, q.type)
    if (q.image instanceof File) {
      form.append(`questions[${i}][image]`, q.image)
    } else if (q.image) {
      form.append(`questions[${i}][existing_image]`, q.image)
    }
    q.options.forEach((o, j) => {
      form.append(`questions[${i}][options][${j}][id]`, o.id)
      form.append(`questions[${i}][options][${j}][label]`, o.label)
      if (o.isCorrect != null) {
        form.append(`questions[${i}][options][${j}][is_correct]`, o.isCorrect ? '1' : '0')
      }
    })
  })

  return form
}

export async function getExamsService(): Promise<Exam[]> {
  const { data } = await api.get<RawExam[]>('/exams')
  return data.map(mapExam)
}

export async function getExamByIdService(id: number | string): Promise<Exam> {
  const { data } = await api.get<RawExam>(`/exams/${id}`)
  return mapExam(data)
}

export async function createExamService(payload: CreateOrUpdateExamPayload): Promise<Exam> {
  const { data } = await api.post<RawExam>('/exams', buildExamFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapExam(data)
}

export async function updateExamService(
  id: number | string,
  payload: CreateOrUpdateExamPayload,
): Promise<Exam> {
  const { data } = await api.put<RawExam>(`/exams/${id}`, buildExamFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapExam(data)
}

export async function deleteExamService(id: number | string): Promise<void> {
  await api.delete(`/exams/${id}`)
}