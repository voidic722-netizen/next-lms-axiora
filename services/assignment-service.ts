import api from '@/lib/axios'
import type { Assignment, CreateAssignmentPayload, UpdateAssignmentPayload } from '@/types/assignment'

interface RawModule {
  id: number
  assignment_id: number
  name: string
  file_path: string
  cloudinary_public_id: string | null
  format: string
  file_size: string
  updated_at: string
}

interface RawAssignment {
  id: number
  title: string
  description: string
  task_types: string[]
  classroom_ids: number[]
  due_date: string
  max_file_size: number
  subject_id: number
  subject?: { id: number; name: string }
  modules: RawModule[]
  created_at: string
  updated_at: string
}

function mapAssignment(raw: RawAssignment): Assignment {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    types: raw.task_types,
    classroomIds: raw.classroom_ids,
    dueDate: raw.due_date,
    maxFileSize: raw.max_file_size,
    subjectId: raw.subject_id,
    subject: raw.subject,
    modules: raw.modules.map((m) => ({
      id: m.id,
      assignmentId: m.assignment_id,
      name: m.name,
      filePath: m.file_path,
      cloudinaryPublicId: m.cloudinary_public_id,
      format: m.format,
      fileSize: m.file_size,
      updatedAt: m.updated_at,
    })),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export async function getAssignmentsService(): Promise<Assignment[]> {
  const { data } = await api.get<RawAssignment[]>('/assignments')
  return data.map(mapAssignment)
}

export async function getAssignmentByIdService(id: number | string): Promise<Assignment> {
  const { data } = await api.get<RawAssignment>(`/assignments/${id}`)
  return mapAssignment(data)
}

function buildAssignmentFormData(payload: CreateAssignmentPayload | UpdateAssignmentPayload): FormData {
  const form = new FormData()
  form.append('title', payload.title)
  form.append('description', payload.description)
  form.append('task_types', JSON.stringify(payload.types))
  form.append('classroom_ids', JSON.stringify(payload.classroomIds))
  form.append('due_date', payload.dueDate)
  form.append('max_file_size', String(payload.maxFileSize))
  form.append('subject_id', String(payload.subjectId))
  payload.modules?.forEach((file) => form.append('modules[]', file))
  return form
}

export async function createAssignmentService(payload: CreateAssignmentPayload): Promise<Assignment> {
  const { data } = await api.post<RawAssignment>('/assignments', buildAssignmentFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapAssignment(data)
}

export async function updateAssignmentService(id: number | string, payload: UpdateAssignmentPayload): Promise<Assignment> {
  const { data } = await api.put<RawAssignment>(`/assignments/${id}`, buildAssignmentFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapAssignment(data)
}

export async function deleteAssignmentService(id: number): Promise<void> {
  await api.delete(`/assignments/${id}`)
}

export async function deleteAssignmentModuleService(id: number): Promise<void> {
  await api.delete(`/assignment-modules/${id}`)
}