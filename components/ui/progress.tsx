"use client";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

////

const progressVariants = cva(
  "h-full w-full flex-1 bg-primary transition-all", {
  variants: {
    variant: {
      default: "bg-sky-700",
      success: "bg-emerald-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface Props extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariants> {}
type CombinedProps = Props & React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>;

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, CombinedProps>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
