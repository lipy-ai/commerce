import * as React from "react";

import { cn } from "@lipy/web-ui/lib/utils";

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	size?: "lg" | "default";
	prefixEl?: any;
	prefixClassName?: string;
	suffixEl?: any;
	suffixClassName?: string;

	noStyle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			prefixClassName,
			type,
			suffixEl,
			prefixEl,
			size,
			noStyle,
			...props
		},
		ref,
	) => {
		return (
			<div
				className={cn(
					"border-input bg-background focus-within:border-ring focus-within:ring-ring flex items-center overflow-hidden rounded-md border focus-within:outline-none focus-within:ring-1",
					noStyle && "border-none bg-transparent rounded-none",
					className,
				)}
			>
				{prefixEl && (
					<span
						className={cn(
							"flex h-12 md:h-10 items-center p-2 [&>svg]:w-5 text-muted-foreground text-base",
							size === "lg" && "h-12",
							prefixClassName,
						)}
					>
						{prefixEl}
					</span>
				)}
				<input
					type={type}
					className={cn(
						"placeholder:text-muted-foreground flex-1 flex h-12 md:h-10 shadow-none w-full bg-transparent py-1 text-base outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
						!suffixEl && "pr-2",
						!prefixEl && "pl-2",
						size === "lg" && "h-12",
						noStyle && "h-fit w-fit",
					)}
					ref={ref}
					{...props}
				/>

				<span className="text-sm">
					{suffixEl && (
						<span
							className={cn(
								"text-muted-foreground flex h-12 md:h-10 items-center px-2 [&>svg]:w-4",
								size === "lg" && "h-12",
								prefixClassName,
							)}
							onClick={() => {}}
						>
							{suffixEl}
						</span>
					)}
				</span>
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
