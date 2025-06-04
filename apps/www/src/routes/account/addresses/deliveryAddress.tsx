import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import SearchBar from "@lipy/web-ui/components/searchBar";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { createFileRoute } from "@tanstack/react-router";
import {
	Building,
	ChevronRight,
	House,
	MapPinHouse,
	Navigation,
} from "lucide-react";
import { useRef } from "react";

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

	const handlePlaceSelect = () => {
		if (autocompleteRef.current) {
			console.log(autocompleteRef.current);
			// const place = autocompleteRef.current.getPlace();
			// if (place?.geometry?.location) {
			// 	const lat = place.geometry.location.lat();
			// 	const lng = place.geometry.location.lng();
			// }
		}
	};

	return (
		<>
			<DashboardHeader title="Delivery Address" />
			<div className="p-4 space-y-8 max-w-4xl lg:p-8 lg: rounded-sm lg:border">
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

				<Button
					variant={"link"}
					className="flex justify-between my-2 text-md font-medium w-full"
				>
					<div className="flex items-center gap-2 ">
						<Navigation className="fill-primary" />
						Use my current location
					</div>

					<ChevronRight className="text-muted-foreground" />
				</Button>

				<Separator className="mt-4" />
				<div>
					<p className="font-medium text-lg my-2 text-muted-foreground">
						Saved Address
					</p>
					{isLoading && <Spinner />}
					{!isLoading && data && data?.length > 0 && (
						<div className="mb-10  space-y-4 divide-y">
							{data.map((address) => (
								<div key={address.id}>
									<div className="flex  gap-2 py-2 cursor-pointer">
										<Avatar className="rounded-md ">
											<AvatarFallback>
												{address.tag === "home" ? (
													<House className="text-muted-foreground flex-shrink-0" />
												) : address.tag === "work" ? (
													<Building className="text-muted-foreground  flex-shrink-0" />
												) : (
													<MapPinHouse className="size-6 text-muted-foreground flex-shrink-0" />
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
					)}
				</div>
			</div>
		</>
	);
}
