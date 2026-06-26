'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2, Loader2, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { handleApiError } from '@/lib/error-handler'
import { semesterSchema, type SemesterFormValues } from '../schemas/semester-schema'
import { useSemesters, useCreateSemester, useUpdateSemester, useDeleteSemester } from '../hooks/use-semesters'
import type { Semester } from '@/types/semester'

export function SemestersPage() {
  const { isAdmin } = useAuth()
  const { data: semesters = [], isLoading } = useSemesters()
  const createMutation = useCreateSemester()
  const deleteMutation = useDeleteSemester()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<Semester | null>(null)

  const form = useForm<SemesterFormValues>({ resolver: zodResolver(semesterSchema) })

  const updateMutation = useUpdateSemester(editing?.id ?? 0)

  function openAddModal() {
    setEditing(null)
    form.reset({ name: '', academicYear: '', startDate: '', endDate: '' })
    setIsModalOpen(true)
  }

  function startEdit(sem: Semester) {
    setEditing(sem)
    form.reset({
      name: sem.name,
      academicYear: sem.academicYear,
      startDate: sem.startDate?.split('T')[0] ?? '',
      endDate: sem.endDate?.split('T')[0] ?? '',
    })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditing(null)
    form.reset({ name: '', academicYear: '', startDate: '', endDate: '' })
  }

  async function onSubmit(values: SemesterFormValues) {
    try {
      if (editing) {
        await updateMutation.mutateAsync(values)
      } else {
        await createMutation.mutateAsync(values)
      }
      closeModal()
    } catch (error) {
      handleApiError(error, form.setError)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  if (isLoading) return <SemestersPageSkeleton />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Semester"
        description={`${semesters.length} semester terdaftar`}
        action={
          isAdmin ? (
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />Tambah Semester
            </Button>
          ) : undefined
        }
      />

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

      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Semester' : 'Tambah Semester'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="Semester Ganjil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun Akademik</FormLabel>
                      <FormControl>
                        <Input placeholder="2024/2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Selesai</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={closeModal} disabled={isPending}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editing ? 'Simpan Perubahan' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
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