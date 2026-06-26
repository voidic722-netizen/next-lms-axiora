import type { Metadata } from 'next'
import { DepartmentDetailPage } from '@/features/departments/components/department-detail-page'

export const metadata: Metadata = { title: 'Detail Jurusan' }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <DepartmentDetailPage id={params.id} />
}
