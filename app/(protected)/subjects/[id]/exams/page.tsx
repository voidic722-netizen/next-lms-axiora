import type { Metadata } from 'next'
import { SubjectExamsPage } from '@/features/subjects/components/subject-sub-pages'

export const metadata: Metadata = { title: 'Ujian - Mata Pelajaran' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <SubjectExamsPage id={params.id} />
}
