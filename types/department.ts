export interface Department {
  id: number
  name: string
  description: string
  facultyId: number
  thumbnail: string | null
  createdAt: string
  updatedAt: string
}

export interface DepartmentTeacher {
  id: number
  name: string
  email: string
  nidn: string | null
  position: string | null
  image: string | null
}

export interface DepartmentStudent {
  id: number
  name: string
  email: string
  nim: string | null
  image: string | null
  classroom: { id: number; name: string } | null
}

export interface DepartmentSubject {
  id: number
  name: string
  description: string
  thumbnail: string | null
  type: 'general' | 'compulsory'
  teacher: string | null
}

export interface DepartmentClassroom {
  id: number
  name: string
  semester: { id: number; name: string; academicYear: string } | null
  subject: { id: number; name: string } | null
}

export interface DepartmentDetail extends Department {
  faculty: { id: number; name: string } | null
  teachers: DepartmentTeacher[]
  students: DepartmentStudent[]
  subjects: DepartmentSubject[]
  classrooms: DepartmentClassroom[]
}

export interface CreateDepartmentPayload {
  name: string
  description: string
  facultyId: number
  thumbnail?: File
}

export interface UpdateDepartmentPayload {
  name: string
  description: string
  facultyId: number
  thumbnail?: File
}