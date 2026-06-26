import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[5rem] w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] shadow-sm resize-y transition-all duration-200 outline-none",
        "placeholder:text-[#94A3B8]",
        "selection:bg-[#4B5CF0]/20 selection:text-[#4B5CF0]",
        "hover:border-[#CBD5E1]",
        "focus-visible:border-[#4B5CF0] focus-visible:ring-[3px] focus-visible:ring-[#4B5CF0]/10 focus-visible:shadow-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[#EF4444] aria-invalid:ring-[#EF4444]/10",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }