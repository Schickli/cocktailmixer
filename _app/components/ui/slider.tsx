"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none",
      "data-[orientation-'horizontal']:h-1.5 data-[orientation='horizontal']:w-full data-[orientation='horizontal']:items-center",
      "data-[orientation-'vertical']:w-1.5 data-[orientation='vertical']:h-full data-[orientation='vertical']:justify-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative grow overflow-hidden rounded-3xl bg-primary/20",
        "data-[orientation='horizontal']:h-1.5 data-[orientation='horizontal']:w-full",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1.5"
      )}
    >
   <div className="absolute text-white mix-blend-difference z-50 w-full h-full flex items-center justify-center">{props.text}</div>
      <SliderPrimitive.Range
        className={cn(
          "absolute bg-primary",
          "data-[orientation='horizontal']:h-full",
          "data-[orientation='vertical']:w-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="data-[orientation='horizontal']:block  data-[orientation='vertical']:invisible h-4 w-4 rounded-3xl border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }