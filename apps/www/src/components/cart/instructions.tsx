import { Checkbox } from "@lipy/web-ui/components/ui/checkbox";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@lipy/web-ui/components/ui/drawer";
import { Clock, Dog, MapPin, Phone } from "lucide-react";
import type React from "react";
import { useState } from "react";

const deliveryOptions = [
	{
		name: "leave-at-door",
		label: "Leave at door",
		icon: MapPin,
		description: "Leave the order at my doorstep",
	},
	{
		name: "ring-doorbell",
		label: "Ring doorbell",
		icon: Clock,
		description: "Please ring the doorbell upon arrival",
	},
	{
		name: "call-on-arrival",
		label: "Call on arrival",
		icon: Phone,
		description: "Call me when you arrive",
	},
	{
		name: "pet-at-home",
		label: "Pet is at home",
		icon: Dog,
		description: "Beware of pets at home",
	},
];

interface DeliveryInstructionProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	setCompleteInstruction: (instruction: string) => void;
}

export const DeliveryInstruction: React.FC<DeliveryInstructionProps> = ({
	open,
	onOpenChange,
	setCompleteInstruction,
}) => {
	const [deliveryPreferences, setDeliveryPreferences] = useState<string[]>([]);

	const handleDeliveryToggle = (optionName: string) => {
		setDeliveryPreferences((prev) =>
			prev.includes(optionName)
				? prev.filter((option) => option !== optionName)
				: [...prev, optionName],
		);
	};

	setCompleteInstruction(deliveryPreferences.join(", "));

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="p-4 ">
				<DrawerHeader className="justify-start">
					<DrawerTitle className="text-xl font-semibold">
						Delivery Instructions
					</DrawerTitle>
					<DrawerDescription className="pl-2">
						We will inform delivery partner
					</DrawerDescription>
				</DrawerHeader>

				<div className="space-y-6">
					{/* Delivery Preferences Section */}
					<div>
						<div className="grid grid-cols-1 gap-3">
							{deliveryOptions.map(
								({ name, label, icon: Icon, description }) => (
									<div
										key={name}
										className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
									>
										<Checkbox
											checked={deliveryPreferences.includes(label)}
											onCheckedChange={() => handleDeliveryToggle(label)}
											id={`delivery-${name}`}
										/>
										<div className="flex-1">
											<label
												htmlFor={`delivery-${name}`}
												className="flex items-center gap-2 cursor-pointer"
											>
												<Icon className="h-5 w-5 text-gray-600" />
												<div>
													<div className="text-sm font-medium">{label}</div>
													<div className="text-xs text-gray-500">
														{description}
													</div>
												</div>
											</label>
										</div>
									</div>
								),
							)}
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
