'use client'

import { useRef, useState } from 'react'
import { ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThumbnailUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  className?: string
  aspectRatio?: 'video' | 'square'
  maxSizeMb?: number
  label?: string
}

export function ThumbnailUpload({
  value,
  onChange,
  className,
  aspectRatio = 'video',
  maxSizeMb = 2,
  label = 'Thumbnail',
}: ThumbnailUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const preview = value instanceof File
    ? URL.createObjectURL(value)
    : typeof value === 'string' ? value : null

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > maxSizeMb * 1024 * 1024) {
      setSizeError(`Ukuran file maks ${maxSizeMb} MB`)
      return
    }
    setSizeError(null)
    onChange(file)
    e.target.value = ''
  }

  function handleClear() {
    onChange(null)
    setSizeError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className={cn('space-y-2', className)}>
      {preview ? (
        <div className={cn(
          'relative w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]',
          aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'
        )}>
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            onClick={handleClear}
            className="absolute top-2 right-2 shadow-sm"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={cn(
            'group flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#FAFBFD] transition-all duration-200',
            'hover:border-[#4B5CF0]/40 hover:bg-[#F8FAFC]',
            aspectRatio === 'video' ? 'aspect-video' : 'aspect-square',
          )}
        >
          <div className="inline-flex items-center justify-center size-12 rounded-xl bg-[#F1F5F9] mb-3 group-hover:bg-[#EEF1FF] transition-colors duration-200">
            <ImageIcon className="h-5 w-5 text-[#94A3B8] group-hover:text-[#4B5CF0] transition-colors duration-200" />
          </div>
          <span className="text-sm font-medium text-[#64748B]">Klik untuk pilih gambar</span>
          <span className="text-xs text-[#94A3B8] mt-1">JPG, PNG, WebP · Maks {maxSizeMb} MB</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      {sizeError && <p className="text-xs font-medium text-[#EF4444]">{sizeError}</p>}
    </div>
  )
}