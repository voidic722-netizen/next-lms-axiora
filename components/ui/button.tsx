import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-[0.97] outline-none focus-visible:ring-[3px] focus-visible:ring-[#4B5CF0]/15 disabled:pointer-events-none disabled:opacity-50 disabled:scale-100 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-[#5C6DF2] to-[#4B5CF0] text-white shadow-[0_2px_10px_rgb(75,92,240,0.3)] hover:shadow-[0_4px_15px_rgb(75,92,240,0.4)] hover:-translate-y-[1px] hover:from-[#6576F4] hover:to-[#5565ED] active:translate-y-[0px] active:shadow-none border border-[#4B5CF0]/20",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_2px_10px_rgb(239,68,68,0.3)] hover:shadow-[0_4px_15px_rgb(239,68,68,0.4)] hover:-translate-y-[1px] focus-visible:ring-red-500/20",
        outline:
          "border border-slate-200/80 bg-white/50 backdrop-blur-sm shadow-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:shadow-md hover:-translate-y-[1px]",
        secondary:
          "bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100/80 hover:-translate-y-[1px] transition-all",
        ghost:
          "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900",
        link: "text-[#4B5CF0] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
