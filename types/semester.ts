export interface Semester {
  id: number
  name: string
  academicYear: string
  createdAt: string
}

export interface CreateSemesterPayload {
  name: string
  academicYear: string
}

export interface UpdateSemesterPayload {
  name: string
  academicYear: string
}
