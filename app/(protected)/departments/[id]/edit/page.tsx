import type { Metadata } from 'next'
import { EditDepartmentPage } from '@/features/departments/components/edit-department-page'

export const metadata: Metadata = { title: 'Edit Jurusan' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditDepartmentPage id={params.id} />
}
