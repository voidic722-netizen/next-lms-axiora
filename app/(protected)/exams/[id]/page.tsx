import type { Metadata } from 'next'
import { ExamSessionPage } from '@/features/exams/components/exam-session-page'

export const metadata: Metadata = { title: 'Ujian' }

export default function ExamTakePage({ params }: { params: { id: string } }) {
  return <ExamSessionPage id={params.id} />
}
