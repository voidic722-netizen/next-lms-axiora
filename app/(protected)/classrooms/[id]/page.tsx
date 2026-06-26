import type { Metadata } from 'next'
import { ClassroomDetailPage } from '@/features/classrooms/components/classroom-detail-page'

export const metadata: Metadata = { title: 'Detail Kelas' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <ClassroomDetailPage id={params.id} />
}
