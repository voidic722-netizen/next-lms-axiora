import type { Metadata } from 'next'
import { FacultyDetailPage } from '@/features/faculties/components/faculty-detail-page'

export const metadata: Metadata = { title: 'Detail Fakultas' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <FacultyDetailPage id={params.id} />
}
