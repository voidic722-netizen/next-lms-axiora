import type { Metadata } from 'next'
import { EditUserPage } from '@/features/users/components/edit-user-page'

export const metadata: Metadata = { title: 'Edit User' }

export default function Page({ params }: { params: { id: string } }) {
  return <EditUserPage id={params.id} />
}
