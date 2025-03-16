import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] selection:bg-[hsl(var(--primary))] selection:text-[hsl(var(--primary-foreground))] dark:bg-input/30 border-[hsl(var(--input))] flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[hsl(var(--ring))] focus-visible:ring-[hsl(var(--ring))]/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-[hsl(var(--destructive))]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
