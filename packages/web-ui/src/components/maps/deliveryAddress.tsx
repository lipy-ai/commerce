import { useEffect, useState } from "react";
import SetLocation from "./setLocationDrawer";

import { env } from "@envClient";
import { useLocationStore } from "./store";

function LocationComponent() {
	const [location, setLocation] = useState({ lat: null, lng: null });
	const [error, setError] = useState<string | null>(null);
	const [unsupported, setUnsupported] = useState(false);

	const { deliveryLocation, setDeliveryLocation } = useLocationStore();

	const getLocation = () => {
		if (!navigator.geolocation) {
			setUnsupported(true);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
				setError(null); // clear error

				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				if (lat !== deliveryLocation.lat || lng !== deliveryLocation.lng) {
					const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${env.GOOGLE_MAP_API_KEY}`;
					fetch(geocodeUrl)
						.then((response) => response.json())
						.then((data) => {
							const address = data.results[0]?.formatted_address;
							const addressComp = data.results[0].address_components;
							let addressName = "";
							let locality = "";
							let subLocality = "";
							let i = addressComp?.length || 0;
							while (i > 0) {
								if (addressComp[i - 1]?.types?.includes("locality")) {
									locality = addressComp[i - 1]?.long_name || "";
								}
								if (addressComp[i - 1]?.types?.includes("sublocality")) {
									subLocality = addressComp[i - 1]?.long_name || "";
									addressName = `${subLocality}, ${locality}`;
									break;
								}
								i--;
							}

							if (address) {
								setDeliveryLocation({
									lat: lat,
									lng: lng,
									address: address,
									addressName: addressName,
								});
							}
						})
						.catch((error) => {
							setUnsupported(true);
							setError(error.message);
						});
				}
			},
			(err) => {
				setError("Location permission is off");
			},
		);
	};

	useEffect(() => {
		getLocation();
	}, []);

	if (unsupported || error) {
		return (
			<SetLocation
				error={error || "Geolocation not supported"}
				onRetry={getLocation}
			/>
		);
	}

	return;
}

export default LocationComponent;
