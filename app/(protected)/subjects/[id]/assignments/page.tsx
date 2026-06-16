import type { Metadata } from 'next'
import { SubjectAssignmentsPage } from '@/features/subjects/components/subject-sub-pages'

export const metadata: Metadata = { title: 'Tugas - Mata Pelajaran' }

export default function Page({ params }: { params: { id: string } }) {
  return <SubjectAssignmentsPage id={params.id} />
}
