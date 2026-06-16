import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getSubjectsService,
  getSubjectByIdService,
  createSubjectService,
  updateSubjectService,
  deleteSubjectService,
} from '@/services/subject-service'
import type { CreateSubjectPayload, UpdateSubjectPayload } from '@/types/subject'

export const SUBJECT_KEYS = {
  all: ['subjects'] as const,
  detail: (id: number | string) => ['subjects', Number(id)] as const,
}

function extractErrorMessage(error: unknown, fallback: string): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
}

export function useSubjects() {
  return useQuery({
    queryKey: SUBJECT_KEYS.all,
    queryFn: getSubjectsService,
    staleTime: 60_000,
  })
}

export function useSubjectDetail(id: number | string) {
  return useQuery({
    queryKey: SUBJECT_KEYS.detail(id),
    queryFn: () => getSubjectByIdService(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useCreateSubject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => createSubjectService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUBJECT_KEYS.all })
      toast.success('Mata pelajaran berhasil ditambahkan')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menambahkan mata pelajaran')),
  })
}

export function useUpdateSubject(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateSubjectPayload) => updateSubjectService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUBJECT_KEYS.all })
      qc.invalidateQueries({ queryKey: SUBJECT_KEYS.detail(id) })
      toast.success('Mata pelajaran berhasil diperbarui')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal memperbarui mata pelajaran')),
  })
}

export function useDeleteSubject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSubjectService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUBJECT_KEYS.all })
      toast.success('Mata pelajaran berhasil dihapus')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menghapus mata pelajaran')),
  })
}