"use client";

import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export const DashboardHeader = ({
	title,
	children,
	titleChildren,
	hideBackBtn,
}: {
	title?: string;
	children?: ReactNode;
	titleChildren?: ReactNode;
	className?: string;
	hideBackBtn?: boolean;
}) => {
	const router = useRouter();
	const onBack = (e: any) => {
		e.preventDefault();
		router.history.back();
		return false;
	};
	return (
		<div className="sticky top-0 z-10 bg-background ">
			<div className="flex justify-between gap-8 w-full px-3 py-2 items-center bg-accent/30 border-b">
				<div className="flex items-center justify-center gap-2">
					{!hideBackBtn && (
						<Link to={"/"} onClick={onBack}>
							<ArrowLeft className="stroke-2" />
						</Link>
					)}
					<h1 className="font-semibold text-xl leading-none py-2">{title}</h1>
					{titleChildren && titleChildren}
				</div>
				<div className="flex-1 flex justify-end gap-4">{children}</div>
			</div>
		</div>
	);
};
