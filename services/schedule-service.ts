import api from '@/lib/axios'
import type { Schedule, CreateSchedulePayload, UpdateSchedulePayload } from '@/types/schedule'

interface RawSchedule {
  id: number
  date: string
  kelas_id: number
  topic: string
  created_at: string
  kelas?: { id: number; name: string }
}

function mapSchedule(raw: RawSchedule): Schedule {
  return {
    id: raw.id,
    date: raw.date,
    classroomId: raw.kelas_id,
    topic: raw.topic,
    createdAt: raw.created_at,
    classroom: raw.kelas,
  }
}

export async function getSchedulesService(): Promise<Schedule[]> {
  const { data } = await api.get<{ jadwal: RawSchedule[] }>('/jadwal')
  return data.jadwal.map(mapSchedule)
}

export async function getScheduleByIdService(id: number | string): Promise<Schedule> {
  const { data } = await api.get<{ jadwal: RawSchedule }>(`/jadwal/${id}`)
  return mapSchedule(data.jadwal)
}

export async function createScheduleService(payload: CreateSchedulePayload): Promise<Schedule> {
  const { data } = await api.post<{ jadwal: RawSchedule }>('/jadwal', {
    date: payload.date,
    kelas_id: payload.classroomId,
    topic: payload.topic,
  })
  return mapSchedule(data.jadwal)
}

export async function updateScheduleService(id: number | string, payload: UpdateSchedulePayload): Promise<Schedule> {
  const { data } = await api.put<{ jadwal: RawSchedule }>(`/jadwal/${id}`, {
    date: payload.date,
    kelas_id: payload.classroomId,
    topic: payload.topic,
  })
  return mapSchedule(data.jadwal)
}

export async function deleteScheduleService(id: number | string): Promise<void> {
  await api.delete(`/jadwal/${id}`)
}
