import type { Metadata } from 'next'
import { EditClassroomPage } from '@/features/classrooms/components/edit-classroom-page'

export const metadata: Metadata = { title: 'Edit Kelas' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditClassroomPage id={params.id} />
}
