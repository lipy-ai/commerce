import { env } from "@envClient";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import {
	Autocomplete,
	GoogleMap,
	Marker,
	useJsApiLoader,
} from "@react-google-maps/api";
import { LocateFixed, MapPinned } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchBar from "../searchBar";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { DetailedAddress } from "./detailedAddress";
import { getGeocodeFromLatLng } from "./utils/googlemap";

const libraries: "places"[] = ["places"];
export default function GoogleMapImage() {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: env.GOOGLE_MAP_API_KEY as string,
		libraries: libraries,
	});

	const [mapCenter, setMapCenter] = useState({
		lat: 26.121832,
		lng: 85.358553,
	});
	const [address, setAddress] = useState("");
	const [addressName, setAddressName] = useState("");
	const [zoom, setZoom] = useState(15);
	const autocompleteRef = useRef<any>(null);
	const { isMobile } = useViewport();
	const [fullAddress, setFullAddress] = useState({
		address: "",
		city: "",
		state: "",
		country: "",
		postalCode: "",
		lat: 0,
		lng: 0,
	});

	const fillFullAddress = (
		addressComponents: google.maps.GeocoderAddressComponent[],
		addCompLen: number,
		placeAddress: string,
		lat: number,
		lng: number,
	) => {
		setFullAddress((prev) => ({
			...prev,
			address: placeAddress || "",
		}));

		setFullAddress((prev) => ({
			...prev,
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

	const handlePlaceSelect = () => {
		if (autocompleteRef.current) {
			const place = autocompleteRef.current.getPlace();
			if (place?.geometry?.location) {
				const lat = place.geometry.location.lat();
				const lng = place.geometry.location.lng();

				setMapCenter({ lat, lng });
				const placeAddress = place.formatted_address || place.name;
				setAddress(placeAddress);
				setAddressName(place.name);
				setZoom(18);

				const addCompLen = place.address_components?.length || 0;
				const addressComponents = place.address_components || [];

				fillFullAddress(addressComponents, addCompLen, placeAddress, lat, lng);
			}
		}
	};

	// Fetch initial address when the map loads
	useEffect(() => {
		if (isLoaded && mapCenter) {
			getGeocodeFromLatLng(mapCenter.lat, mapCenter.lng).then(
				({ formattedAddress, addressComponent }) => {
					setAddress(formattedAddress);
					setAddressName(addressComponent?.[1]?.long_name || "");
					fillFullAddress(
						addressComponent,
						addressComponent?.length || 0,
						formattedAddress,
						mapCenter.lat,
						mapCenter.lng,
					);
				},
			);
		}
	}, [isLoaded, mapCenter]);

	if (!isLoaded) {
		return <Spinner className="absolute top-1/2 left-1/2" size={"large"} />;
	}

	return (
		<div className="flex flex-col h-full relative">
			<div className="p-2 lg:p-4">
				<Autocomplete
					onLoad={(autocomplete) => {
						autocompleteRef.current = autocomplete;
					}}
					onPlaceChanged={handlePlaceSelect}
				>
					<SearchBar placeholder={"Search for address"} />
				</Autocomplete>
			</div>

			<div className="relative flex-grow">
				<GoogleMap
					zoom={zoom}
					center={mapCenter}
					mapContainerStyle={{ width: "100%", height: "calc(100vh - 220px)" }}
					options={{
						zoomControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false,
						cameraControl: false,
					}}
				>
					<Marker
						position={mapCenter}
						draggable={true}
						onDragEnd={(e) => {
							const lat = e?.latLng?.lat();
							const lng = e?.latLng?.lng();
							if (lat && lng) {
								setMapCenter({ lat, lng });
							}
						}}
					/>
				</GoogleMap>

				<div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
					<Button
						className="text-primary border-primary font-semibold shadow-md hover:bg-primary/10"
						variant="outline"
						onClick={() => {
							navigator.geolocation.getCurrentPosition((position) => {
								const { latitude, longitude } = position.coords;
								setMapCenter({ lat: latitude, lng: longitude });
							});
						}}
					>
						<LocateFixed className="text-primary mr-2" />
						Use current location
					</Button>
				</div>
			</div>

			<div
				className={cn(
					"border-t  bg-background w-full p-4 shadow-md",
					isMobile ? "fixed bottom-0 left-0 right-0 z-20" : "mt-auto",
				)}
			>
				<div className="max-w-7xl mx-auto">
					<div
						className={cn(
							"flex items-center gap-4",
							isMobile ? "flex-col" : "flex-row justify-between",
						)}
					>
						<div className="flex items-start gap-3 w-full lg:w-auto">
							<MapPinned className="size-8 text-primary mt-1 flex-shrink-0" />
							<div className="overflow-hidden">
								<h1 className="text-lg font-semibold truncate">
									{addressName || "Loading address..."}
								</h1>
								<p className="text-sm text-muted-foreground line-clamp-2">
									{address || "Please wait while we retrieve location details"}
								</p>
							</div>
						</div>

						<DetailedAddress fullAddress={fullAddress} label="Add" />
					</div>
				</div>
			</div>
		</div>
	);
}
