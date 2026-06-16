'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export interface MultiSelectOption {
  value: string | number
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: (string | number)[]
  onChange: (selected: (string | number)[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Pilih...',
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggle(value: string | number) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  function removeItem(value: string | number, e: React.MouseEvent) {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  const selectedLabels = options.filter((o) => selected.includes(o.value))

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {selectedLabels.length > 0
          ? selectedLabels.map((item) => (
              <Badge key={item.value} variant="secondary" className="gap-1 pr-1">
                {item.label}
                <button type="button" onClick={(e) => removeItem(item.value, e)}
                  className="ml-0.5 hover:text-foreground rounded-sm">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          : <span className="text-muted-foreground">{placeholder}</span>}
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground ml-auto shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">Tidak ada pilihan</div>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option.value)
              return (
                <div
                  key={option.value}
                  onClick={() => toggle(option.value)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
                >
                  <div className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border shrink-0',
                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground',
                  )}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  {option.label}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
