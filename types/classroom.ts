export interface Classroom {
  id: number
  name: string
  departmentId: number
  semesterId: number
  subjectId: number
  createdAt: string
  updatedAt: string
  department?: {
    id: number
    name: string
    facultyId?: number
    faculty?: { id: number; name: string }
  }
  semester?: {
    id: number
    name: string
    academicYear?: string
  }
  subject?: {
    id: number
    name: string
  }
}

export interface ClassroomTeacher {
  id: number
  name: string
  email: string
  position?: string | null
  nidn?: string | null
}

export interface ClassroomStudent {
  id: number
  name: string
  email: string
  nim?: string | null
}

export interface ClassroomAssignment {
  id: number
  title: string
  description: string
  types: string[]
  classroomIds: number[]
  dueDate: string
  maxFileSize: number
  subjectId: number
  createdAt: string
}

export interface ClassroomExam {
  id: number
  title: string
  description?: string | null
  examTypes: string[]
  classroomIds: number[]
  availableDate: string
  deadlineDate: string
  durationMinutes: number
  questionCount: number
  createdAt: string
}

export interface ClassroomSchedule {
  id: number
  date: string
  topic: string
}

export interface ClassroomDetail extends Classroom {
  teacher: ClassroomTeacher | null
  teachers: ClassroomTeacher[]
  students: ClassroomStudent[]
  studentCount: number
  assignments: ClassroomAssignment[]
  exams: ClassroomExam[]
  schedules: ClassroomSchedule[]
}

export interface CreateClassroomPayload {
  name: string
  departmentId: number
  semesterId: number
  subjectId: number
}

export interface UpdateClassroomPayload {
  name: string
  departmentId: number
  semesterId: number
  subjectId: number
}