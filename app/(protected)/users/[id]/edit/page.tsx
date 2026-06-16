import type { Metadata } from 'next'
import { EditUserPage } from '@/features/users/components/edit-user-page'

export const metadata: Metadata = { title: 'Edit User' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditUserPage id={id} />
}