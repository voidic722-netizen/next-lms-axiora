import { z } from 'zod'

export const semesterSchema = z.object({
  name: z.string().min(1, 'Nama semester wajib diisi'),
  academicYear: z
    .string()
    .min(1, 'Tahun akademik wajib diisi')
    .regex(/^\d{4}\/\d{4}$/, 'Format tahun: 2024/2025'),
})

export type SemesterFormValues = z.infer<typeof semesterSchema>
