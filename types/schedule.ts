export interface Schedule {
  id: number
  date: string
  classroomId: number
  topic: string
  createdAt: string
  updatedAt: string
  classroom?: {
    id: number
    name: string
  }
}

export interface CreateSchedulePayload {
  date: string
  classroomId: number
  topic: string
}

export interface UpdateSchedulePayload {
  date: string
  classroomId: number
  topic: string
}