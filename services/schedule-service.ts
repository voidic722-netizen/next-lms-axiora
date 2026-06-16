import api from '@/lib/axios'
import type { Schedule, CreateSchedulePayload, UpdateSchedulePayload } from '@/types/schedule'

interface RawSchedule {
  id: number
  date: string
  classroom_id: number
  topic: string
  created_at: string
  updated_at: string
  classroom?: { id: number; name: string }
}

function mapSchedule(raw: RawSchedule): Schedule {
  return {
    id: raw.id,
    date: raw.date,
    classroomId: raw.classroom_id,
    topic: raw.topic,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    classroom: raw.classroom,
  }
}

export async function getSchedulesService(): Promise<Schedule[]> {
  const { data } = await api.get<RawSchedule[]>('/schedules')
  return data.map(mapSchedule)
}

export async function getScheduleByIdService(id: number | string): Promise<Schedule> {
  const { data } = await api.get<RawSchedule>(`/schedules/${id}`)
  return mapSchedule(data)
}

export async function createScheduleService(payload: CreateSchedulePayload): Promise<Schedule> {
  const { data } = await api.post<RawSchedule>('/schedules', {
    date: payload.date,
    classroom_id: payload.classroomId,
    topic: payload.topic,
  })
  return mapSchedule(data)
}

export async function updateScheduleService(id: number | string, payload: UpdateSchedulePayload): Promise<Schedule> {
  const { data } = await api.put<RawSchedule>(`/schedules/${id}`, {
    date: payload.date,
    classroom_id: payload.classroomId,
    topic: payload.topic,
  })
  return mapSchedule(data)
}

export async function deleteScheduleService(id: number | string): Promise<void> {
  await api.delete(`/schedules/${id}`)
}