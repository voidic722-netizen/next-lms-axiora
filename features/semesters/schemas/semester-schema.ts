import { z } from 'zod'

export const semesterSchema = z.object({
  name: z.string().min(1, 'Nama semester wajib diisi'),
  academicYear: z
    .string()
    .min(1, 'Tahun akademik wajib diisi')
    .regex(/^\d{4}\/\d{4}$/, 'Format tahun: 2024/2025'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
})

export type SemesterFormValues = z.infer<typeof semesterSchema>