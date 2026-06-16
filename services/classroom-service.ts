import api from '@/lib/axios'
import type {
  Classroom,
  ClassroomDetail,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from '@/types/classroom'

interface RawClassroom {
  id: number
  name: string
  department_id: number
  semester_id: number
  subject_id: number
  created_at: string
  updated_at: string
  department?: { id: number; name: string; faculty_id?: number; faculty?: { id: number; name: string } }
  semester?: { id: number; name: string; academic_year?: string }
  subject?: { id: number; name: string }
}

interface RawClassroomDetail extends RawClassroom {
  teacher: { id: number; name: string; email: string; position?: string | null; nidn?: string | null } | null
  lecturers: Array<{ id: number; name: string; email: string; position?: string | null; nidn?: string | null }>
  students: Array<{ id: number; name: string; email: string; nim?: string | null }>
  student_count: number
  assignments: Array<{ id: number; title: string; description: string; task_types: string[]; classroom_ids: number[]; due_date: string; max_file_size: number; subject_id: number; created_at: string }>
  exams: Array<{ id: number; title: string; description?: string | null; exam_categories: string[]; classroom_ids: number[]; available_at: string; deadline_at: string; duration_minutes: number; questions: unknown[]; created_at: string }>
  schedules: Array<{ id: number; date: string; topic: string }>
}

function mapClassroom(raw: RawClassroom): Classroom {
  return {
    id: raw.id,
    name: raw.name,
    departmentId: raw.department_id,
    semesterId: raw.semester_id,
    subjectId: raw.subject_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    department: raw.department
      ? { id: raw.department.id, name: raw.department.name, facultyId: raw.department.faculty_id, faculty: raw.department.faculty }
      : undefined,
    semester: raw.semester
      ? { id: raw.semester.id, name: raw.semester.name, academicYear: raw.semester.academic_year }
      : undefined,
    subject: raw.subject,
  }
}

function mapClassroomDetail(raw: RawClassroomDetail): ClassroomDetail {
  return {
    ...mapClassroom(raw),
    teacher: raw.teacher,
    teachers: raw.lecturers,
    students: raw.students,
    studentCount: raw.student_count,
    assignments: raw.assignments.map((t) => ({
      id: t.id, title: t.title, description: t.description,
      types: t.task_types, classroomIds: t.classroom_ids,
      dueDate: t.due_date, maxFileSize: t.max_file_size,
      subjectId: t.subject_id, createdAt: t.created_at,
    })),
    exams: raw.exams.map((e) => ({
      id: e.id, title: e.title, description: e.description ?? null,
      examTypes: e.exam_categories, classroomIds: e.classroom_ids,
      availableDate: e.available_at, deadlineDate: e.deadline_at,
      durationMinutes: e.duration_minutes, questionCount: e.questions.length,
      createdAt: e.created_at,
    })),
    schedules: raw.schedules,
  }
}

export async function getClassroomsService(): Promise<Classroom[]> {
  const { data } = await api.get<RawClassroom[]>('/classrooms')
  return data.map(mapClassroom)
}

export async function getClassroomByIdService(id: number | string): Promise<ClassroomDetail> {
  const { data } = await api.get<RawClassroomDetail>(`/classrooms/${id}`)
  return mapClassroomDetail(data)
}

export async function createClassroomService(payload: CreateClassroomPayload): Promise<Classroom> {
  const { data } = await api.post<RawClassroom>('/classrooms', {
    name: payload.name,
    department_id: payload.departmentId,
    semester_id: payload.semesterId,
    subject_id: payload.subjectId,
  })
  return mapClassroom(data)
}

export async function updateClassroomService(id: number | string, payload: UpdateClassroomPayload): Promise<Classroom> {
  const { data } = await api.put<RawClassroom>(`/classrooms/${id}`, {
    name: payload.name,
    department_id: payload.departmentId,
    semester_id: payload.semesterId,
    subject_id: payload.subjectId,
  })
  return mapClassroom(data)
}

export async function deleteClassroomService(id: number | string): Promise<void> {
  await api.delete(`/classrooms/${id}`)
}