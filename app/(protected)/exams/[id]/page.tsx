import type { Metadata } from 'next'
import { ExamSessionPage } from '@/features/exams/components/exam-session-page'

export const metadata: Metadata = { title: 'Ujian' }

export default async function ExamTakePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <ExamSessionPage id={params.id} />
}
