export interface Subject {
  id: number
  name: string
  type: 'umum' | 'wajib'
  departmentId: number | null
  description: string
  thumbnail: string | null
  createdAt: string
}

export interface CreateSubjectPayload {
  name: string
  type: 'umum' | 'wajib'
  description: string
  departmentId?: number
  thumbnail?: File
}

export interface UpdateSubjectPayload {
  name: string
  type: 'umum' | 'wajib'
  description: string
  departmentId?: number
  thumbnail?: File
}
