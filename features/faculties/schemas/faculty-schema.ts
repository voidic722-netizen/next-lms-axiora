import { z } from 'zod'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const facultySchema = z.object({
  name: z.string().min(1, 'Nama fakultas wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  thumbnail: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, 'Ukuran file maksimal 2 MB')
    .refine((f) => ACCEPTED_TYPES.includes(f.type), 'Format: JPG, PNG, WebP')
    .optional(),
})

export type FacultyFormValues = z.infer<typeof facultySchema>
