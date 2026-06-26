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
      'rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-premium hover:shadow-premium-hover transition-all duration-200 space-y-3',
      className
    )}>
      {icon && (
        <div className="inline-flex items-center justify-center size-10 rounded-lg bg-[#EEF1FF] text-[#4B5CF0]">
          {icon}
        </div>
      )}
      <div className="space-y-0.5">
        <p className="text-2xl font-bold tabular-nums tracking-tight text-[#0F172A]">{value}</p>
        <p className="text-sm font-medium text-[#64748B]">{label}</p>
        {description && (
          <p className="text-xs text-[#64748B]/80 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}