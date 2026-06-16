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
    <div className={cn('space-y-1.5', className)}>
      {preview ? (
        <div className={cn(
          'relative w-full overflow-hidden rounded-lg border bg-[#F8FAFC]',
          aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'
        )}>
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleClear}
            className="absolute top-2 right-2 h-7 w-7 hover:bg-[#DC2626] transition-colors duration-200"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-[#E2E8F0] transition-all duration-200',
            'hover:border-[#4B5CF0]/50 hover:bg-[#F8FAFC]',
            aspectRatio === 'video' ? 'aspect-video' : 'aspect-square',
          )}
        >
          <ImageIcon className="h-8 w-8 text-[#64748B] mb-2" />
          <span className="text-sm text-[#64748B]">Klik untuk pilih gambar</span>
          <span className="text-xs text-[#64748B] mt-1">JPG, PNG, WebP · Maks {maxSizeMb} MB</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      {sizeError && <p className="text-xs text-[#EF4444]">{sizeError}</p>}
    </div>
  )
}