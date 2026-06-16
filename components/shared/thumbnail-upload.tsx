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
        <div className={cn('relative w-full overflow-hidden rounded-lg border bg-muted', aspectRatio === 'video' ? 'aspect-video' : 'aspect-square')}>
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <Button type="button" variant="destructive" size="icon" onClick={handleClear}
            className="absolute top-2 right-2 h-7 w-7">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-border',
            'hover:border-primary/50 hover:bg-muted/50 transition-colors',
            aspectRatio === 'video' ? 'aspect-video' : 'aspect-square',
          )}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Klik untuk pilih gambar</span>
          <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP · Maks {maxSizeMb} MB</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
        className="hidden" onChange={handleFile} />
      {sizeError && <p className="text-xs text-destructive">{sizeError}</p>}
    </div>
  )
}
