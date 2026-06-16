import type { Metadata } from 'next'
import { ClassroomDetailPage } from '@/features/classrooms/components/classroom-detail-page'

export const metadata: Metadata = { title: 'Detail Kelas' }

export default function Page({ params }: { params: { id: string } }) {
  return <ClassroomDetailPage id={params.id} />
}
