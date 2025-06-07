import { cn } from "@lipy/web-ui/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CircleCheck } from "lucide-react";

const CustomCheckBoxCard = ({
	options,
	className,
}: {
	options: {
		label: string;
		value: string;
		icon: React.FC<React.SVGProps<SVGSVGElement>>;
		defaultChecked?: boolean;
	}[];
	className?: string;
}) => {
	return (
		<div
			className={cn("w-full max-w-sm grid grid-cols-3 gap-3", className)}
			style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
		>
			{options.map((option) => (
				<CheckboxPrimitive.Root
					key={option.value}
					defaultChecked={option.defaultChecked}
					className="relative ring-[1px] ring-border rounded-lg p-2 text-start text-muted-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:text-primary"
				>
					<option.icon className="mb-2" />
					<span className="font-medium tracking-tight">{option.label}</span>
					<CheckboxPrimitive.Indicator className="absolute top-2 right-2">
						<CircleCheck className="fill-primary text-primary-foreground" />
					</CheckboxPrimitive.Indicator>
				</CheckboxPrimitive.Root>
			))}
		</div>
	);
};
export default CustomCheckBoxCard;
