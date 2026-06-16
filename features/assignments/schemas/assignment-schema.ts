import { z } from 'zod'

export const assignmentSchema = z.object({
  title: z.string().min(1, 'Judul tugas wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  types: z
    .array(z.string())
    .min(1, 'Pilih minimal satu tipe tugas'),
  subjectId: z
    .number({ required_error: 'Mata pelajaran wajib dipilih' })
    .int()
    .positive('Mata pelajaran wajib dipilih'),
  classroomIds: z
    .array(z.number())
    .min(1, 'Pilih minimal satu kelas'),
  dueDate: z.string().min(1, 'Tenggat waktu wajib diisi'),
  maxFileSize: z
    .number({ required_error: 'Ukuran file wajib diisi' })
    .int()
    .positive('Ukuran file harus lebih dari 0'),
  modules: z.array(z.instanceof(File)).optional(),
})

export type AssignmentFormValues = z.infer<typeof assignmentSchema>
