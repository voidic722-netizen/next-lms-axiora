import type { Metadata } from 'next'
import { ExamSubmittedPage } from '@/features/exam-submissions/components/exam-submitted-page'

export const metadata: Metadata = { title: 'Hasil Ujian' }

export default function Page({ params }: { params: { id: string } }) {
  return <ExamSubmittedPage id={params.id} />
}
