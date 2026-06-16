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
  jurusan_id: number
  semester_id: number
  mata_pelajaran_id: number
  created_at: string
  jurusan?: { id: number; name: string; fakultas_id?: number; fakultas?: { id: number; name: string } }
  semester?: { id: number; name: string; academic_year?: string }
  mata_pelajaran?: { id: number; name: string }
}

interface RawClassroomDetail extends RawClassroom {
  teacher: { id: number; name: string; email: string; position?: string | null; nidn?: string | null } | null
  teachers: Array<{ id: number; name: string; email: string; position?: string | null; nidn?: string | null }>
  students: Array<{ id: number; name: string; email: string; nim?: string | null }>
  student_count: number
  tasks: Array<{ id: number; title: string; description: string; task_types: string[]; kelas_ids: number[]; due_date: string; max_file_size: number; mata_pelajaran_id: number; created_at: string }>
  exams: Array<{ id: number; title: string; description?: string | null; kategori_ujian: string[]; kelas_ids: number[]; available_date: string; deadline_date: string; duration_minutes: number; questions: unknown[]; created_at: string }>
  schedules: Array<{ id: number; date: string; topic: string }>
}

function mapClassroom(raw: RawClassroom): Classroom {
  return {
    id: raw.id,
    name: raw.name,
    departmentId: raw.jurusan_id,
    semesterId: raw.semester_id,
    subjectId: raw.mata_pelajaran_id,
    createdAt: raw.created_at,
    department: raw.jurusan
      ? { id: raw.jurusan.id, name: raw.jurusan.name, facultyId: raw.jurusan.fakultas_id, faculty: raw.jurusan.fakultas }
      : undefined,
    semester: raw.semester
      ? { id: raw.semester.id, name: raw.semester.name, academicYear: raw.semester.academic_year }
      : undefined,
    subject: raw.mata_pelajaran,
  }
}

function mapClassroomDetail(raw: RawClassroomDetail): ClassroomDetail {
  return {
    ...mapClassroom(raw),
    teacher: raw.teacher,
    teachers: raw.teachers,
    students: raw.students,
    studentCount: raw.student_count,
    assignments: raw.tasks.map((t) => ({
      id: t.id, title: t.title, description: t.description,
      types: t.task_types, classroomIds: t.kelas_ids,
      dueDate: t.due_date, maxFileSize: t.max_file_size,
      subjectId: t.mata_pelajaran_id, createdAt: t.created_at,
    })),
    exams: raw.exams.map((e) => ({
      id: e.id, title: e.title, description: e.description ?? null,
      examTypes: e.kategori_ujian, classroomIds: e.kelas_ids,
      availableDate: e.available_date, deadlineDate: e.deadline_date,
      durationMinutes: e.duration_minutes, questionCount: e.questions.length,
      createdAt: e.created_at,
    })),
    schedules: raw.schedules,
  }
}

export async function getClassroomsService(): Promise<Classroom[]> {
  const { data } = await api.get<{ kelas: RawClassroom[] }>('/kelas')
  return data.kelas.map(mapClassroom)
}

export async function getClassroomByIdService(id: number | string): Promise<ClassroomDetail> {
  const { data } = await api.get<{ kelas: RawClassroomDetail }>(`/kelas/${id}`)
  return mapClassroomDetail(data.kelas)
}

export async function createClassroomService(payload: CreateClassroomPayload): Promise<Classroom> {
  const { data } = await api.post<{ kelas: RawClassroom }>('/kelas', {
    name: payload.name,
    jurusan_id: payload.departmentId,
    semester_id: payload.semesterId,
    mata_pelajaran_id: payload.subjectId,
  })
  return mapClassroom(data.kelas)
}

export async function updateClassroomService(id: number | string, payload: UpdateClassroomPayload): Promise<Classroom> {
  const { data } = await api.put<{ kelas: RawClassroom }>(`/kelas/${id}`, {
    name: payload.name,
    jurusan_id: payload.departmentId,
    semester_id: payload.semesterId,
    mata_pelajaran_id: payload.subjectId,
  })
  return mapClassroom(data.kelas)
}

export async function deleteClassroomService(id: number | string): Promise<void> {
  await api.delete(`/kelas/${id}`)
}
