export interface Faculty {
  id: number
  name: string
  description: string
  dean: string
  thumbnail: string | null
  createdAt: string
}

export interface FacultyDepartment {
  id: number
  name: string
  description: string
  thumbnail: string | null
}

export interface FacultyTeacher {
  id: number
  name: string
  email: string
  nidn: string | null
  position: string | null
  image: string | null
  department: { id: number; name: string } | null
}

export interface FacultyStudent {
  id: number
  name: string
  email: string
  nim: string | null
  image: string | null
  department: { id: number; name: string } | null
  classroom: { id: number; name: string } | null
}

export interface FacultyDetail extends Faculty {
  deanUser: { id: number; name: string; nidn: string | null } | null
  departments: FacultyDepartment[]
  teachers: FacultyTeacher[]
  students: FacultyStudent[]
}

export interface CreateFacultyPayload {
  name: string
  description: string
  thumbnail?: File
}

export interface UpdateFacultyPayload {
  name: string
  description: string
  thumbnail?: File
}
