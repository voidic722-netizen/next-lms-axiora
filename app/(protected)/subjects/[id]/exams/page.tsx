import type { Metadata } from 'next'
import { SubjectExamsPage } from '@/features/subjects/components/subject-sub-pages'

export const metadata: Metadata = { title: 'Ujian - Mata Pelajaran' }

export default function Page({ params }: { params: { id: string } }) {
  return <SubjectExamsPage id={params.id} />
}
