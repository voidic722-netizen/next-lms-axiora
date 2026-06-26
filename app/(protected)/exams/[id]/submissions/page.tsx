import type { Metadata } from 'next'
import { ExamSubmissionsPage } from '@/features/exam-submissions/components/exam-submissions-page'

export const metadata: Metadata = { title: 'Pengumpulan Ujian' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <ExamSubmissionsPage id={params.id} />
}
