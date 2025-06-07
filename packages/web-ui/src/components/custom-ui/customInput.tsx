import * as React from "react";

import { cn } from "@lipy/web-ui/lib/utils";

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	size?: "lg" | "default";
	prefixEl?: any;
	prefixClassName?: string;
	suffixEl?: any;
	suffixClassName?: string;
	onClear?: () => void;

	noStyle?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			prefixClassName,
			type,
			suffixEl,
			prefixEl,
			size,
			noStyle,
			onClear,
			onChange,
			...props
		},
		ref,
	) => {
		const [hasValue, setHasValue] = React.useState(
			Boolean(props.value || props.defaultValue),
		);
		const inputRef = React.useRef<HTMLInputElement>(null);
		const combinedRef = React.useMemo(() => {
			if (typeof ref === "function") {
				return (node: HTMLInputElement) => {
					inputRef.current = node;
					ref(node);
				};
			}
			if (ref) {
				return (node: HTMLInputElement) => {
					inputRef.current = node;
					ref.current = node;
				};
			}
			return inputRef;
		}, [ref]);

		const handleClear = () => {
			if (inputRef.current) {
				// Clear the input value
				inputRef.current.value = "";
				setHasValue(false);

				// Create a synthetic React change event
				const event = {
					target: inputRef.current,
					currentTarget: inputRef.current,
					bubbles: true,
					cancelable: true,
					type: "input",
					nativeEvent: new Event("input"),
					isDefaultPrevented: () => false,
					isPropagationStopped: () => false,
					persist: () => {},
				} as React.ChangeEvent<HTMLInputElement>;

				// Call onChange if provided
				if (onChange) {
					onChange(event);
				}

				// Call onClear callback if provided
				if (onClear) {
					onClear();
				}

				// Focus the input after clearing
				inputRef.current.focus();
			}
		};

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setHasValue(Boolean(e.target.value));
			if (onChange) {
				onChange(e);
			}
		};

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
							"flex h-12 md:h-10 items-center p-2 [&>svg]:w-5",
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
						!suffixEl && "pr-3",
						!prefixEl && "pl-3",
						size === "lg" && "h-12",
						noStyle && "h-fit w-fit",
					)}
					ref={combinedRef}
					onChange={handleChange}
					{...props}
				/>

				<span className="text-sm">
					{suffixEl && hasValue && (
						<span
							className={cn(
								"text-muted-foreground flex h-12 md:h-10 items-center px-2 [&>svg]:w-4 cursor-pointer hover:text-foreground transition-colors",
								size === "lg" && "h-12",
								prefixClassName,
							)}
							onClick={handleClear}
						>
							{suffixEl}
						</span>
					)}
				</span>
			</div>
		);
	},
);
CustomInput.displayName = "CustomInput";

export { CustomInput };
