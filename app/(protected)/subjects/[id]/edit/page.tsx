import type { Metadata } from 'next'
import { EditSubjectPage } from '@/features/subjects/components/edit-subject-page'

export const metadata: Metadata = { title: 'Edit Mata Pelajaran' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditSubjectPage id={params.id} />
}
