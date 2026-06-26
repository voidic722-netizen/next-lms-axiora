'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { USER_ROLE, USER_ROLE_LABEL } from '@/types/roles'
import { useUsers, useDeleteUser } from '../hooks/use-users'
import { UserFormModal } from './user-form-modal'
import type { User } from '@/types/user'

export function UsersPage() {
  const { isAdmin } = useAuth()
  const [tab, setTab] = useState<'1' | '2' | '3'>('1')

  const { data: users = [], isLoading } = useUsers(tab)
  const deleteMutation = useDeleteUser()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  function openAddModal() {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  function openEditModal(u: User) {
    setEditingUser(u)
    setIsModalOpen(true)
  }

  if (isLoading) return <UsersPageSkeleton />

  const columns = [
    {
      key: 'name',
      header: 'Nama',
      render: (row: Record<string, unknown>) => {
        const u = row as unknown as User
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={u.image ?? undefined} />
              <AvatarFallback className="text-xs">{u.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-none text-[#0F172A]">{u.name}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{u.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'identifier',
      header: 'ID',
      render: (row: Record<string, unknown>) => {
        const u = row as unknown as User
        return (
          <span className="text-sm text-[#64748B]">
            {u.nidn ?? u.nim ?? '-'}
          </span>
        )
      },
    },
    {
      key: 'role',
      header: 'Role',
      render: (row: Record<string, unknown>) => {
        const u = row as unknown as User
        return (
          <Badge variant="secondary">{USER_ROLE_LABEL[u.role]}</Badge>
        )
      },
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: '',
            className: 'w-[90px]',
            render: (row: Record<string, unknown>) => {
              const u = row as unknown as User
              return (
                <div className="flex items-center gap-1 justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(u)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10 transition-colors duration-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    }
                    title="Hapus User"
                    description={`Yakin ingin menghapus "${u.name}"?`}
                    confirmLabel="Hapus"
                    onConfirm={() => deleteMutation.mutateAsync(u.id)}
                  />
                </div>
              )
            },
          },
        ]
      : []),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen User"
        description={`${users.length} user`}
        action={
          isAdmin ? (
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah User
            </Button>
          ) : undefined
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value={USER_ROLE.Admin}>Admin</TabsTrigger>
          <TabsTrigger value={USER_ROLE.Teacher}>Teacher</TabsTrigger>
          <TabsTrigger value={USER_ROLE.Student}>Student</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <DataTable
            data={users as unknown as Record<string, unknown>[]}
            columns={columns}
            searchable
            searchPlaceholder="Cari user..."
            searchKeys={['name', 'email']}
          />
        </TabsContent>
      </Tabs>
      
      {isAdmin && (
        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={editingUser}
        />
      )}
    </div>
  )
}

function UsersPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 bg-[#E2E8F0]" />
      <Skeleton className="h-10 w-72 bg-[#E2E8F0]" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded bg-[#E2E8F0]" />
        ))}
      </div>
    </div>
  )
}