'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { USER_ROLE } from '@/types/roles'

/**
 * Handles exam list-page interactions: start-exam dialog and not-available dialog.
 * Split from the original useExamDetail.ts which contained two unrelated hooks.
 */
export function useExamList() {
  const router = useRouter()
  const { user } = useAuth()

  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false)
  const [isNotAvailableOpen, setIsNotAvailableOpen] = useState(false)
  const [notAvailableFrom, setNotAvailableFrom] = useState('')
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)

  function handleExamClick(
    e: React.MouseEvent,
    id: number,
    isCompleted: boolean,
    availableFrom?: string,
  ) {
    e.preventDefault()

    // Teacher/Admin → go straight to submissions
    if (user?.role !== USER_ROLE.Student) {
      router.push(`/exams/${id}/submissions`)
      return
    }

    // Student who already submitted → go to their result
    if (isCompleted) {
      router.push(`/exams/${id}/submitted`)
      return
    }

    // Exam not yet available
    if (availableFrom && new Date(availableFrom) > new Date()) {
      setNotAvailableFrom(availableFrom)
      setIsNotAvailableOpen(true)
      return
    }

    // Open the start-exam confirmation dialog
    setSelectedExamId(id)
    setIsStartDialogOpen(true)
  }

  function handleStartExam() {
    if (selectedExamId !== null) {
      router.push(`/exams/${selectedExamId}`)
    }
    setIsStartDialogOpen(false)
  }

  return {
    isStartDialogOpen,
    setIsStartDialogOpen,
    isNotAvailableOpen,
    setIsNotAvailableOpen,
    notAvailableFrom,
    handleExamClick,
    handleStartExam,
  }
}
