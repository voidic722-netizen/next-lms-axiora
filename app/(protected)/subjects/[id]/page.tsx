import type { Metadata } from 'next'
import { SubjectDetailPage } from '@/features/subjects/components/subject-detail-page'

export const metadata: Metadata = { title: 'Detail Mata Pelajaran' }

export default function Page({ params }: { params: { id: string } }) {
  return <SubjectDetailPage id={params.id} />
}
