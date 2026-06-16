import { z } from 'zod'

export const subjectSchema = z.object({
  name: z.string().min(1, 'Nama mata pelajaran wajib diisi'),
  type: z.enum(['umum', 'wajib'], { required_error: 'Tipe wajib dipilih' }),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  departmentId: z.number().int().positive().optional(),
  thumbnail: z
    .instanceof(File)
    .refine((f) => f.size <= 2 * 1024 * 1024, 'Ukuran file maks 2 MB')
    .optional(),
})

export type SubjectFormValues = z.infer<typeof subjectSchema>
