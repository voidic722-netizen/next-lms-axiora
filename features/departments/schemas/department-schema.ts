import { z } from 'zod'

export const departmentSchema = z.object({
  name: z.string().min(1, 'Nama jurusan wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  facultyId: z
    .number({ required_error: 'Fakultas wajib dipilih' })
    .int()
    .positive('Fakultas wajib dipilih'),
  thumbnail: z
    .instanceof(File)
    .refine((f) => f.size <= 2 * 1024 * 1024, 'Ukuran file maks 2 MB')
    .optional(),
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>
