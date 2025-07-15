import { env } from "@envClient";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { MapPinOff, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
	DrawerDialogDescription,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "../custom-ui/drawerDialogSwitcher";
import { Button, buttonVariants } from "../ui/button";
import {
	type DeliveryLocation,
	defaultDeliveryLocationState,
	useLocationStore,
} from "./utils/store";

function LocationComponent() {
	const [unsupported, setUnsupported] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const { setDeliveryLocation } = useLocationStore();

	const getLocation = () => {
		if (!navigator.geolocation) {
			setUnsupported(true);
			setError("Location permission not enabled.");
			setDrawerOpen(true);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				if (!lat || !lng) {
					setUnsupported(true);
					setError("Unable to retrieve coordinates.");
					setDrawerOpen(true);
					return;
				}

				const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${env.GOOGLE_MAP_API_KEY}`;

				fetch(geocodeUrl)
					.then((response) => response.json())
					.then((data) => {
						const result = data.results?.[0];
						if (!result) {
							setUnsupported(true);
							setError("Unable to fetch address details.");
							setDrawerOpen(true);
							return;
						}

						let address = result.formatted_address || "";

						// Remove plus codes if present
						if (address?.split(",")[0]?.includes("+")) {
							address = address.split(",").slice(1).join(",").trim();
						}

						const addressComponents = result.address_components || [];

						const newAddress: DeliveryLocation = {
							...defaultDeliveryLocationState.deliveryLocation,
							line1: address,
							lat: lat,
							lng: lng,
						};

						for (const component of addressComponents) {
							if (component.types.includes("postal_code")) {
								newAddress.postalCode = component.long_name;
							}
							if (component.types.includes("country")) {
								newAddress.country = component.long_name;
							}
							if (component.types.includes("administrative_area_level_1")) {
								newAddress.state = component.long_name;
							}
							if (component.types.includes("locality")) {
								newAddress.city = component.long_name;
							}
						}

						setDeliveryLocation(newAddress);
					})
					.catch(() => {
						setUnsupported(true);
						setError("Failed to fetch location details.");
						setDrawerOpen(true);
					});
			},
			() => {
				setError("Location permission is off.");
				setDrawerOpen(true);
			},
		);
	};

	useEffect(() => {
		getLocation();
	}, []);

	if (unsupported || error) {
		return (
			<DrawerDialogSwitcher
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				dismissible={false}
				className="[&>button]:hidden"
			>
				<DrawerDialogHeader className="mx-auto">
					<div className="mx-auto rounded-xl p-4 border my-6">
						<MapPinOff className="size-16" />
					</div>

					<DrawerDialogTitle className="mx-auto text-xl text-center font-semibold">
						{error || "Location permission is off"}
					</DrawerDialogTitle>
					<DrawerDialogDescription className="mx-auto text-base text-center">
						Please allow location permission for a better experience.
					</DrawerDialogDescription>
				</DrawerDialogHeader>
				<DrawerDialogFooter>
					<Button onClick={() => window.location.reload()}>Retry</Button>

					<Link
						className={cn(buttonVariants({ variant: "outline" }))}
						to={"/account/addresses/deliveryAddress"}
						onClick={() => setDrawerOpen(false)}
					>
						<Search className="stroke-2" />
						Search your location
					</Link>
				</DrawerDialogFooter>
			</DrawerDialogSwitcher>
		);
	}

	// If no error, render nothing (or you could render children or some success indicator)
	return null;
}

export default LocationComponent;
