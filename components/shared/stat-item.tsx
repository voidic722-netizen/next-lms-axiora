import { cn } from '@/lib/utils'

interface StatItemProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  className?: string
}

export function StatItem({ label, value, icon, description, className }: StatItemProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-4 space-y-1', className)}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
