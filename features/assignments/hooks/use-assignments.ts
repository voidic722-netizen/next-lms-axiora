import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAssignmentsService,
  getAssignmentByIdService,
  createAssignmentService,
  updateAssignmentService,
  deleteAssignmentService,
  deleteAssignmentModuleService,
} from '@/services/assignment-service'
import type { CreateAssignmentPayload, UpdateAssignmentPayload } from '@/types/assignment'

export const ASSIGNMENT_KEYS = {
  all: ['assignments'] as const,
  detail: (id: number | string) => ['assignments', Number(id)] as const,
}

export function useAssignments() {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.all,
    queryFn: getAssignmentsService,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useAssignmentDetail(id: number | string) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.detail(id),
    queryFn: () => getAssignmentByIdService(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useCreateAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAssignmentPayload) => createAssignmentService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all })
      toast.success('Tugas berhasil ditambahkan')
    },
    onError: () => toast.error('Gagal menambahkan tugas'),
  })
}

export function useUpdateAssignment(id: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAssignmentPayload) => updateAssignmentService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all })
      qc.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.detail(id) })
      toast.success('Tugas berhasil diperbarui')
    },
    onError: () => toast.error('Gagal memperbarui tugas'),
  })
}

export function useDeleteAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAssignmentService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all })
      toast.success('Tugas berhasil dihapus')
    },
    onError: () => toast.error('Gagal menghapus tugas'),
  })
}

export function useDeleteAssignmentModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: number) => deleteAssignmentModuleService(moduleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all })
      toast.success('Modul berhasil dihapus')
    },
    onError: () => toast.error('Gagal menghapus modul'),
  })
}
