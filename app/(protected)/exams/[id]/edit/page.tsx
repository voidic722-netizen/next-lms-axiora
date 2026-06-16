import type { Metadata } from 'next'
import { EditExamPage } from '@/features/exams/components/edit-exam-page'

export const metadata: Metadata = { title: 'Edit Ujian' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditExamPage id={params.id} />
}
