export const getGeocodeFromLatLng = (
	lat: number,
	lng: number,
): Promise<{
	formattedAddress: string;
	addressComponent: google.maps.GeocoderAddressComponent[];
}> => {
	return new Promise((resolve, reject) => {
		if (!window.google || !window.google.maps) {
			reject(new Error("Google Maps API is not loaded"));
			return;
		}

		const geocoder = new window.google.maps.Geocoder();
		geocoder.geocode({ location: { lat, lng } }, (results, status) => {
			if (status === "OK" && results && results.length > 0) {
				resolve({
					formattedAddress: results[0].formatted_address,
					addressComponent: results[0].address_components,
				});
			} else {
				reject(new Error(`Geocoding failed: ${status}`));
			}
		});
	});
};

export const fillFullAddress = (
	addressComponents: google.maps.GeocoderAddressComponent[],
	placeAddress: string,
	lat: number,
	lng: number,
	setFullAddress: React.Dispatch<
		React.SetStateAction<{
			line1: string;
			city: string;
			state: string;
			country: string;
			postalCode: string;
			lat: number;
			lng: number;
		}>
	>,
) => {
	const addCompLen = addressComponents?.length || 0;
	setFullAddress((prev) => ({
		...prev,
		line1: placeAddress || "",
		lat: lat,
		lng: lng,
	}));

	if (addCompLen > 0) {
		if (addressComponents[addCompLen - 1]?.types?.includes("postal_code")) {
			setFullAddress((prev) => ({
				...prev,
				postalCode: addressComponents[addCompLen - 1]?.long_name || "",
			}));
		}

		if (addressComponents[addCompLen - 2]?.types?.includes("country")) {
			setFullAddress((prev) => ({
				...prev,
				country: addressComponents[addCompLen - 2]?.long_name || "",
			}));
		}

		if (
			addressComponents[addCompLen - 3]?.types?.includes(
				"administrative_area_level_1",
			)
		) {
			setFullAddress((prev) => ({
				...prev,
				state: addressComponents[addCompLen - 3]?.long_name || "",
			}));
		}
		let i = addCompLen;

		while (i >= 4) {
			if (addressComponents[i - 4]?.types?.includes("locality")) {
				setFullAddress((prev) => ({
					...prev,
					city: addressComponents[i - 4]?.long_name || "",
				}));

				break;
			}
			i--;
		}
	}
};
