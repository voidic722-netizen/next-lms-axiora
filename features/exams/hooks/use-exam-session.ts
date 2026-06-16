'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getExamByIdService } from '@/services/exam-service'
import { getMyExamSubmissionService } from '@/services/exam-submission-service'
import { submitExamService } from '@/services/exam-submission-service'
import type { ExamQuestion } from '@/types/exam'

const MAX_VIOLATIONS = 1

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = temp
  }
  return arr
}

/**
 * Manages a live exam session.
 *
 * Preserved business logic:
 * - Shuffled questions on start
 * - Countdown timer — auto-submits at zero
 * - Violation tracking: tab-switch + fullscreen-exit each count as 1 violation
 * - MAX_VIOLATIONS = 1: one violation auto-submits
 * - Keepalive submit on pagehide / beforeunload
 * - Silent submit on component unmount (if exam was in progress)
 * - Redirects to /exams/:id/submitted if already submitted
 *
 * Split from the original useExamDetail.ts which also contained useExamMain (list-page
 * dialog state — now in use-exam-list.ts).
 */
export function useExamSession(id: string | undefined) {
  const router = useRouter()

  const [examStarted, setExamStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [violationCount, setViolationCount] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Refs to avoid stale closures in event listeners
  const violationRef = useRef(0)
  const submittedRef = useRef(false)
  const answersRef = useRef<Record<string, string>>({})

  // Keep answersRef in sync with state
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  const numericId = id ? parseInt(id, 10) : undefined
  const enabled = numericId !== undefined && !isNaN(numericId)

  // ── Fetch exam ───────────────────────────────────────────────────────────
  const {
    data: exam,
    isLoading: examLoading,
    error: examError,
  } = useQuery({
    queryKey: ['exams', numericId],
    queryFn: () => getExamByIdService(numericId!),
    enabled,
    staleTime: 5 * 60 * 1000,
  })

  // ── Check existing submission ────────────────────────────────────────────
  const { data: existingSubmission, isLoading: submissionLoading } = useQuery({
    queryKey: ['exam-submissions', 'my', numericId],
    queryFn: () => getMyExamSubmissionService(numericId!),
    enabled,
    staleTime: 0,
  })

  // If already submitted, redirect immediately
  useEffect(() => {
    if (existingSubmission && id) {
      submittedRef.current = true
      router.replace(`/exams/${id}/submitted`)
    }
  }, [existingSubmission, id, router])

  // ── Silent submit (keepalive) ────────────────────────────────────────────
  const submitSilentlyOnLeave = useCallback(() => {
    if (submittedRef.current || !id) return
    submittedRef.current = true
    void submitExamService(id, { answers: answersRef.current }, { keepalive: true }).catch(() => {
      submittedRef.current = false
    })
  }, [id])

  // ── Normal submit ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (submittedRef.current || !id) return
    submittedRef.current = true
    setSubmitting(true)
    try {
      const result = await submitExamService(id, { answers: answersRef.current })
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => undefined)
      }
      router.replace(`/exams/${id}/submitted`)
      // Pass result via URL search params so the submitted page can display it
      // without a second API call. The page also fetches as a fallback.
      router.replace(
        `/exams/${id}/submitted?score=${result.score}&correct=${result.correctCount}&total=${result.totalQuestions}`,
      )
    } catch (err) {
      submittedRef.current = false
      setSubmitting(false)
      setSubmitError(err instanceof Error ? err.message : 'Gagal mengumpulkan ujian')
    }
  }, [id, router])

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!examStarted || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          void handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [examStarted, timeLeft, handleSubmit])

  // ── Violation tracking ───────────────────────────────────────────────────
  const addViolation = useCallback(() => {
    violationRef.current += 1
    setViolationCount(violationRef.current)
    if (violationRef.current >= MAX_VIOLATIONS) {
      void handleSubmit()
    }
  }, [handleSubmit])

  // Tab-switch detection
  useEffect(() => {
    if (!examStarted) return
    const handleVisibilityChange = () => {
      if (document.hidden) addViolation()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [examStarted, addViolation])

  // Fullscreen-exit detection
  useEffect(() => {
    if (!examStarted) return
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) addViolation()
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [examStarted, addViolation])

  // Page leave — keepalive submit
  useEffect(() => {
    if (!examStarted) return
    const handlePageHide = () => submitSilentlyOnLeave()
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      submitSilentlyOnLeave()
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [examStarted, submitSilentlyOnLeave])

  // Component unmount during active exam — silent submit
  useEffect(() => {
    return () => {
      if (examStarted && !submittedRef.current) {
        submitSilentlyOnLeave()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStarted])

  // ── Start exam ───────────────────────────────────────────────────────────
  const startExam = useCallback(async () => {
    if (!exam) return
    const shuffled = shuffleArray(exam.questions ?? [])
    setQuestions(shuffled)
    setTimeLeft(exam.durationMinutes * 60)
    setExamStarted(true)
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      // Fullscreen is best-effort; continue if blocked
    }
  }, [exam])

  // ── Navigation ───────────────────────────────────────────────────────────
  const currentQuestion = useMemo(
    () => (questions.length > 0 ? (questions[currentIndex] ?? null) : null),
    [questions, currentIndex],
  )

  const totalQuestions = questions.length
  const isFirstQuestion = currentIndex === 0
  const isLastQuestion = currentIndex === totalQuestions - 1

  function handleAnswerChange(value: string) {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [String(currentQuestion.id)]: value }))
  }

  function handleNext() {
    if (!isLastQuestion) setCurrentIndex((i) => i + 1)
  }

  function handlePrev() {
    if (!isFirstQuestion) setCurrentIndex((i) => i - 1)
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < totalQuestions) setCurrentIndex(index)
  }

  const formattedTime = useMemo(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0')
    const s = (timeLeft % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }, [timeLeft])

  const loading = examLoading || submissionLoading
  const error = examError instanceof Error ? examError.message : examError ? 'Gagal memuat ujian' : null

  return {
    exam,
    examStarted,
    startExam,
    currentIndex,
    currentQuestion,
    answers,
    loading,
    error: error ?? submitError,
    submitting,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    handleAnswerChange,
    handleNext,
    handlePrev,
    goToQuestion,
    questions,
    formattedTime,
    timeLeft,
    violationCount,
    maxViolations: MAX_VIOLATIONS,
    handleSubmit,
  }
}
