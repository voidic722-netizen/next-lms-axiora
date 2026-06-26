'use client'

import { useRef, useState } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { ImageIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import type { FacultyFormValues } from '@/features/faculties/schemas/faculty-schema'

interface FacultyFormFieldsProps {
  form: UseFormReturn<FacultyFormValues>
  existingThumbnail?: string | null
}

export function FacultyFormFields({ form, existingThumbnail }: FacultyFormFieldsProps) {
  const { setValue } = form
  const [preview, setPreview] = useState<string | null>(existingThumbnail ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setValue('thumbnail', file, { shouldValidate: true })
    setPreview(URL.createObjectURL(file))
  }

  function clearThumbnail() {
    setValue('thumbnail', undefined)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Fakultas</FormLabel>
            <FormControl>
              <Input placeholder="Fakultas Teknik" {...field} />
            </FormControl>
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
              <Textarea rows={3} placeholder="Deskripsi singkat fakultas..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="thumbnail"
        render={({ field: { value, onChange, ref, ...field } }) => (
          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
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
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-[#E2E8F0] hover:border-[#4B5CF0]/50 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <ImageIcon className="h-8 w-8 text-[#64748B] mb-2" />
                    <span className="text-sm text-[#64748B]">Klik untuk pilih gambar</span>
                    <span className="text-xs text-[#64748B] mt-1">JPG, PNG, WebP · Maks 2 MB</span>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFile}
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}