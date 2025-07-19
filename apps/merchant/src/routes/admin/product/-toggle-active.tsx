import { Toggle } from "@lipy/web-ui/components/ui/toggle";
import type { ReactNode } from "react";

export default function ToggleProductActive({
	children,
}: { children?: ReactNode }) {
	return children ? (
		children
	) : (
		<Toggle
			aria-label="Toggle Active"
			className="group w-20"
			size={"sm"}
			variant={"outline"}
			asChild
		>
			<div>
				<span className="hidden group-data-[state=on]:block">Active</span>
				<span className="block group-data-[state=on]:hidden">In-Active</span>
			</div>
		</Toggle>
	);
}
