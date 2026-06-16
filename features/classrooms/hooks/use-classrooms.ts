import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getClassroomsService,
  getClassroomByIdService,
  createClassroomService,
  updateClassroomService,
  deleteClassroomService,
} from '@/services/classroom-service'
import type { CreateClassroomPayload, UpdateClassroomPayload } from '@/types/classroom'

export const CLASSROOM_KEYS = {
  all: ['classrooms'] as const,
  detail: (id: number | string) => ['classrooms', Number(id)] as const,
}

export function useClassrooms() {
  return useQuery({
    queryKey: CLASSROOM_KEYS.all,
    queryFn: getClassroomsService,
    staleTime: 60_000,
  })
}

export function useClassroomDetail(id: number | string) {
  return useQuery({
    queryKey: CLASSROOM_KEYS.detail(id),
    queryFn: () => getClassroomByIdService(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useCreateClassroom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateClassroomPayload) => createClassroomService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLASSROOM_KEYS.all })
      toast.success('Kelas berhasil ditambahkan')
    },
    onError: () => toast.error('Gagal menambahkan kelas'),
  })
}

export function useUpdateClassroom(id: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateClassroomPayload) => updateClassroomService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLASSROOM_KEYS.all })
      qc.invalidateQueries({ queryKey: CLASSROOM_KEYS.detail(id) })
      toast.success('Kelas berhasil diperbarui')
    },
    onError: () => toast.error('Gagal memperbarui kelas'),
  })
}

export function useDeleteClassroom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => deleteClassroomService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLASSROOM_KEYS.all })
      toast.success('Kelas berhasil dihapus')
    },
    onError: () => toast.error('Gagal menghapus kelas'),
  })
}
