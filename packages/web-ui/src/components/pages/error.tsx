"use client";

import { ArrowLeft, type LucideIcon, RotateCcw, XCircle } from "lucide-react";

import { cn } from "@lipy/web-ui/lib/utils";

import { goBack } from "@lipy/web-ui/lib/router";
import { useRouter } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function ErrorPage({
	error,
	message,
	title,
	icon,
	className,
	reset,
}: {
	error?: Error & { digest?: string };
	message?: string;
	title?: string;
	icon?: LucideIcon;
	className?: string;
	reset: () => void;
}) {
	const router = useRouter();
	const Ico = icon || XCircle;
	return (
		<div
			className={cn(
				"m-auto flex w-full max-w-screen-lg flex-1 flex-col items-center justify-center p-4 text-center overflow-y-auto",
				className,
			)}
		>
			<Ico className="mb-2 size-20 opacity-70" strokeWidth={1.1} />
			<p className="break-all text-xl font-medium">
				{title || "Oh no, Something went wrong!"}
			</p>
			<Label className="text-md mx-auto my-2 max-w-md break-all font-light line-clamp-4">
				{message || error?.message || "We don't know what caused this error!"}
			</Label>
			<div className="my-6 space-x-4">
				<>
					<Button variant={"outline"} onClick={() => goBack()}>
						<ArrowLeft /> <span> Go Back</span>
					</Button>
					<Button
						variant={"outline"}
						onClick={() =>
							reset
								? reset()
								: router.navigate({
										to: router.state.location.pathname,
										replace: true,
									})
						}
					>
						<RotateCcw /> Try Again
					</Button>
				</>
			</div>
		</div>
	);
}
