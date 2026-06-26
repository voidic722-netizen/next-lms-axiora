import type { Metadata } from 'next'
import { SubjectClassesPage } from '@/features/subjects/components/subject-sub-pages'

export const metadata: Metadata = { title: 'Kelas - Mata Pelajaran' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <SubjectClassesPage id={params.id} />
}
