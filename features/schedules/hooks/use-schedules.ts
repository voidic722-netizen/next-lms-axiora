import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getSchedulesService,
  getScheduleByIdService,
  createScheduleService,
  updateScheduleService,
  deleteScheduleService,
} from '@/services/schedule-service'
import type { CreateSchedulePayload, UpdateSchedulePayload } from '@/types/schedule'

export const SCHEDULE_KEYS = {
  all: ['schedules'] as const,
  detail: (id: number | string) => ['schedules', Number(id)] as const,
}

export function useSchedules() {
  return useQuery({
    queryKey: SCHEDULE_KEYS.all,
    queryFn: getSchedulesService,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useScheduleDetail(id: number | string) {
  return useQuery({
    queryKey: SCHEDULE_KEYS.detail(id),
    queryFn: () => getScheduleByIdService(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useCreateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSchedulePayload) => createScheduleService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCHEDULE_KEYS.all })
      toast.success('Jadwal berhasil ditambahkan')
    },
    onError: () => toast.error('Gagal menambahkan jadwal'),
  })
}

export function useUpdateSchedule(id: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateSchedulePayload) => updateScheduleService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCHEDULE_KEYS.all })
      qc.invalidateQueries({ queryKey: SCHEDULE_KEYS.detail(id) })
      toast.success('Jadwal berhasil diperbarui')
    },
    onError: () => toast.error('Gagal memperbarui jadwal'),
  })
}

export function useDeleteSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => deleteScheduleService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCHEDULE_KEYS.all })
      toast.success('Jadwal berhasil dihapus')
    },
    onError: () => toast.error('Gagal menghapus jadwal'),
  })
}
