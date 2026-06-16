import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getSemestersService,
  createSemesterService,
  updateSemesterService,
  deleteSemesterService,
} from '@/services/semester-service'
import type { CreateSemesterPayload, UpdateSemesterPayload } from '@/types/semester'

export const SEMESTER_KEYS = {
  all: ['semesters'] as const,
}

function extractErrorMessage(error: unknown, fallback: string): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
}

export function useSemesters() {
  return useQuery({
    queryKey: SEMESTER_KEYS.all,
    queryFn: getSemestersService,
    staleTime: 60_000,
  })
}

export function useCreateSemester() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSemesterPayload) => createSemesterService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEMESTER_KEYS.all })
      toast.success('Semester berhasil ditambahkan')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menambahkan semester')),
  })
}

export function useUpdateSemester(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateSemesterPayload) => updateSemesterService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEMESTER_KEYS.all })
      toast.success('Semester berhasil diperbarui')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal memperbarui semester')),
  })
}

export function useDeleteSemester() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSemesterService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SEMESTER_KEYS.all })
      toast.success('Semester berhasil dihapus')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menghapus semester')),
  })
}