import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getClassroomsService,
  getClassroomByIdService,
  createClassroomService,
} from '@/services/classroom-service'
import type { CreateClassroomPayload } from '@/types/classroom'

export const CLASSROOM_KEYS = {
  all: ['classrooms'] as const,
  detail: (id: number | string) => ['classrooms', Number(id)] as const,
}

function extractErrorMessage(error: unknown, fallback: string): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
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
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menambahkan kelas')),
  })
}