import { MapPin, MapPinOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import { Separator } from "../ui/separator";
import SetDeliveryLocation from "./setdeliveryLocation";
import { useLocationStore } from "./utils/store";

export default function SetLocation({
	error,
	onRetry,
}: {
	error: string;
	onRetry: () => void;
}) {
	const { deliveryLocation } = useLocationStore();
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [locationDrawerOpen, setLocationDrawerOpen] = useState(false);

	// When 2nd drawer opens, close the first
	const handleOpenLocationDrawer = () => {
		setDrawerOpen(false);
		setLocationDrawerOpen(true);
	};

	return (
		<>
			<Drawer open={drawerOpen} handleOnly={true}>
				<DrawerContent>
					<DrawerHeader className="flex flex-col items-center justify-center">
						<MapPinOff className="size-16" />
						<DrawerTitle>{error}</DrawerTitle>
						<DrawerDescription>
							Please allow location permission for better experience.
						</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<Button onClick={onRetry}>Continue</Button>
						{deliveryLocation.lat && (
							<div onClick={() => setDrawerOpen(false)} className="my-2">
								<div className="text-lg font-semibold my-2">
									Select delivery location
								</div>
								<Separator className="my-2" />
								<div className="flex items-center gap-2">
									<MapPin />
									<div>
										<p className="text-md font-medium">
											{deliveryLocation?.addressName}
										</p>
										<p className="text-muted-foreground line-clamp-1">
											{deliveryLocation?.address}
										</p>
									</div>
								</div>
							</div>
						)}

						<Button
							variant="outline"
							className="w-full"
							onClick={handleOpenLocationDrawer}
						>
							Search your location
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			<SetDeliveryLocation
				open={locationDrawerOpen}
				onOpenChange={(open) => setLocationDrawerOpen(open)}
			/>
		</>
	);
}
