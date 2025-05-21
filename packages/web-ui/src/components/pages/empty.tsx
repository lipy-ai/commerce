import { type LucideIcon, Package2 } from "lucide-react";

import { Label } from "../ui/label";

export default function EmptyPage(props: {
	icon?: LucideIcon;
	title?: string;
	label?: string;
}) {
	let Icon = Package2;
	if (props.icon) Icon = props.icon;
	return (
		<div className="flex w-full flex-1 flex-col items-center justify-center text-center">
			<Icon className="mb-2 size-20 opacity-70" strokeWidth={1.1} />
			<p className="text-xl font-medium">
				{props.title || "Feels Light & Empty"}
			</p>
			<Label className="text-md font-light">
				{props.label || "We couldn't find any records!"}
			</Label>
		</div>
	);
}
