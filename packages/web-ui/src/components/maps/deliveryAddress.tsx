import { env } from "@envClient";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { MapPinOff } from "lucide-react";
import { useEffect, useState } from "react";
import { DrawerDialogSwitcher } from "../custom-ui/drawerDialogSwitcher";
import { Button, buttonVariants } from "../ui/button";
import { fillFullAddress } from "./utils/googlemap";
import { defaultDeliveryLocationState, useLocationStore } from "./utils/store";

function LocationComponent() {
	const [error, setError] = useState<string | null>(null);
	const [unsupported, setUnsupported] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(true);

	const { setDeliveryLocation, deliveryLocation } = useLocationStore();

	const [fullAddress, setFullAddress] = useState({
		line1: deliveryLocation.line1 || "",
		city: deliveryLocation.city || "",
		state: deliveryLocation.state || "",
		country: deliveryLocation.country || "",
		postalCode: deliveryLocation.postalCode || "",
		lat: deliveryLocation.lat || 0,
		lng: deliveryLocation.lng || 0,
	});

	useEffect(() => {
		setDeliveryLocation({
			...defaultDeliveryLocationState.deliveryLocation,
			...fullAddress,
		});
	}, [fullAddress]);

	const getLocation = () => {
		if (!navigator.geolocation) {
			setUnsupported(true);
			setError("Geolocation is not supported by this browser.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				setError(null); // clear error

				if (lat && lng) {
					const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${env.GOOGLE_MAP_API_KEY}`;

					fetch(geocodeUrl)
						.then((response) => response.json())
						.then((data) => {
							let address = data.results[0]?.formatted_address;
							if (address.split(",")[0].includes("+")) {
								address = address.split(",").slice(1).join(",");
							}
							const addressComp = data.results[0].address_components;

							// let addressName = "";
							// let locality = "";
							// let subLocality = "";
							// let neighborhood = "";
							// let baseAddress = "";
							// let i = addressComp?.length || 0;
							// while (i > 0) {
							// 	if (addressComp[i - 1]?.types?.includes("locality")) {
							// 		locality = addressComp[i - 1]?.long_name || "";
							// 	}
							// 	if (addressComp[i - 1]?.types?.includes("sublocality")) {
							// 		subLocality = addressComp[i - 1]?.long_name || "";
							// 		break;
							// 	}
							// 	if (addressComp[i - 1]?.types?.includes("neighborhood")) {
							// 		neighborhood = addressComp[i - 1]?.long_name || "";
							// 		break;
							// 	}
							// 	if (addressComp[i - 1]?.types?.includes("political")) {
							// 		baseAddress = addressComp[i - 1]?.long_name || "";
							// 	}
							// 	i--;
							// }
							// if (subLocality && locality) {
							// 	addressName = `${subLocality}, ${locality}`;
							// } else if (neighborhood && locality) {
							// 	addressName = `${neighborhood}, ${locality}`;
							// } else {
							// 	addressName = baseAddress;
							// }

							if (address) {
								fillFullAddress(addressComp, address, lat, lng, setFullAddress);
							}
						})
						.catch((_error) => {
							setUnsupported(true);
							setError("Location permission is off");
						});
				}
			},
			(_err) => {
				setError("Location permission is off");
			},
		);
	};

	useEffect(() => {
		getLocation();
	}, []);

	if (unsupported || error) {
		// return <SetLocation error={error || "Location permission is off"} />;
		return (
			<DrawerDialogSwitcher
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				handleInteractOutside={false}
			>
				<div className="space-y-4 flex flex-col items-center justify-center">
					<div className="flex flex-col items-center justify-center">
						<MapPinOff className="size-16" />
						<div className="text-lg font-semibold">
							{error || "Location permission is off"}
						</div>
						<div className="text-muted-foreground text-sm">
							Please allow location permission for better experience.
						</div>
					</div>

					<Button onClick={() => window.location.reload()} className="w-full">
						Retry
					</Button>

					<Link
						className={cn(buttonVariants({ variant: "outline" }), "w-full")}
						to={"/account/addresses/deliveryAddress"}
					>
						Search your location
					</Link>
				</div>
			</DrawerDialogSwitcher>
		);
	}

	return;
}

export default LocationComponent;
