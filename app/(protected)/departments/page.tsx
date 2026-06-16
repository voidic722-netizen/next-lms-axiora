import type { Metadata } from 'next'
import { DepartmentsPage } from '@/features/departments/components/departments-page'

export const metadata: Metadata = { title: 'Jurusan' }

export default function Page() {
  return <DepartmentsPage />
}
