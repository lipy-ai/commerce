import { type LucideIcon, Package2 } from "lucide-react";

import { Label } from "../ui/label";

export default function EmptyPage(props: {
	icon?: LucideIcon;
	title?: string;
	label?: string;
	children?: React.ReactNode;
}) {
	let Icon = Package2;
	if (props.icon) Icon = props.icon;

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
			<Icon className="mb-2 size-24 lg:size-28 opacity-70" strokeWidth={1.1} />
			<p className="text-xl lg:text-3xl font-medium">
				{props.title || "Feels Light & Empty"}
			</p>
			<Label className="text-md font-light">
				{props.label || "We couldn't find any records!"}
			</Label>
			{props.children}
		</div>
	);
}
