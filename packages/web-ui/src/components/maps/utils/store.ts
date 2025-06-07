import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DeliveryLocation = {
	lat: number;
	lng: number;
	id: string;
	phone?: string | undefined;
	tag: "home" | "work" | "other";
	city: string;
	state: string;
	country: string;
	postalCode: string;
	line1: string;
	line2: string;
	userId: string;
	name: string;
};
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
		id: "",
		phone: undefined,
		tag: "home",
		city: "",
		state: "",
		country: "",
		postalCode: "",
		line1: "",
		line2: "",
		userId: "",
		name: "",
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
