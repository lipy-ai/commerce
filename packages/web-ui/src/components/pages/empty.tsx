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
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-full flex-1 flex-col items-center justify-center text-center">
			<Icon className="mb-2 size-20 opacity-70" strokeWidth={1.1} />
			<p className="text-xl font-medium">
				{props.title || "Feels Light & Empty"}
			</p>
			<Label className="text-md font-light">
				{props.label || "We couldn't find any records!"}
			</Label>
			{props.children}
		</div>
	);
}
