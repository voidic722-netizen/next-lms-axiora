import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E2E8F0]/60 mb-6',
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] text-balance">{title}</h1>
        {description && (
          <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}