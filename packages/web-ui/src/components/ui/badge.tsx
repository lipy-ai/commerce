"use client";

import { cn } from "@lipy/web-ui/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/40 text-primary ring-primary",
        warning: "bg-amber-400 ring-amber-400",
        success: "bg-emerald-600/20 text-emerald-700",
        destructive: "bg-rose-700 ring-rose-700 text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline:
          "bg-background ring ring-inset text-foreground-light ring-border",
        info: "bg-blue-50 text-blue-700 ring-blue-200",
        neutral: "bg-gray-100 text-gray-700 ring-gray-200",
        premium:
          "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 ring-purple-200",
        accent: "bg-indigo-50 text-indigo-700 ring-indigo-200",
        muted: "bg-slate-100 text-slate-600 ring-slate-200",
        ghost: "bg-transparent text-foreground hover:bg-accent/50",
        subtle: "bg-purple-100 text-purple-700 ring-purple-200",
        elegant: "bg-zinc-900 text-zinc-100 ring-zinc-700",
        soft: "bg-gray-50 text-gray-600 ring-gray-100 border border-gray-200",
        professional: "bg-slate-800 text-slate-100 ring-slate-600",
        brand: "bg-blue-600 text-white ring-blue-500",
        status:
          "bg-green-50 text-green-800 ring-green-200 border border-green-100",
      },
      size: {
        small: "py-0.5 px-1 text-xs",
        default: "p-1 text-sm",
        large: "p-1 text-sm",
        compact: "py-0.5 px-2 text-xs",
        spacious: "py-1.5 px-3 text-sm",
      },
      dot: {
        true: "pl-1.5",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
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

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, dot, rounded, icon, pulse, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, dot, rounded }),
          className,
          "text-sm lg:text-xs leading-tight",
          pulse && "animate-pulse"
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "mr-1.5 h-2 w-2 rounded-full",
              variant === "outline" || variant === "ghost" || variant === "soft"
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

Badge.displayName = "Badge";

export { Badge, badgeVariants };
