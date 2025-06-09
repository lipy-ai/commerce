import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@lipy/web-ui/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5  shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				// Original variants
				default:
					"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive:
					"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",

				// New color variants for grocery app
				green:
					"bg-green-600 text-white shadow-xs hover:bg-green-700 focus-visible:ring-green-500/20 dark:bg-green-600 dark:hover:bg-green-700",
				emerald:
					"bg-emerald-700 text-white shadow-xs hover:bg-emerald-800 focus-visible:ring-emerald-500/20 dark:bg-emerald-600 dark:hover:bg-emerald-700",
				black:
					"bg-black text-white shadow-xs hover:bg-gray-800 focus-visible:ring-gray-500/20 dark:bg-gray-900 dark:hover:bg-gray-800",
				orange:
					"bg-orange-600 text-white shadow-xs hover:bg-orange-700 focus-visible:ring-orange-500/20 dark:bg-orange-600 dark:hover:bg-orange-700",
				amber:
					"bg-amber-600 text-white shadow-xs hover:bg-amber-700 focus-visible:ring-amber-500/20 dark:bg-amber-600 dark:hover:bg-amber-700",
				blue: "bg-blue-600 text-white shadow-xs hover:bg-blue-700 focus-visible:ring-blue-500/20 dark:bg-blue-600 dark:hover:bg-blue-700",
				indigo:
					"bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 focus-visible:ring-indigo-500/20 dark:bg-indigo-600 dark:hover:bg-indigo-700",
				purple:
					"bg-purple-600 text-white shadow-xs hover:bg-purple-700 focus-visible:ring-purple-500/20 dark:bg-purple-600 dark:hover:bg-purple-700",
				pink: "bg-pink-600 text-white shadow-xs hover:bg-pink-700 focus-visible:ring-pink-500/20 dark:bg-pink-600 dark:hover:bg-pink-700",
				rose: "bg-rose-600 text-white shadow-xs hover:bg-rose-700 focus-visible:ring-rose-500/20 dark:bg-rose-600 dark:hover:bg-rose-700",
				teal: "bg-teal-600 text-white shadow-xs hover:bg-teal-700 focus-visible:ring-teal-500/20 dark:bg-teal-600 dark:hover:bg-teal-700",
				cyan: "bg-cyan-600 text-white shadow-xs hover:bg-cyan-700 focus-visible:ring-cyan-500/20 dark:bg-cyan-600 dark:hover:bg-cyan-700",

				// Outline variants for colors
				"green-outline":
					"border-2 border-green-600 text-green-600 bg-transparent shadow-xs hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 dark:text-green-400 dark:border-green-500",
				"orange-outline":
					"border-2 border-orange-600 text-orange-600 bg-transparent shadow-xs hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950 dark:text-orange-400 dark:border-orange-500",
				"blue-outline":
					"border-2 border-blue-600 text-blue-600 bg-transparent shadow-xs hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:text-blue-400 dark:border-blue-500",
				"black-outline":
					"border-2 border-gray-800 text-gray-800 bg-transparent shadow-xs hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-950 dark:text-gray-200 dark:border-gray-600",

				// Grocery-specific variants
				success:
					"bg-green-600 text-white shadow-xs hover:bg-green-700 focus-visible:ring-green-500/20",
				warning:
					"bg-yellow-500 text-yellow-900 shadow-xs hover:bg-yellow-600 focus-visible:ring-yellow-500/20",
				info: "bg-blue-500 text-white shadow-xs hover:bg-blue-600 focus-visible:ring-blue-500/20",

				// Soft variants (lighter colors)
				"green-soft":
					"bg-green-100 text-green-800 shadow-xs hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50",
				"orange-soft":
					"bg-orange-100 text-orange-800 shadow-xs hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50",
				"blue-soft":
					"bg-blue-100 text-blue-800 shadow-xs hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50",
				"gray-soft":
					"bg-gray-100 text-gray-800 shadow-xs hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:hover:bg-gray-800/50",
			},
			size: {
				xs: "h-6 rounded px-2 text-xs gap-1 has-[>svg]:px-1.5",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				default: "h-10 px-4 py-2 has-[>svg]:px-3",
				lg: "h-12 rounded-md px-6 has-[>svg]:px-4",
				xl: "h-14 rounded-lg px-8 text-base has-[>svg]:px-6",
				icon: "size-10",
				"icon-sm": "size-8",
				"icon-lg": "size-12",
				"icon-xl": "size-14",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
