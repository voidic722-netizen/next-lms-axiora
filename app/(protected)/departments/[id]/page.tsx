import type { Metadata } from 'next'
import { DepartmentDetailPage } from '@/features/departments/components/department-detail-page'

export const metadata: Metadata = { title: 'Detail Jurusan' }

export default function Page({ params }: { params: { id: string } }) {
  return <DepartmentDetailPage id={params.id} />
}
