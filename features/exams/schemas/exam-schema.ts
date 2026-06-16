import { z } from 'zod'

const examOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Pilihan jawaban tidak boleh kosong'),
  isCorrect: z.boolean().optional(),
})

const examQuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Teks soal tidak boleh kosong'),
  type: z.literal('multiple-choice'),
  image: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  options: z
    .array(examOptionSchema)
    .min(2, 'Minimal 2 pilihan jawaban')
    .refine(
      (opts) => opts.some((o) => o.isCorrect),
      'Tandai minimal satu jawaban yang benar',
    ),
})

export const examSchema = z.object({
  title: z.string().min(1, 'Judul ujian wajib diisi'),
  description: z.string().optional(),
  examTypes: z.array(z.string()).min(1, 'Pilih minimal satu kategori'),
  classroomIds: z.array(z.number()).min(1, 'Pilih minimal satu kelas'),
  availableDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  deadlineDate: z.string().min(1, 'Tenggat waktu wajib diisi'),
  durationMinutes: z
    .number({ required_error: 'Durasi wajib diisi' })
    .int()
    .positive('Durasi harus lebih dari 0 menit'),
  questions: z.array(examQuestionSchema).min(1, 'Minimal 1 soal harus ditambahkan'),
})

export type ExamFormValues = z.infer<typeof examSchema>
export type ExamQuestionFormValues = z.infer<typeof examQuestionSchema>
export type ExamOptionFormValues = z.infer<typeof examOptionSchema>
