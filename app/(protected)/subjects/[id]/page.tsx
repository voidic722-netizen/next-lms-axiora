import type { Metadata } from 'next'
import { SubjectDetailPage } from '@/features/subjects/components/subject-detail-page'

export const metadata: Metadata = { title: 'Detail Mata Pelajaran' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <SubjectDetailPage id={params.id} />
}
