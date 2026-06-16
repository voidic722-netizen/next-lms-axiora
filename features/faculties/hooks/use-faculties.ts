import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getFacultiesService,
  getFacultyDetailService,
  getAvailableFacultiesForDeanService,
  createFacultyService,
  updateFacultyService,
  deleteFacultyService,
} from '@/services/faculty-service'
import type { CreateFacultyPayload, UpdateFacultyPayload } from '@/types/faculty'

export const FACULTY_KEYS = {
  all: ['faculties'] as const,
  detail: (id: number | string) => ['faculties', Number(id)] as const,
  available: ['faculties', 'available-for-dean'] as const,
}

export function useFaculties() {
  return useQuery({
    queryKey: FACULTY_KEYS.all,
    queryFn: getFacultiesService,
    staleTime: 60_000,
  })
}

export function useFacultyDetail(id: number | string) {
  return useQuery({
    queryKey: FACULTY_KEYS.detail(id),
    queryFn: () => getFacultyDetailService(Number(id)),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useAvailableFacultiesForDean(excludeUserId?: number) {
  return useQuery({
    queryKey: [...FACULTY_KEYS.available, excludeUserId],
    queryFn: () => getAvailableFacultiesForDeanService(excludeUserId),
    staleTime: 30_000,
  })
}

export function useCreateFaculty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateFacultyPayload) => createFacultyService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FACULTY_KEYS.all })
      toast.success('Fakultas berhasil ditambahkan')
    },
    onError: () => toast.error('Gagal menambahkan fakultas'),
  })
}

export function useUpdateFaculty(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateFacultyPayload) => updateFacultyService(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FACULTY_KEYS.all })
      qc.invalidateQueries({ queryKey: FACULTY_KEYS.detail(id) })
      toast.success('Fakultas berhasil diperbarui')
    },
    onError: () => toast.error('Gagal memperbarui fakultas'),
  })
}

export function useDeleteFaculty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteFacultyService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FACULTY_KEYS.all })
      toast.success('Fakultas berhasil dihapus')
    },
    onError: () => toast.error('Gagal menghapus fakultas'),
  })
}
