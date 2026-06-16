import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getUsersService,
  getSingleUserService,
  createUserService,
  updateUserService,
  deleteUserService,
} from '@/services/user-service'
import { getFacultiesService } from '@/services/faculty-service'
import { getDepartmentsService } from '@/services/department-service'
import { getClassroomsService } from '@/services/classroom-service'
import { getSubjectsService } from '@/services/subject-service'
import type { CreateUserPayload, UpdateUserPayload } from '@/types/user'

export const USER_KEYS = {
  all: ['users'] as const,
  byRole: (role?: string) => ['users', role] as const,
  single: (id: number) => ['users', id] as const,
}

export function useUsers(role?: string) {
  return useQuery({
    queryKey: USER_KEYS.byRole(role),
    queryFn: () => getUsersService(role),
    staleTime: 30_000,
  })
}

export function useSingleUser(id: number) {
  return useQuery({
    queryKey: USER_KEYS.single(id),
    queryFn: () => getSingleUserService(id),
    staleTime: 30_000,
    enabled: !isNaN(id),  // tambah ini
  })
}

export function useUserReferenceData() {
  const faculties = useQuery({
    queryKey: ['faculties'],
    queryFn: getFacultiesService,
    staleTime: 5 * 60_000,
  })
  const departments = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartmentsService,
    staleTime: 5 * 60_000,
  })
  const classrooms = useQuery({
    queryKey: ['classrooms'],
    queryFn: getClassroomsService,
    staleTime: 5 * 60_000,
  })
  const subjects = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjectsService,
    staleTime: 5 * 60_000,
  })

  return {
    faculties: faculties.data ?? [],
    departments: departments.data ?? [],
    classrooms: classrooms.data ?? [],
    subjects: subjects.data ?? [],
    isLoading:
      faculties.isLoading ||
      departments.isLoading ||
      classrooms.isLoading ||
      subjects.isLoading,
  }
}

function extractErrorMessage(error: unknown, fallback: string): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUserService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all })
      toast.success('User berhasil ditambahkan')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menambahkan user')),
  })
}

export function useUpdateUser(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ payload, image }: { payload: UpdateUserPayload; image?: File }) =>
      updateUserService(id, payload, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all })
      toast.success('User berhasil diperbarui')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal memperbarui user')),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUserService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all })
      toast.success('User berhasil dihapus')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menghapus user')),
  })
}