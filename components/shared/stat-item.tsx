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
    <div className={cn(
      'rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm space-y-1',
      className
    )}>
      {icon && <div className="text-[#4B5CF0]">{icon}</div>}
      <p className="text-2xl font-bold tabular-nums text-[#0F172A]">{value}</p>
      <p className="text-sm font-medium text-[#64748B]">{label}</p>
      {description && (
        <p className="text-xs text-[#64748B]">{description}</p>
      )}
    </div>
  )
}