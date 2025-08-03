import type { addressSchema } from "@lipy/server/routes/loggedRoutes/address";
import type z from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AddressType = z.infer<typeof addressSchema> & {
	id: string | null;
};

export const defaultAddress = {
	id: null,
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
};

type LocationStore = {
	deliveryLocation: AddressType;
	setDeliveryLocation: (deliveryLocation: AddressType) => void;
	hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
};

export const defaultDeliveryLocationState: LocationStore = {
	deliveryLocation: defaultAddress as AddressType,
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
