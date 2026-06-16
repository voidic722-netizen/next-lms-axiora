import type { Metadata } from 'next'
import { AssignmentDetailPage } from '@/features/assignment-submissions/components/assignment-detail-page'

export const metadata: Metadata = { title: 'Detail Tugas' }

export default function Page({ params }: { params: { id: string } }) {
  return <AssignmentDetailPage id={params.id} />
}
