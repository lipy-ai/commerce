import { env } from "@envClient";
import { useEffect, useState } from "react";
import SetLocation from "./setLocationDrawer";
import { getDistanceFromLatLonInKm } from "./utils/distanceCalculator";
import { useLocationStore } from "./utils/store";

function LocationComponent() {
	const [_location, setLocation] = useState<{
		lat: number | null;
		lng: number | null;
	}>({ lat: null, lng: null });
	const [error, setError] = useState<string | null>(null);
	const [unsupported, setUnsupported] = useState(false);

	const { deliveryLocation, setDeliveryLocation } = useLocationStore();

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

				setLocation({
					lat: lat,
					lng: lng,
				});
				setError(null); // clear error

				let distance = 10000;

				if (deliveryLocation.lat && deliveryLocation.lng) {
					distance = getDistanceFromLatLonInKm(
						lat,
						lng,
						deliveryLocation.lat,
						deliveryLocation.lng,
					);
				}

				if (distance > 0.1) {
					const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${env.GOOGLE_MAP_API_KEY}`;
					fetch(geocodeUrl)
						.then((response) => response.json())
						.then((data) => {
							const address = data.results[0]?.formatted_address;
							const addressComp = data.results[0].address_components;

							let addressName = "";
							let locality = "";
							let subLocality = "";
							let neighborhood = "";
							let baseAddress = "";
							let i = addressComp?.length || 0;
							while (i > 0) {
								if (addressComp[i - 1]?.types?.includes("locality")) {
									locality = addressComp[i - 1]?.long_name || "";
								}
								if (addressComp[i - 1]?.types?.includes("sublocality")) {
									subLocality = addressComp[i - 1]?.long_name || "";

									break;
								}
								if (addressComp[i - 1]?.types?.includes("neighborhood")) {
									neighborhood = addressComp[i - 1]?.long_name || "";

									break;
								}
								if (addressComp[i - 1]?.types?.includes("political")) {
									baseAddress = addressComp[i - 1]?.long_name || "";
								}
								i--;
							}
							if (subLocality && locality) {
								addressName = `${subLocality}, ${locality}`;
							} else if (neighborhood && locality) {
								addressName = `${neighborhood}, ${locality}`;
							} else {
								addressName = baseAddress;
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
			<SetLocation
				error={error || "Location permission is off"}
				onRetry={getLocation}
			/>
		);
	}

	return;
}

export default LocationComponent;
