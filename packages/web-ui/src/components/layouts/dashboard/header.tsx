"use client";

import { cn } from "@lipy/web-ui/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { buttonVariants } from "../../ui/button";

export const DashboardHeader = ({
	title,
	children,
	titleChildren,
}: {
	title?: string;
	children?: ReactNode;
	titleChildren?: ReactNode;
	className?: string;
}) => {
	const router = useRouter();
	const onBack = (e: any) => {
		e.preventDefault();
		router.history.back();
		return false;
	};
	return (
		<div className="sticky top-0 z-10 bg-background">
			<div className="flex justify-between gap-8 w-full p-4 items-center bg-accent/30 border-b">
				<div className="flex items-center justify-center gap-4">
					<Link
						to={"/"}
						onClick={onBack}
						className={cn(buttonVariants({ size: "icon", variant: "outline" }))}
					>
						<ChevronLeft className="stroke-2" />
					</Link>
					<h1 className="font-semibold text-xl leading-0 ">{title}</h1>
					{titleChildren && titleChildren}
				</div>
				<div className="flex-1 flex justify-end gap-4">{children}</div>
			</div>
		</div>
	);
};
