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
    <Card className="border border-[#E2E8F0] bg-white shadow-sm hover:border-[#4B5CF0] hover:shadow-md transition-all duration-200">
      <CardContent className="py-3 px-4 flex items-center gap-3">
        <FileText className="h-5 w-5 text-[#4B5CF0] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#0F172A] truncate">{name}</p>
          <p className="text-xs text-[#64748B]">
            {format.toUpperCase()} · {fileSize}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#64748B] hover:text-[#4B5CF0] hover:bg-[#EEF1FF]"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#EF4444] hover:text-[#DC2626] hover:bg-[#EF4444]/10"
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