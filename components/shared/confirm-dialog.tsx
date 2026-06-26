'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ConfirmDialogProps {
  trigger: React.ReactNode
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => Promise<void> | void
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'destructive',
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent size="sm" className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)] p-6">
        <AlertDialogHeader>
          <AlertDialogMedia
            className={variant === 'destructive'
              ? 'bg-[#FEF2F2] text-[#EF4444]'
              : 'bg-[#EEF1FF] text-[#4B5CF0]'
            }
          >
            <AlertTriangle className="h-7 w-7" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-semibold text-[#0F172A]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#64748B] leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 pt-2">
          <AlertDialogCancel
            disabled={loading}
            className="border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            variant={variant}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}