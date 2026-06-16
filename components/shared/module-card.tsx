'use client'

import { FileText, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { downloadFile } from '@/lib/download-file'
import { toast } from 'sonner'

interface ModuleCardProps {
  name: string
  filePath: string
  fileSize: string
  format: string
  onDelete?: () => void
  isDeleting?: boolean
}

export function ModuleCard({
  name,
  filePath,
  fileSize,
  format,
  onDelete,
  isDeleting,
}: ModuleCardProps) {
  async function handleDownload() {
    try {
      await downloadFile(filePath, name)
    } catch {
      toast.error('Gagal mengunduh file')
    }
  }

  return (
    <Card>
      <CardContent className="py-3 px-4 flex items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground">
            {format.toUpperCase()} · {fileSize}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
