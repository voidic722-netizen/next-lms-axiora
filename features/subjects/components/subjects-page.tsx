'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, BookText, Loader2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/shared/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { withStorageUrl } from '@/lib/storage'
import { subjectSchema, type SubjectFormValues } from '../schemas/subject-schema'
import {
  useSubjects, useSubjectDetail, useCreateSubject,
  useUpdateSubject, useDeleteSubject,
} from '../hooks/use-subjects'
import { useDepartments } from '@/features/departments/hooks/use-departments'
import type { Subject } from '@/types/subject'

export function SubjectsPage() {
  const { isAdmin } = useAuth()
  const { data: subjects = [], isLoading } = useSubjects()
  const deleteMutation = useDeleteSubject()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  function openAddModal() {
    setEditingSubject(null)
    setIsModalOpen(true)
  }

  function openEditModal(s: Subject) {
    setEditingSubject(s)
    setIsModalOpen(true)
  }

  if (isLoading)
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl bg-slate-100" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mata Pelajaran"
        description={`${subjects.length} mata pelajaran`}
        action={
          isAdmin ? (
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />Tambah
            </Button>
          ) : undefined
        }
      />
      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <BookText className="h-12 w-12 text-[#64748B]/40" />
          <p className="text-[#64748B]">Belum ada mata pelajaran</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((s) => (
            <SubjectCard 
              key={s.id} 
              subject={s} 
              isAdmin={isAdmin} 
              onEdit={() => openEditModal(s)}
              onDelete={() => deleteMutation.mutateAsync(s.id)} 
            />
          ))}
        </div>
      )}

      {isAdmin && (
        <SubjectFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subject={editingSubject}
        />
      )}
    </div>
  )
}

function SubjectCard({
  subject: s,
  isAdmin,
  onEdit,
  onDelete,
}: {
  subject: Subject
  isAdmin: boolean
  onEdit: () => void
  onDelete: () => Promise<void>
}) {
  const thumb = withStorageUrl(s.thumbnail)
  return (
    <Card className="p-0 gap-0 overflow-hidden group border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
      <Link href={`/subjects/${s.id}`}>
        <div className="aspect-video bg-[#F8FAFC]">
          {thumb ? (
            <img
              src={thumb}
              alt={s.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookText className="h-10 w-10 text-[#64748B]/30" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/subjects/${s.id}`}>
            <h3 className="font-semibold text-[#0F172A] truncate hover:underline">{s.name}</h3>
          </Link>
          <Badge variant={s.type === 'compulsory' ? 'default' : 'secondary'} className="shrink-0">
            {s.type === 'compulsory' ? 'Wajib' : 'Umum'}
          </Badge>
        </div>
        <p className="text-sm text-[#64748B] line-clamp-2 mt-1">{s.description}</p>
        {isAdmin && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#E2E8F0]">
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />Edit
            </Button>
            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#EF4444] border-[#EF4444]/30 hover:border-[#EF4444]/50 hover:text-[#DC2626]"
                >
                  Hapus
                </Button>
              }
              title="Hapus Mata Pelajaran"
              description={`Yakin menghapus "${s.name}"?`}
              confirmLabel="Hapus"
              onConfirm={onDelete}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function SubjectDetailPage({ id }: { id: string }) {
  const { data: subject, isLoading } = useSubjectDetail(id)
  if (isLoading) return <Skeleton className="h-64 rounded-lg bg-[#E2E8F0]" />
  if (!subject) return <p className="text-[#64748B]">Mata pelajaran tidak ditemukan.</p>
  const thumb = withStorageUrl(subject.thumbnail)
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader title={subject.name} />
      <div className="grid gap-6 md:grid-cols-3 items-start">
        <div className="md:col-span-1">
          <Card className="p-0 gap-0 overflow-hidden border-[#E2E8F0]">
            <div className="w-full aspect-video md:aspect-square bg-slate-50 flex items-center justify-center border-b border-[#E2E8F0]">
              {thumb ? (
                <img src={thumb} alt={subject.name} className="w-full h-full object-cover" />
              ) : (
                <BookText className="h-12 w-12 text-slate-300" />
              )}
            </div>
            <CardContent className="p-4 flex flex-col gap-4">
              <Badge variant={subject.type === 'compulsory' ? 'default' : 'secondary'} className="w-full justify-center text-sm py-1">
                {subject.type === 'compulsory' ? 'Mata Pelajaran Wajib' : 'Mata Pelajaran Umum'}
              </Badge>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Tentang Mata Pelajaran</h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base">
                <p className="whitespace-pre-wrap">{subject.description || 'Belum ada deskripsi untuk mata pelajaran ini.'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { handleApiError } from '@/lib/error-handler'

function SubjectForm({
  form,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
}: {
  form: any
  onSubmit: (v: SubjectFormValues) => Promise<void>
  isPending: boolean
  submitLabel: string
  onCancel: () => void
  initialPreview?: string | null
}) {
  const { data: departments = [] } = useDepartments()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(initialPreview || null)

  function clearThumbnail() {
    form.setValue('thumbnail', undefined)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Algoritma & Pemrograman" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="compulsory">Wajib</SelectItem>
                  <SelectItem value="general">Umum</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jurusan (opsional)</FormLabel>
              <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jurusan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field: { value, onChange, ref, ...field } }) => (
            <FormItem>
              <FormLabel>Thumbnail (opsional)</FormLabel>
              <FormControl>
                <div>
                  {preview ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={clearThumbnail}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                      Pilih Gambar
                    </Button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      form.setValue('thumbnail', f)
                      setPreview(URL.createObjectURL(f))
                    }}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function SubjectFormModal({ isOpen, onClose, subject }: {
  isOpen: boolean
  onClose: () => void
  subject?: Subject | null
}) {
  const isEditing = !!subject
  const createMutation = useCreateSubject()
  const updateMutation = useUpdateSubject(subject?.id ?? 0)
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    values: subject
      ? ({
          name: subject.name,
          type: subject.type as 'general' | 'compulsory',
          description: subject.description,
          departmentId: subject.departmentId ?? undefined,
        } as any)
      : undefined,
  })

  async function onSubmit(v: SubjectFormValues) {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(v as any)
      } else {
        await createMutation.mutateAsync(v as any)
      }
      form.reset()
      onClose()
    } catch (error) {
      handleApiError(error, form.setError)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SubjectForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            submitLabel={isEditing ? 'Simpan Perubahan' : 'Simpan'}
            onCancel={onClose}
            initialPreview={subject?.thumbnail ? withStorageUrl(subject.thumbnail) : null}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}