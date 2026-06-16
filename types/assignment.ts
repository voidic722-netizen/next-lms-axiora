export interface AssignmentModule {
  id: number
  assignmentId: number
  name: string
  filePath: string
  format: string
  fileSize: string
}

export interface Assignment {
  id: number
  title: string
  description: string
  types: string[]
  classroomIds: number[]
  dueDate: string
  maxFileSize: number
  subjectId: number
  subject?: { id: number; name: string }
  modules: AssignmentModule[]
  createdAt: string
}

export interface CreateAssignmentPayload {
  title: string
  description: string
  types: string[]
  classroomIds: number[]
  dueDate: string
  maxFileSize: number
  subjectId: number
  modules?: File[]
}

export interface UpdateAssignmentPayload {
  title: string
  description: string
  types: string[]
  classroomIds: number[]
  dueDate: string
  maxFileSize: number
  subjectId: number
  modules?: File[]
  deletedModuleIds?: number[]
}
