import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertMessageProps {
  title?: string
  message: string
  variant?: AlertVariant
  className?: string
}

const variantConfig: Record<AlertVariant, { icon: React.ReactNode; classes: string }> = {
  info: {
    icon: <Info className="h-4.5 w-4.5 text-[#4B5CF0] shrink-0" />,
    classes: 'bg-[#EEF1FF] border-[#C7D0FF] text-[#4B5CF0]',
  },
  success: {
    icon: <CheckCircle2 className="h-4.5 w-4.5 text-[#22C55E] shrink-0" />,
    classes: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]',
  },
  warning: {
    icon: <AlertTriangle className="h-4.5 w-4.5 text-[#F59E0B] shrink-0" />,
    classes: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]',
  },
  error: {
    icon: <AlertCircle className="h-4.5 w-4.5 text-[#EF4444] shrink-0" />,
    classes: 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]',
  },
}

export function AlertMessage({
  title,
  message,
  variant = 'info',
  className,
}: AlertMessageProps) {
  const { icon, classes } = variantConfig[variant]

  return (
    <div className={cn('flex gap-3 rounded-xl border p-4', classes, className)}>
      <span className="mt-0.5">{icon}</span>
      <div className="space-y-0.5">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  )
}