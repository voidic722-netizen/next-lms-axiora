'use client'

import Link from 'next/link'
import { Plus, Pencil, Building2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { withStorageUrl } from '@/lib/storage'
import { useFaculties, useDeleteFaculty } from '../hooks/use-faculties'
import type { Faculty } from '@/types/faculty'

export function FacultiesPage() {
  const { isAdmin } = useAuth()
  const { data: faculties = [], isLoading } = useFaculties()
  const deleteMutation = useDeleteFaculty()

  if (isLoading) return <FacultiesPageSkeleton />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fakultas"
        description={`${faculties.length} fakultas terdaftar`}
        action={
          isAdmin ? (
            <Button asChild size="sm">
              <Link href="/faculties/new">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Fakultas
              </Link>
            </Button>
          ) : undefined
        }
      />

      {faculties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">Belum ada fakultas</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faculties.map((faculty) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              isAdmin={isAdmin}
              onDelete={() => deleteMutation.mutateAsync(faculty.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FacultyCard({
  faculty,
  isAdmin,
  onDelete,
}: {
  faculty: Faculty
  isAdmin: boolean
  onDelete: () => Promise<void>
}) {
  const thumb = withStorageUrl(faculty.thumbnail)

  return (
    <Card className="overflow-hidden group">
      <Link href={`/faculties/${faculty.id}`}>
        <div className="aspect-video bg-muted overflow-hidden">
          {thumb ? (
            <img
              src={thumb}
              alt={faculty.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/faculties/${faculty.id}`}>
          <h3 className="font-semibold truncate hover:underline">{faculty.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{faculty.description}</p>
        {faculty.dean && (
          <p className="text-xs text-muted-foreground mt-2">Dekan: {faculty.dean}</p>
        )}
        {isAdmin && (
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/faculties/${faculty.id}/edit`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive border-destructive/30">
                  Hapus
                </Button>
              }
              title="Hapus Fakultas"
              description={`Yakin ingin menghapus "${faculty.name}"?`}
              confirmLabel="Hapus"
              onConfirm={onDelete}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FacultiesPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
