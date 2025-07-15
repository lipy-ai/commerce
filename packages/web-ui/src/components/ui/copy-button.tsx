"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@lipy/web-ui/components/ui/button";

import { cn } from "@lipy/web-ui/lib/utils";

type T = Parameters<typeof Button>[0];
interface CopyButtonProps extends T {
	value: string;
	icon?: React.ReactNode;
}

export async function copyToClipboardWithMeta(value: string) {
	navigator.clipboard.writeText(value);
}

export function CopyButton({
	value,
	className,
	size = "icon-sm",
	variant = "ghost",
	icon,
	...props
}: CopyButtonProps) {
	const [hasCopied, setHasCopied] = React.useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);

	return (
		<Button
			size={size}
			type="button"
			variant={variant}
			className={cn("relative z-10", className)}
			onClick={() => {
				copyToClipboardWithMeta(value);
				setHasCopied(true);
			}}
			{...props}
		>
			<span className="sr-only">Copy</span>
			{hasCopied ? <CheckIcon /> : icon ? icon : <ClipboardIcon />}
		</Button>
	);
}
