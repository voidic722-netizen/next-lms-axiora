'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FacultyFormFields } from './faculty-form-fields'
import { useCreateFaculty, useUpdateFaculty, useFacultyDetail } from '@/features/faculties/hooks/use-faculties'
import { facultySchema, type FacultyFormValues } from '@/features/faculties/schemas/faculty-schema'

export function AddFacultyPage() {
  const router = useRouter()
  const mutation = useCreateFaculty()
  const form = useForm<FacultyFormValues>({ resolver: zodResolver(facultySchema) })

  async function onSubmit(values: FacultyFormValues) {
    await mutation.mutateAsync(values)
    router.push('/faculties')
  }

  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Tambah Fakultas" />
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FacultyFormFields form={form} />
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function EditFacultyPage({ id }: { id: string }) {
  const router = useRouter()
  const { data: faculty, isLoading } = useFacultyDetail(id)
  const mutation = useUpdateFaculty(Number(id))

  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    values: faculty ? { name: faculty.name, description: faculty.description } : undefined,
  })

  async function onSubmit(values: FacultyFormValues) {
    await mutation.mutateAsync(values)
    router.push(`/faculties/${id}`)
  }

  if (isLoading) return <Skeleton className="h-96 rounded-lg max-w-xl" />

  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Edit Fakultas" />
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FacultyFormFields form={form} existingThumbnail={faculty?.thumbnail} />
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
