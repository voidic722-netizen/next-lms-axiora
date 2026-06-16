import type { Metadata } from 'next'
import { AddDepartmentPage } from '@/features/departments/components/add-department-page'

export const metadata: Metadata = { title: 'Tambah Jurusan' }

export default function Page() {
  return <AddDepartmentPage />
}
