import type { Metadata } from 'next'
import { SubjectAssignmentsPage } from '@/features/subjects/components/subject-sub-pages'

export const metadata: Metadata = { title: 'Tugas - Mata Pelajaran' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <SubjectAssignmentsPage id={params.id} />
}
