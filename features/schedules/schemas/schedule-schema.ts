import { z } from 'zod'

export const scheduleSchema = z.object({
  classroomId: z
    .number({ required_error: 'Kelas wajib dipilih' })
    .int()
    .positive('Kelas wajib dipilih'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  topic: z.string().min(1, 'Topik wajib diisi'),
})

export type ScheduleFormValues = z.infer<typeof scheduleSchema>
