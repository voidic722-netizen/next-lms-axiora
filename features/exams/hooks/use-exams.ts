import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getExamsService,
  getExamByIdService,
  createExamService,
  updateExamService,
  deleteExamService,
} from '@/services/exam-service'
import type { CreateOrUpdateExamPayload } from '@/types/exam'

export const EXAM_KEYS = {
  all: ['exams'] as const,
  detail: (id: number | string) => ['exams', Number(id)] as const,
}

export function useExams() {
  return useQuery({
    queryKey: EXAM_KEYS.all,
    queryFn: getExamsService,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useExamDetail(id: number | string) {
  return useQuery({
    queryKey: EXAM_KEYS.detail(id),
    queryFn: () => getExamByIdService(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useCreateExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrUpdateExamPayload) => createExamService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_KEYS.all })
      toast.success('Ujian berhasil ditambahkan')
    },
    onError: () => toast.error('Gagal menambahkan ujian'),
  })
}

export function useUpdateExam(id: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrUpdateExamPayload) => updateExamService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_KEYS.all })
      qc.invalidateQueries({ queryKey: EXAM_KEYS.detail(id) })
      toast.success('Ujian berhasil diperbarui')
    },
    onError: () => toast.error('Gagal memperbarui ujian'),
  })
}

export function useDeleteExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => deleteExamService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_KEYS.all })
      toast.success('Ujian berhasil dihapus')
    },
    onError: () => toast.error('Gagal menghapus ujian'),
  })
}
