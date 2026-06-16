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
    icon: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
    classes: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />,
    classes: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
    classes: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
  },
  error: {
    icon: <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />,
    classes: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
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
    <div className={cn('flex gap-3 rounded-lg border p-3', classes, className)}>
      <span className="mt-0.5">{icon}</span>
      <div className="space-y-0.5">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}
