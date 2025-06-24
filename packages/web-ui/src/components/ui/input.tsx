import { cn } from "@lipy/web-ui/lib/utils";
import * as React from "react";

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	size?: "lg" | "default";
	prefixEl?: React.ReactNode;
	prefixClassName?: string;
	inputClassName?: string;
	suffixEl?: React.ReactNode;
	suffixClassName?: string;
	noStyle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			prefixClassName,
			suffixClassName,
			inputClassName,
			prefixEl,
			suffixEl,
			size = "default",
			noStyle,
			type,
			...props
		},
		ref,
	) => {
		const hasPrefix = !!prefixEl;
		const hasSuffix = !!suffixEl;

		return (
			<div
				className={cn(
					"selection:bg-primary selection:text-primary-foreground",
					"relative flex items-center overflow-hidden rounded-md border text-base",
					"bg-background border-input focus-within:ring-1 focus-within:ring-ring focus-within:border-ring",
					"transition-colors focus-within:outline-none",
					size === "lg" ? "h-12 text-lg" : "h-10",
					noStyle && "border-none bg-transparent rounded-none",
					className,
				)}
			>
				{hasPrefix && (
					<div
						className={cn(
							"flex items-center px-2.5 text-muted-foreground",
							size === "lg" ? "h-12" : "h-10",
							prefixClassName,
						)}
					>
						{prefixEl}
					</div>
				)}

				<input
					ref={ref}
					type={type}
					className={cn(
						"flex-1 w-full h-full bg-transparent outline-none shadow-none transition-colors",
						"text-base placeholder:text-muted-foreground",
						"focus-visible:ring-0 focus-visible:shadow-[0_-3px_0_0_theme('colors.ring.DEFAULT'),0_3px_0_0_theme('colors.ring.DEFAULT')] focus-visible:ring-ring/50 focus-visible:border-ring",
						"aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
						"file:border-0 file:bg-transparent file:text-base file:font-medium",
						"disabled:cursor-not-allowed disabled:opacity-50",
						hasPrefix ? "pl-2" : "pl-4",
						hasSuffix ? "pr-2" : "pr-4",
						size === "lg" && "text-lg",
						noStyle && "h-fit w-fit",
						inputClassName,
					)}
					{...props}
				/>

				{hasSuffix && (
					<div
						className={cn(
							"flex items-center px-2 text-muted-foreground",
							size === "lg" ? "h-12" : "h-10",
							suffixClassName,
						)}
					>
						{suffixEl}
					</div>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
export { Input };
