'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { semesterSchema, type SemesterFormValues } from '../schemas/semester-schema'
import { useSemesters, useCreateSemester, useUpdateSemester, useDeleteSemester } from '../hooks/use-semesters'
import type { Semester } from '@/types/semester'

export function SemestersPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const { data: semesters = [], isLoading } = useSemesters()
  const createMutation = useCreateSemester()
  const deleteMutation = useDeleteSemester()

  const [editing, setEditing] = useState<Semester | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemesterFormValues>({ resolver: zodResolver(semesterSchema) })

  const updateMutation = useUpdateSemester(editing?.id ?? 0)

  function startEdit(sem: Semester) {
    setEditing(sem)
    reset({ name: sem.name, academicYear: sem.academicYear })
  }

  function cancelEdit() {
    setEditing(null)
    reset({ name: '', academicYear: '' })
  }

  async function onSubmit(values: SemesterFormValues) {
    if (editing) {
      await updateMutation.mutateAsync(values)
      cancelEdit()
    } else {
      await createMutation.mutateAsync(values)
      reset()
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  if (isLoading) return <SemestersPageSkeleton />

  return (
    <div className="space-y-6">
      <PageHeader title="Semester" description={`${semesters.length} semester terdaftar`} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        {isAdmin && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#0F172A]">
                {editing ? 'Edit Semester' : 'Tambah Semester'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sem-name">Nama</Label>
                  <Input id="sem-name" placeholder="Semester Ganjil" {...register('name')} />
                  {errors.name && <p className="text-xs text-[#EF4444]">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sem-year">Tahun Akademik</Label>
                  <Input id="sem-year" placeholder="2024/2025" {...register('academicYear')} />
                  {errors.academicYear && <p className="text-xs text-[#EF4444]">{errors.academicYear.message}</p>}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editing ? 'Simpan' : 'Tambah'}
                  </Button>
                  {editing && (
                    <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <div className={isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <DataTable
            data={semesters as unknown as Record<string, unknown>[]}
            searchable
            searchPlaceholder="Cari semester..."
            searchKeys={['name', 'academicYear']}
            columns={[
              {
                key: 'name',
                header: 'Nama',
                render: (row) => {
                  const s = row as unknown as Semester
                  return <span className="font-medium text-[#0F172A]">{s.name}</span>
                },
              },
              {
                key: 'academicYear',
                header: 'Tahun Akademik',
                render: (row) => {
                  const s = row as unknown as Semester
                  return <Badge variant="secondary">{s.academicYear}</Badge>
                },
              },
              ...(isAdmin
                ? [
                    {
                      key: 'actions',
                      header: '',
                      className: 'w-[100px]',
                      render: (row: Record<string, unknown>) => {
                        const s = row as unknown as Semester
                        return (
                          <div className="flex items-center gap-1 justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(s)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <ConfirmDialog
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10 transition-colors duration-200"
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              }
                              title="Hapus Semester"
                              description={`Yakin ingin menghapus "${s.name}"? Tindakan ini tidak dapat dibatalkan.`}
                              confirmLabel="Hapus"
                              onConfirm={() => deleteMutation.mutateAsync(s.id)}
                            />
                          </div>
                        )
                      },
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function SemestersPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 bg-[#E2E8F0]" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-lg bg-[#E2E8F0]" />
        <div className="lg:col-span-2 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded bg-[#E2E8F0]" />
          ))}
        </div>
      </div>
    </div>
  )
}