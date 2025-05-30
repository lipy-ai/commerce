// import { Autocomplete } from "@react-google-maps/api";
// import SearchBar from "../../searchBar";

// export default function AutoCompleteAddress() {
// 	const handlePlaceSelect = () => {
// 		if (autocompleteRef.current) {
// 			const place = autocompleteRef.current.getPlace();
// 			if (place?.geometry?.location) {
// 				const lat = place.geometry.location.lat();
// 				const lng = place.geometry.location.lng();

// 				// setMapCenter({ lat, lng });
// 				// const placeAddress = place.formatted_address || place.name;
// 				// setAddress(placeAddress);
// 				// setAddressName(place.name);
// 				// setZoom(18);

// 				// const addCompLen = place.address_components?.length || 0;
// 				// const addressComponents = place.address_components || [];

// 				// fillFullAddress(addressComponents, addCompLen, placeAddress);
// 			}
// 		}
// 	};

// 	return (
// 		<Autocomplete
// 			onLoad={(autocomplete) => {
// 				autocompleteRef.current = autocomplete;
// 			}}
// 			onPlaceChanged={handlePlaceSelect}
// 		>
// 			<SearchBar placeholder="Search for address" />
// 		</Autocomplete>
// 	);
// }
