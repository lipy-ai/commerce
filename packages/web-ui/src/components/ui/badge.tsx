"use client";

import { cn } from "@lipy/web-ui/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

export const badgeVariants = cva(
  "inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary ring-primary",
        secondary: "bg-secondary/10 text-secondary ring-secondary",
        success: "bg-emerald-100 text-emerald-800 ring-emerald-300",
        warning: "bg-yellow-100 text-yellow-800 ring-yellow-300",
        info: "bg-blue-100 text-blue-800 ring-blue-300",
        destructive: "bg-red-100 text-red-800 ring-red-300",
        progress: "bg-sky-100 text-sky-800 ring-sky-300",
        neutral: "bg-muted text-muted-foreground ring-border",
      },
      appearance: {
        solid: "",
        soft: "",
        outline: "border  ring-0 dark:border-white/10 border-gray-300",
        ghost: "bg-transparent ring-0",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-sm",
        lg: "px-3 py-1 text-base",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      dot: {
        true: "pl-1.5",
      },
    },
    compoundVariants: [
      {
        appearance: "solid",
        variant: "success",
        className: "bg-emerald-500 text-white ring-emerald-500",
      },
      {
        appearance: "solid",
        variant: "destructive",
        className: "bg-red-500 text-white ring-red-500",
      },
      {
        appearance: "solid",
        variant: "info",
        className: "bg-blue-500 text-white ring-blue-500",
      },
      {
        appearance: "solid",
        variant: "warning",
        className: "bg-yellow-400 text-white ring-yellow-400",
      },
      {
        appearance: "solid",
        variant: "progress",
        className: "bg-sky-500 text-white ring-sky-500",
      },
      {
        appearance: "solid",
        variant: "neutral",
        className: "bg-gray-500 text-white ring-gray-500",
      },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "soft",
      size: "default",
      rounded: "md",
    },
  }
);
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  pulse?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      appearance,
      size,
      dot,
      rounded,
      icon,
      pulse,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, appearance, size, dot, rounded }),
          className,
          "leading-tight",
          pulse && "animate-pulse"
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "mr-1.5 h-2 w-2 rounded-full",
              appearance === "outline" ||
                appearance === "ghost" ||
                appearance === "soft"
                ? "bg-foreground"
                : "bg-current",
              pulse && "animate-pulse"
            )}
          />
        )}
        {icon && <span className="mr-1.5">{icon}</span>}
        {children}
      </div>
    );
  }
);
