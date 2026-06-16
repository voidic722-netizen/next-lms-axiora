import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getMyAssignmentSubmissionService,
  getAssignmentSubmissionsService,
  submitAssignmentService,
  gradeSubmissionService,
} from '@/services/assignment-submission-service'
import type { GradeSubmissionPayload } from '@/types/assignment-submission'

export const ASSIGNMENT_SUBMISSION_KEYS = {
  my: (assignmentId: number | string) =>
    ['assignment-submissions', 'my', Number(assignmentId)] as const,
  all: (assignmentId: number | string) =>
    ['assignment-submissions', 'all', Number(assignmentId)] as const,
}

function extractErrorMessage(error: unknown, fallback: string): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
}

export function useMyAssignmentSubmission(assignmentId: number | string) {
  return useQuery({
    queryKey: ASSIGNMENT_SUBMISSION_KEYS.my(assignmentId),
    queryFn: () => getMyAssignmentSubmissionService(assignmentId),
    enabled: !!assignmentId,
    staleTime: 30_000,
  })
}

export function useAssignmentSubmissions(assignmentId: number | string) {
  return useQuery({
    queryKey: ASSIGNMENT_SUBMISSION_KEYS.all(assignmentId),
    queryFn: () => getAssignmentSubmissionsService(assignmentId),
    enabled: !!assignmentId,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useSubmitAssignment(assignmentId: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (files: File[]) => submitAssignmentService(assignmentId, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENT_SUBMISSION_KEYS.my(assignmentId) })
      toast.success('Tugas berhasil dikumpulkan')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal mengumpulkan tugas')),
  })
}

export function useGradeSubmission(assignmentId: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ submissionId, payload }: { submissionId: number; payload: GradeSubmissionPayload }) =>
      gradeSubmissionService(submissionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ASSIGNMENT_SUBMISSION_KEYS.all(assignmentId) })
      toast.success('Nilai berhasil disimpan')
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Gagal menyimpan nilai')),
  })
}