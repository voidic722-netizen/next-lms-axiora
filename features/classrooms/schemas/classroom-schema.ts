import { z } from 'zod'

export const classroomSchema = z.object({
  name: z.string().min(1, 'Nama kelas wajib diisi'),
  departmentId: z
    .number({ required_error: 'Jurusan wajib dipilih' })
    .int()
    .positive('Jurusan wajib dipilih'),
  semesterId: z
    .number({ required_error: 'Semester wajib dipilih' })
    .int()
    .positive('Semester wajib dipilih'),
  subjectId: z
    .number({ required_error: 'Mata pelajaran wajib dipilih' })
    .int()
    .positive('Mata pelajaran wajib dipilih'),
})

export type ClassroomFormValues = z.infer<typeof classroomSchema>
