import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getMyExamSubmissionService,
  getExamSubmissionsService,
  submitExamService,
} from '@/services/exam-submission-service'
import type { SubmitExamPayload, SubmitExamOptions } from '@/types/exam-submission'

export const EXAM_SUBMISSION_KEYS = {
  my: (examId: number | string) =>
    ['exam-submissions', 'my', Number(examId)] as const,
  all: (examId: number | string) =>
    ['exam-submissions', 'all', Number(examId)] as const,
}

export function useMyExamSubmission(examId: number | string) {
  return useQuery({
    queryKey: EXAM_SUBMISSION_KEYS.my(examId),
    queryFn: () => getMyExamSubmissionService(examId),
    enabled: !!examId,
    staleTime: 0, // always fresh — drives redirect on exam page
  })
}

export function useExamSubmissions(examId: number | string) {
  return useQuery({
    queryKey: EXAM_SUBMISSION_KEYS.all(examId),
    queryFn: () => getExamSubmissionsService(examId),
    enabled: !!examId,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useSubmitExam(examId: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ payload, options }: { payload: SubmitExamPayload; options?: SubmitExamOptions }) =>
      submitExamService(examId, payload, options),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAM_SUBMISSION_KEYS.my(examId) })
    },
    onError: () => toast.error('Gagal mengumpulkan ujian'),
  })
}
