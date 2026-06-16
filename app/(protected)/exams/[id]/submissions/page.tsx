import type { Metadata } from 'next'
import { ExamSubmissionsPage } from '@/features/exam-submissions/components/exam-submissions-page'

export const metadata: Metadata = { title: 'Pengumpulan Ujian' }

export default function Page({ params }: { params: { id: string } }) {
  return <ExamSubmissionsPage id={params.id} />
}
