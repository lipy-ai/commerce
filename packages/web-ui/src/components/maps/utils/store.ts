import type { apiClient } from "@lipy/lib/api";
import type { InferResponseType } from "hono/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DeliveryLocation = Exclude<
	InferResponseType<typeof apiClient.v1.address.primary.$get>,
	null
>;
type LocationStore = {
	deliveryLocation: DeliveryLocation;
	setDeliveryLocation: (deliveryLocation: DeliveryLocation) => void;
	hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
};

export const defaultDeliveryLocationState: LocationStore = {
	deliveryLocation: {
		id: "",
		name: "",
		tag: "other",
		line1: "",
		line2: "",
		city: "",
		state: "",
		country: "",
		postalCode: "",
		phone: "",
		lat: 0,
		lng: 0,
		metadata: { building: "" },
	},
	hasHydrated: false,
	setDeliveryLocation: () => {},
	setHasHydrated: () => {},
};

export const useLocationStore = create<LocationStore>()(
	persist(
		(set) => ({
			...defaultDeliveryLocationState,
			setDeliveryLocation: (deliveryLocation) =>
				set({ deliveryLocation: deliveryLocation }),
			setHasHydrated: (state) => set({ hasHydrated: state }),
		}),
		{
			name: "lipy-location-state",
			storage: createJSONStorage(() => sessionStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
