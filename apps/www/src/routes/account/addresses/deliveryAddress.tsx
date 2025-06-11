import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { fillFullAddress } from "@lipy/web-ui/components/maps/utils/googlemap";
import {
	defaultDeliveryLocationState,
	useLocationStore,
} from "@lipy/web-ui/components/maps/utils/store";
import type { DeliveryLocation } from "@lipy/web-ui/components/maps/utils/store";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Building,
	ChevronRight,
	House,
	MapPinHouse,
	Navigation,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/account/addresses/deliveryAddress")({
	component: RouteComponent,
});

const libraries: "places"[] = ["places"];
function RouteComponent() {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: env.GOOGLE_MAP_API_KEY as string,
		libraries: libraries,
	});

	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

	const { data, isLoading } = useAPIQuery(apiClient.v1.address, "$get", {});

	const navigate = useNavigate();

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

	const handlePlaceSelect = () => {
		if (autocompleteRef.current) {
			const place = autocompleteRef.current.getPlace();

			if (place?.geometry?.location) {
				const lat = place.geometry.location.lat();
				const lng = place.geometry.location.lng();

				const address = place.formatted_address || (place.name as string);

				fillFullAddress(
					place.address_components || [],
					address,
					lat,
					lng,
					setFullAddress,
				);

				navigate({ to: "/" });
			}
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 1000 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<DashboardHeader title="Delivery Address" />
			<div className="p-4 space-y-8 lg:p-8 lg: rounded-sm  m-auto max-w-screen-xl md:border-r md:border-l min-h-screen">
				{!isLoaded ? (
					<Spinner />
				) : (
					<Autocomplete
						onLoad={(autocomplete) => {
							autocompleteRef.current = autocomplete;
						}}
						onPlaceChanged={handlePlaceSelect}
					>
						<SearchBar placeholder={"Search for address"} />
					</Autocomplete>
				)}

				<Link
					to="/account/addresses/new"
					className="flex justify-between my-2 text-md font-medium w-full text-primary"
					search={{
						type: "deliveryAddress",
					}}
				>
					<div className="flex items-center gap-2 ">
						<Navigation className="fill-primary" />
						Use my current location
					</div>

					<ChevronRight className="text-muted-foreground" />
				</Link>

				<Separator className="mt-4" />

				{isLoading && <Spinner />}
				{deliveryLocation.line1 !== "" && (
					<div>
						<p className="font-medium text-base my-2 text-muted-foreground">
							Current address
						</p>
						<div className="flex  gap-2  cursor-pointer">
							<Avatar className="rounded-md ">
								<AvatarFallback>
									<MapPinHouse className="size-6 flex-shrink-0 text-foreground fill-primary/40" />
								</AvatarFallback>
							</Avatar>

							<div>
								<h2 className="text-md font-semibold">
									{deliveryLocation?.tag.charAt(0).toUpperCase() +
										deliveryLocation?.tag.slice(1) || "Other"}
								</h2>
								<p className="text-muted-foreground">
									{deliveryLocation.line1}
								</p>
							</div>
						</div>
						<Separator className="mt-4" />
					</div>
				)}

				{!isLoading && data && data?.length > 0 && (
					<div>
						<p className="font-medium text-base my-2 text-muted-foreground">
							Saved addresses
						</p>

						<div className="mb-10  space-y-4 divide-y">
							{data.map((address) => (
								<div
									key={address.id}
									onClick={() => {
										setDeliveryLocation({
											...(address as DeliveryLocation),
										});

										navigate({
											to: "/",
										});
									}}
								>
									<div className="flex  gap-2 py-2 cursor-pointer">
										<Avatar className="rounded-md ">
											<AvatarFallback>
												{address.tag === "home" ? (
													<House className="flex-shrink-0 text-foreground fill-primary/40" />
												) : address.tag === "work" ? (
													<Building className="  flex-shrink-0 text-foreground fill-primary/40" />
												) : (
													<MapPinHouse className="size-6  flex-shrink-0 text-foreground fill-primary/40" />
												)}
											</AvatarFallback>
										</Avatar>

										<div>
											<h2 className="text-md font-semibold">{address.name}</h2>
											<p className="text-muted-foreground">{address.line1}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
}
