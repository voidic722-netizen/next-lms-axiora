import type { UserRole } from './roles'

export type TeacherPosition = 'dosen' | 'kaprodi' | 'dekan'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  image: string | null
  // Teacher-specific
  position: TeacherPosition | null
  nidn: string | null
  facultyId: number | null
  departmentId: number | null
  subjectId: number | null
  // Student-specific
  nim: string | null
  classroomId: number | null
  // Timestamps
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  // Relations (optional — included when fetched with relations)
  faculty?: { id: number; name: string } | null
  department?: { id: number; name: string } | null
  classroom?: { id: number; name: string } | null
  subject?: { id: number; name: string } | null
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: UserRole
  position?: TeacherPosition
  nidn?: string
  subjectId?: number
  departmentId?: number
  facultyId?: number
  classroomId?: number
  nim?: string
}

export interface UpdateUserPayload {
  name: string
  email: string
  role: UserRole
  password?: string
  position?: TeacherPosition
  nidn?: string
  subjectId?: number
  departmentId?: number
  facultyId?: number
  classroomId?: number
  nim?: string
}
