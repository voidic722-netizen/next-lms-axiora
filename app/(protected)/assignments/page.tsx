import type { Metadata } from 'next'
import { AssignmentsPage } from '@/features/assignments/components/assignments-page'

export const metadata: Metadata = { title: 'Tugas' }

export default function AssignmentsListPage() {
  return <AssignmentsPage />
}
