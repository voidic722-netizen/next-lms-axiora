import { useState, useCallback } from 'react'
import { resolveMaxFileSizeBytes } from '@/utils/format'

export interface StagedFile {
  file: File
  id: string
}

interface UseFileUploadOptions {
  /** Raw max_file_size value from the backend (unit ambiguous — resolved internally) */
  maxFileSizeRaw: number
}

/**
 * Manages file staging before submission.
 *
 * FIX applied: The original hook used a fake setInterval progress simulation
 * that added files to state before any upload occurred. This was replaced with
 * instant staging — the file is added immediately on drop/select with no fake
 * progress bar. Real upload progress (via Axios onUploadProgress) is shown
 * during actual form submission in the parent component.
 */
export function useFileUpload({ maxFileSizeRaw }: UseFileUploadOptions) {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const maxBytes = resolveMaxFileSizeBytes(maxFileSizeRaw)

  const addFiles = useCallback(
    (newFiles: File[]) => {
      setSizeError(null)

      const oversized = newFiles.filter((f) => f.size > maxBytes)
      if (oversized.length > 0) {
        const names = oversized.map((f) => f.name).join(', ')
        setSizeError(
          `File berikut melebihi batas ukuran (${maxFileSizeRaw} MB): ${names}`,
        )
        return
      }

      const staged: StagedFile[] = newFiles.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
      }))

      setStagedFiles((prev) => [...prev, ...staged])
    },
    [maxBytes, maxFileSizeRaw],
  )

  const removeFile = useCallback((id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearFiles = useCallback(() => {
    setStagedFiles([])
    setSizeError(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) addFiles(files)
    },
    [addFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragActive(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) addFiles(files)
      // Reset input so the same file can be re-selected
      e.target.value = ''
    },
    [addFiles],
  )

  return {
    stagedFiles,
    dragActive,
    sizeError,
    addFiles,
    removeFile,
    clearFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleInputChange,
  }
}
