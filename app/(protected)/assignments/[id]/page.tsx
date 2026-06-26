import type { Metadata } from 'next'
import { AssignmentDetailPage } from '@/features/assignment-submissions/components/assignment-detail-page'

export const metadata: Metadata = { title: 'Detail Tugas' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <AssignmentDetailPage id={resolvedParams.id} />
}
