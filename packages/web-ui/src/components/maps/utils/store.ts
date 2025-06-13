import type { address } from "@lipy/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DeliveryLocation = InferSelectModel<typeof address>;
type LocationStore = {
	deliveryLocation: DeliveryLocation;
	setDeliveryLocation: (deliveryLocation: DeliveryLocation) => void;
	hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
};

export const defaultDeliveryLocationState: LocationStore = {
	deliveryLocation: {
		lat: 0,
		lng: 0,
		phone: null,
		tag: "home",
		city: "",
		state: "",
		country: "",
		postalCode: "",
		line1: "",
		line2: "",
		name: "",
		id: "",
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
