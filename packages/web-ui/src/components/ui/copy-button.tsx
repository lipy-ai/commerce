"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@lipy/web-ui/components/ui/button";

import { cn } from "@lipy/web-ui/lib/utils";

type T = Parameters<typeof Button>[0];
interface CopyButtonProps extends T {
	value: string;
}

export async function copyToClipboardWithMeta(value: string) {
	navigator.clipboard.writeText(value);
}

export function CopyButton({
	value,
	className,
	variant = "ghost",
	...props
}: CopyButtonProps) {
	const [hasCopied, setHasCopied] = React.useState(false);

	React.useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);

	return (
		<Button
			size="icon"
			type="button"
			variant={variant}
			className={cn("relative z-10 h-6 w-6 ", className)}
			onClick={() => {
				copyToClipboardWithMeta(value);
				setHasCopied(true);
			}}
			{...props}
		>
			<span className="sr-only">Copy</span>
			{hasCopied ? (
				<CheckIcon className="size-4" />
			) : (
				<ClipboardIcon className="size-4" />
			)}
		</Button>
	);
}
