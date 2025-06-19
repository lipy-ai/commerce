import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { fillFullAddress } from "@lipy/web-ui/components/maps/utils/googlemap";
import {
	type DeliveryLocation,
	useLocationStore,
} from "@lipy/web-ui/components/maps/utils/store";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight, Navigation } from "lucide-react";
import { useCallback, useRef } from "react";
import { AddressComponent } from ".";

export const Route = createFileRoute("/account/addresses/deliveryAddress")({
	component: RouteComponent,
});

const libraries: "places"[] = ["places"];

function RouteComponent() {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: env.GOOGLE_MAP_API_KEY ?? "",
		libraries,
	});

	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
	const navigate = useNavigate();

	const { data, isFetching } = useAPIQuery(apiClient.v1.address, "$get", {});
	const { setDeliveryLocation, deliveryLocation, hasHydrated } =
		useLocationStore();

	const handlePlaceSelect = useCallback(() => {
		const place = autocompleteRef.current?.getPlace();
		if (!place?.geometry?.location) return;

		const lat = place.geometry.location.lat();
		const lng = place.geometry.location.lng();
		const address = place.formatted_address || place.name || "";

		const parsedAddress = fillFullAddress(
			place.address_components || [],
			address,
			lat,
			lng,
		);

		setDeliveryLocation({
			...deliveryLocation,
			...parsedAddress,
			metadata: { building: "" },
			tag: "other",
			id: "",
		});
		navigate({ to: "/" });
	}, [setDeliveryLocation, navigate]);

	const handleAddressSelect = useCallback(
		(address: DeliveryLocation) => {
			setDeliveryLocation(address);
			navigate({ to: "/" });
		},
		[setDeliveryLocation, navigate],
	);

	const handleAutocompleteLoad = useCallback(
		(autocomplete: google.maps.places.Autocomplete) => {
			autocompleteRef.current = autocomplete;
		},
		[],
	);

	if (!isLoaded || isFetching) return <Spinner />;

	return (
		<motion.div
			initial={{ opacity: 0, y: 1000 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<DashboardHeader title="Delivery Address" />

			<div className="p-4 space-y-8 lg:p-8 m-auto max-w-screen-xl md:border-x min-h-screen">
				<Autocomplete
					onLoad={handleAutocompleteLoad}
					onPlaceChanged={handlePlaceSelect}
				>
					<SearchBar placeholder="Search for address" />
				</Autocomplete>

				<Link
					to="/account/addresses/new"
					className="flex justify-between text-md font-medium w-full text-primary"
					search={{ type: "deliveryAddress" }}
				>
					<div className="flex items-center gap-2">
						<Navigation className="fill-primary" />
						Use my current location
					</div>
					<ChevronRight className="text-muted-foreground" />
				</Link>

				<Separator className="mt-4" />

				{hasHydrated && deliveryLocation.line1 && (
					<section>
						<p className="font-medium text-base my-2 text-muted-foreground">
							Current address
						</p>

						<AddressComponent address={deliveryLocation} />
						<Separator className="mt-4" />
					</section>
				)}

				{data && data?.length > 0 && (
					<section>
						<p className="font-medium text-base my-2 text-muted-foreground">
							Saved addresses
						</p>
						<div className="mb-10  divide-y">
							{data.map((address) => (
								<div
									key={address.id}
									className="cursor-pointer py-2"
									onClick={() => handleAddressSelect(address)}
								>
									<AddressComponent address={address} />
								</div>
							))}
						</div>
					</section>
				)}
			</div>
		</motion.div>
	);
}
