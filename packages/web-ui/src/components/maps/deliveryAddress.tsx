import { env } from "@envClient";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { MapPinOff } from "lucide-react";
import { useEffect, useState } from "react";
import {
	DrawerDialogDescription,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "../custom-ui/drawerDialogSwitcher";
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
								const prsedAddress = fillFullAddress(
									addressComp,
									address,
									lat,
									lng,
								);

								setFullAddress(prsedAddress);
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
		return (
			<DrawerDialogSwitcher
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				handleInteractOutside={false}
				className="[&>button]:hidden"
			>
				<DrawerDialogHeader className="mx-auto">
					<div className="mx-auto rounded-xl p-4 border my-6 ">
						<MapPinOff className="size-16 " />
					</div>

					<DrawerDialogTitle className="mx-auto text-xl text-center font-semibold">
						{error || "Location permission is off"}
					</DrawerDialogTitle>
					<DrawerDialogDescription className="mx-auto text-base text-center">
						Please allow location permission for better experience.
					</DrawerDialogDescription>
				</DrawerDialogHeader>
				<DrawerDialogFooter>
					<Button onClick={() => window.location.reload()}>Retry</Button>

					<Link
						className={cn(buttonVariants({ variant: "outline" }))}
						to={"/account/addresses/deliveryAddress"}
					>
						Search your location
					</Link>
				</DrawerDialogFooter>
			</DrawerDialogSwitcher>
		);
	}

	return;
}

export default LocationComponent;
