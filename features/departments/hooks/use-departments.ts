import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getDepartmentsService,
  getDepartmentDetailService,
  createDepartmentService,
  updateDepartmentService,
  deleteDepartmentService,
} from '@/services/department-service'
import type { CreateDepartmentPayload, UpdateDepartmentPayload } from '@/types/department'

export const DEPARTMENT_KEYS = {
  all: ['departments'] as const,
  detail: (id: number | string) => ['departments', Number(id)] as const,
}

function extractErrorMessage(error: unknown, fallback: string): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
}

export function useDepartments() {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.all,
    queryFn: getDepartmentsService,
    staleTime: 60_000,
  })
}

export function useDepartmentDetail(id: number | string) {
  return useQuery({
    queryKey: DEPARTMENT_KEYS.detail(id),
    queryFn: () => getDepartmentDetailService(Number(id)),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useCreateDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartmentService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEPARTMENT_KEYS.all })
      toast.success('Jurusan berhasil ditambahkan')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menambahkan jurusan')),
  })
}

export function useUpdateDepartment(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateDepartmentPayload) => updateDepartmentService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEPARTMENT_KEYS.all })
      qc.invalidateQueries({ queryKey: DEPARTMENT_KEYS.detail(id) })
      toast.success('Jurusan berhasil diperbarui')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal memperbarui jurusan')),
  })
}

export function useDeleteDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteDepartmentService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEPARTMENT_KEYS.all })
      toast.success('Jurusan berhasil dihapus')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menghapus jurusan')),
  })
}