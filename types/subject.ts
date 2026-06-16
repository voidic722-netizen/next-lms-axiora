export interface Subject {
  id: number
  name: string
  type: 'general' | 'compulsory'
  departmentId: number | null
  description: string
  thumbnail: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateSubjectPayload {
  name: string
  type: 'general' | 'compulsory'
  description: string
  departmentId?: number
  thumbnail?: File
}

export interface UpdateSubjectPayload {
  name: string
  type: 'general' | 'compulsory'
  description: string
  departmentId?: number
  thumbnail?: File
}