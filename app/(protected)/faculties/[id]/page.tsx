import type { Metadata } from 'next'
import { FacultyDetailPage } from '@/features/faculties/components/faculty-detail-page'

export const metadata: Metadata = { title: 'Detail Fakultas' }

export default function Page({ params }: { params: { id: string } }) {
  return <FacultyDetailPage id={params.id} />
}
