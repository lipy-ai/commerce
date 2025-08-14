export const reverseGeocode = (
	lat: number,
	lng: number,
): Promise<{
	result: google.maps.GeocoderResult;
}> => {
	return new Promise((resolve, reject) => {
		if (!window.google || !window.google.maps) {
			reject(new Error("Google Maps API is not loaded"));
			return;
		}

		const geocoder = new window.google.maps.Geocoder();
		geocoder.geocode({ location: { lat, lng } }, (results, status) => {
			if (status === "OK" && results && results.length > 0) {
				resolve({ result: results[0] });
			} else {
				reject(new Error(`Geocoding failed: ${status}`));
			}
		});
	});
};
export const getPlacePredictions = (
	input: string,
	options?: google.maps.places.AutocompleteRequest,
): Promise<google.maps.places.AutocompletePrediction[]> => {
	return new Promise((resolve, reject) => {
		if (!window.google || !window.google.maps || !window.google.maps.places) {
			reject(new Error("Google Maps Places API is not loaded"));
			return;
		}

		const service = new google.maps.places.AutocompleteService();

		const request: google.maps.places.AutocompleteRequest = {
			input,
			...options,
		};

		service.getPlacePredictions(request, (predictions, status) => {
			if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
				resolve(predictions);
			} else {
				reject(new Error(`Autocomplete failed: ${status}`));
			}
		});
	});
};

export const geocode = (
	address: string,
): Promise<{
	result: google.maps.GeocoderResult;
}> => {
	return new Promise((resolve, reject) => {
		if (!window.google || !window.google.maps) {
			reject(new Error("Google Maps API is not loaded"));
			return;
		}

		const geocoder = new google.maps.Geocoder();

		geocoder.geocode({ address }, (results, status) => {
			if (status === "OK" && results && results.length > 0) {
				resolve({
					result: results[0],
				});
			} else {
				reject(new Error(`Geocoding failed: ${status}`));
			}
		});
	});
};

export const fillBaseAddress = (result: google.maps.GeocoderResult) => {
	const getComponent = (
		components: google.maps.GeocoderAddressComponent[],
		type: string,
	) => components.find((c) => c.types.includes(type))?.long_name || "";

	let address = result.formatted_address;

	if (address?.split(",")[0]?.includes("+")) {
		address = address.split(",").slice(1).join(",").trim();
	}

	const addressComponent = result.address_components;
	return {
		line1: address,
		lat: result.geometry.location.lat(),
		lng: result.geometry.location.lng(),
		city: getComponent(addressComponent, "locality"),
		state: getComponent(addressComponent, "administrative_area_level_1"),
		country: getComponent(addressComponent, "country"),
		postalCode: getComponent(addressComponent, "postal_code"),
	};
};

export async function nearbySearch(
	center: google.maps.LatLngLiteral,
	radius: number,
	includedTypes: string[] = ["restaurant", "cafe"],
	// fields: string[] = [
	// 	"displayName",
	// 	"formattedAddress",
	// 	"businessStatus",
	// 	"googleMapsURI",
	// 	"hasDelivery",
	// 	"hasDineIn",
	// 	"hasTakeout",
	// 	"internationalPhoneNumber",
	// 	"location",
	// 	"nationalPhoneNumber",
	// 	"rating",
	// 	"websiteURI",
	// 	"userRatingCount",
	// ],
	fields: string[] = ["*"],
): Promise<any[]> {
	if (!window.google || !google.maps || !google.maps.places) {
		throw new Error("Google Maps Places API is not loaded");
	}

	const request: google.maps.places.SearchNearbyRequest = {
		fields,
		locationRestriction: {
			center,
			radius,
		},
		includedPrimaryTypes: includedTypes,
		maxResultCount: 20, // default or adjust as needed
	};

	const response = await google.maps.places.Place.searchNearby(request);

	if (!response.places) {
		throw new Error("No places returned");
	}

	return response.places.map((place) => place.toJSON());
}
