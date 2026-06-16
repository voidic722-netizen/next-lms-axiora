import type { Metadata } from 'next'
import { EditAssignmentPage } from '@/features/assignments/components/edit-assignment-page'

export const metadata: Metadata = { title: 'Edit Tugas' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditAssignmentPage id={params.id} />
}
