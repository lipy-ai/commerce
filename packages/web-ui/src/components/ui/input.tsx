import * as React from "react";

import { cn } from "@lipy/web-ui/lib/utils";

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	size?: "lg" | "default";
	prefixEl?: any;
	prefixClassName?: string;
	inputClassName?: string;
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
			inputClassName,
			...props
		},
		ref,
	) => {
		return (
			<div
				className={cn(
					"selection:bg-primary selection:text-primary-foreground h-10",
					"border-input bg-background focus-within:border-ring text-base relative focus-within:ring-ring flex items-center overflow-hidden rounded-md border focus-within:outline-none focus-within:ring-1",
					noStyle && "border-none bg-transparent rounded-none",
					size === "lg" && "h-12 text-lg",

					className,
				)}
			>
				{prefixEl && (
					<span
						className={cn(
							"inline-flex items-center px-2.5 [&>svg]:w-5 absolute appearance-none size-10",
							"text-base leading-0 align-middle ",
							size === "lg" && "text-lg size-12",

							prefixClassName,
						)}
					>
						{prefixEl}
					</span>
				)}
				<input
					type={type}
					className={cn(
						"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
						"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
						"placeholder:text-muted-foreground flex-1 flex h-full shadow-none w-full bg-transparent py-1 text-base outline-none transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
						!suffixEl && size === "lg" ? "pl-11" : "pl-10",
						!prefixEl && size === "lg" ? "pr-11" : "pr-10",
						size === "lg" && "text-lg",
						noStyle && "h-fit w-fit",
						inputClassName,
					)}
					ref={ref}
					{...props}
				/>

				<span className="text-sm ">
					{suffixEl && (
						<span
							className={cn(
								"inline-flex items-center px-1 [&>svg]:w-5 absolute appearance-none right-0 top-0 h-full w-fit",
								size === "lg" && "text-lg",
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
