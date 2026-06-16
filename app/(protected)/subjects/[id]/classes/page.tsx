import type { Metadata } from 'next'
import { SubjectClassesPage } from '@/features/subjects/components/subject-sub-pages'

export const metadata: Metadata = { title: 'Kelas - Mata Pelajaran' }

export default function Page({ params }: { params: { id: string } }) {
  return <SubjectClassesPage id={params.id} />
}
