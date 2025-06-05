import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { MapPin, MapPinOff } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import { Separator } from "../ui/separator";
import { useLocationStore } from "./utils/store";

export default function SetLocation({
	error,
}: {
	error: string;
}) {
	const { deliveryLocation } = useLocationStore();
	const [drawerOpen, setDrawerOpen] = useState(true);

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
						<Button onClick={() => window.location.reload()}>Retry</Button>
						{deliveryLocation.address && (
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

						<Link
							className={cn(buttonVariants({ variant: "outline" }))}
							to={"/account/addresses/deliveryAddress"}
						>
							Search your location
						</Link>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}
