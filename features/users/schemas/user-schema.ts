import { z } from 'zod'
import { USER_ROLE } from '@/types/roles'

const baseSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  role: z.enum([USER_ROLE.Admin, USER_ROLE.Teacher, USER_ROLE.Student]),
  password: z.string().optional(),
})

const teacherSchema = baseSchema.extend({
  role: z.literal(USER_ROLE.Teacher),
  position: z.enum(['dosen', 'kaprodi', 'dekan'], {
    required_error: 'Posisi wajib dipilih',
  }),
  nidn: z.string().min(1, 'NIDN wajib diisi'),
  facultyId: z.number({ required_error: 'Fakultas wajib dipilih' }).int().positive(),
  departmentId: z.number({ required_error: 'Jurusan wajib dipilih' }).int().positive(),
  subjectId: z.number({ required_error: 'Mata pelajaran wajib dipilih' }).int().positive(),
})

const studentSchema = baseSchema.extend({
  role: z.literal(USER_ROLE.Student),
  nim: z.string().min(1, 'NIM wajib diisi'),
  facultyId: z.number({ required_error: 'Fakultas wajib dipilih' }).int().positive(),
  departmentId: z.number({ required_error: 'Jurusan wajib dipilih' }).int().positive(),
  classroomId: z.number({ required_error: 'Kelas wajib dipilih' }).int().positive(),
})

const adminSchema = baseSchema.extend({
  role: z.literal(USER_ROLE.Admin),
})

export const createUserSchema = z
  .discriminatedUnion('role', [adminSchema, teacherSchema, studentSchema])
  .and(
    z.object({
      password: z.string().min(6, 'Password minimal 6 karakter'),
    }),
  )

export const updateUserSchema = z
  .discriminatedUnion('role', [adminSchema, teacherSchema, studentSchema])
  .and(
    z.object({
      password: z
        .string()
        .optional()
        .refine((v) => !v || v.length >= 6, 'Password minimal 6 karakter'),
    }),
  )

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
