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
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm transition-all duration-200',
          'focus-visible:outline-none focus-visible:border-[#4B5CF0] focus-visible:ring-2 focus-visible:ring-[#4B5CF0]/20',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {selectedLabels.length > 0
          ? selectedLabels.map((item) => (
              <Badge key={item.value} variant="secondary" className="gap-1 pr-1">
                {item.label}
                <button
                  type="button"
                  onClick={(e) => removeItem(item.value, e)}
                  className="ml-0.5 hover:text-[#0F172A] rounded-sm transition-colors duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          : <span className="text-[#64748B]">{placeholder}</span>}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[#64748B] ml-auto shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="py-6 text-center text-sm text-[#64748B]">Tidak ada pilihan</div>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option.value)
              return (
                <div
                  key={option.value}
                  onClick={() => toggle(option.value)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#0F172A] cursor-pointer hover:bg-[#F8FAFC] transition-colors duration-200"
                >
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border shrink-0 transition-colors duration-200',
                      isSelected
                        ? 'border-[#4B5CF0] bg-[#4B5CF0] text-white'
                        : 'border-[#E2E8F0] bg-white',
                    )}
                  >
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