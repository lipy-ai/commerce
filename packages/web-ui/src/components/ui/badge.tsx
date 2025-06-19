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
			},
			size: {
				small: "py-0.5 px-1 text-xs",
				default: "p-1 text-sm",
				large: "p-1 text-sm",
			},
			dot: {
				true: "pl-1.5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant, size, dot, icon, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					badgeVariants({ variant, size, dot }),
					className,
					"text-sm lg:text-xs leading-tight",
				)}
				{...props}
			>
				{dot && (
					<span
						className={cn(
							"mr-1.5 h-2 w-2 rounded-full",
							variant === "outline" ? "bg-foreground" : "bg-current",
						)}
					/>
				)}
				{icon && <span className="mr-1.5">{icon}</span>}
				{children}
			</div>
		);
	},
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
