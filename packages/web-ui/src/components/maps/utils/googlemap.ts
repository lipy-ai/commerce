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
