import type { Metadata } from 'next'
import { ExamSubmittedPage } from '@/features/exam-submissions/components/exam-submitted-page'

export const metadata: Metadata = { title: 'Hasil Ujian' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <ExamSubmittedPage id={params.id} />
}
