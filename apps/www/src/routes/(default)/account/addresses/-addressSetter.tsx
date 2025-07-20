import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
	fillBaseAddress,
	geocode,
	getPlacePredictions,
} from "@lipy/web-ui/components/maps/utils/helper";
import {
	type AddressType,
	defaultDeliveryLocationState,
	useLocationStore,
} from "@lipy/web-ui/components/maps/utils/store";
import { Input } from "@lipy/web-ui/components/ui/input";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { useJsApiLoader } from "@react-google-maps/api";
import { Link } from "@tanstack/react-router";
import {
	ChevronRight,
	Loader2,
	LocateFixed,
	MapPin,
	Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AddressComponent } from ".";

export const AddressSetter = ({
	open,
	onOpenChange,
	autocompleteOnly,
	setMapCenter,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	autocompleteOnly?: boolean;
	setMapCenter?: ({
		lat,
		lng,
	}: {
		lat: number;
		lng: number;
	}) => void;
}) => {
	const [input, setInput] = useState("");
	const [predictions, setPredictions] = useState<
		google.maps.places.AutocompletePrediction[]
	>([]);
	const [loadingPrediction, setLoadingPrediction] = useState(false);

	const { isLoaded: gmapLoaded } = useJsApiLoader({
		googleMapsApiKey: env.GOOGLE_MAP_API_KEY,
		libraries: env.GOOGLE_MAP_LIBRARIES,
	});

	const { data: savedAddresses, isLoading } = useAPIQuery(
		apiClient.v1.address,
		"$get",
		{},
	);
	const { setDeliveryLocation, deliveryLocation, hasHydrated } =
		useLocationStore();

	const handleAddressSelect = useCallback(
		(address: AddressType) => {
			setDeliveryLocation(address);
			onOpenChange(false);
		},
		[setDeliveryLocation, onOpenChange],
	);

	const fetchPredictions = useDebouncedCallback(async (text: string) => {
		if (!text) return setPredictions([]);
		try {
			setLoadingPrediction(true);
			const results = await getPlacePredictions(text);
			setPredictions(results);
		} catch (error) {
			setPredictions([]);
		} finally {
			setLoadingPrediction(false);
		}
	}, 400);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (gmapLoaded && input) {
			fetchPredictions(input);
		}
		return () => fetchPredictions.cancel();
	}, [input]);

	// if (isLoading) return <Loading />;
	return (
		<DrawerDialogSwitcher
			open={open}
			onOpenChange={onOpenChange}
			className="h-[90%]"
		>
			<DrawerDialogHeader className="space-y-4 fixed top-4 bg-background  right-4 left-4">
				<DrawerDialogTitle>
					{autocompleteOnly ? "Set address" : "Set delivery location"}
				</DrawerDialogTitle>
				<Input
					value={input}
					type="text"
					onChange={(e) => setInput(e.target.value)}
					prefixEl={<Search className="mr-2" />}
					placeholder="Search your location"
					suffixEl={loadingPrediction && <Loader2 className="animate-spin" />}
					className="w-full"
				/>
			</DrawerDialogHeader>

			{predictions.length > 0 ? (
				<PlacesSuggestionList
					predictions={predictions}
					onOpenChange={onOpenChange}
					autocompleteOnly={autocompleteOnly}
					setMapCenter={setMapCenter}
				/>
			) : !autocompleteOnly ? (
				<div className="space-y-8 mt-24">
					<Link
						to="/account/addresses/new"
						search={{
							type: "deliveryAddress",
						}}
						className="flex items-center justify-between gap-4 text-secondary"
					>
						<div className="flex items-center gap-2">
							<LocateFixed className="size-6 stroke-2" />
							<p className="font-medium text-lg">Use current location</p>
						</div>

						<ChevronRight className="stroke-2" />
					</Link>

					{hasHydrated && deliveryLocation.line1 && (
						<section>
							<p className="font-medium text-base my-2 ">Current address</p>
							<AddressComponent address={deliveryLocation} />
							<Separator className="mt-4" />
						</section>
					)}

					{!isLoading && !!savedAddresses?.length && (
						<section>
							<p className="font-medium text-base my-2 text-muted-foreground">
								Saved addresses
							</p>
							<div className="mb-10 space-y-2">
								{savedAddresses.map((address) => (
									<div
										key={address.id}
										className="cursor-pointer"
										onClick={() => handleAddressSelect(address)}
									>
										<AddressComponent address={address} />
									</div>
								))}
							</div>
						</section>
					)}
				</div>
			) : null}
		</DrawerDialogSwitcher>
	);
};

function PlacesSuggestionList({
	predictions,
	onOpenChange,
	autocompleteOnly,
	setMapCenter,
}: {
	predictions: google.maps.places.AutocompletePrediction[];
	onOpenChange: (open: boolean) => void;
	autocompleteOnly?: boolean;
	setMapCenter?: ({
		lat,
		lng,
	}: {
		lat: number;
		lng: number;
	}) => void;
}) {
	const { setDeliveryLocation } = useLocationStore();

	const handleAddressSelect = async (
		prediction: google.maps.places.AutocompletePrediction,
	) => {
		try {
			const { result } = await geocode(prediction.description);

			if (!autocompleteOnly) {
				setDeliveryLocation({
					...defaultDeliveryLocationState.deliveryLocation,
					...fillBaseAddress(result),
				});
			} else if (setMapCenter) {
				setMapCenter({
					lat: result.geometry.location.lat() as number,
					lng: result.geometry.location.lng() as number,
				});
			}

			onOpenChange(false);
		} catch (error) {
			return;
		}
	};

	return (
		<div className="divide-y">
			{predictions.map((prediction, index) => (
				<div
					key={index}
					className="flex items-start gap-2  py-4"
					onClick={() => {
						handleAddressSelect(prediction);
					}}
				>
					<MapPin className="flex-shrink-0 size-6 fill-secondary/40 mt-1" />
					<div>
						<p className="text-base font-medium">
							{prediction.structured_formatting.main_text}
						</p>
						<p className="text-muted-foreground">{prediction.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
