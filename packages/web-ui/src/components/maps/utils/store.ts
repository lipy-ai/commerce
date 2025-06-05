import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DeliveryLocation = {
	address: string;
	addressName: string;
	lat: number;
	lng: number;
	id?: string | null;
};
type LocationStore = {
	deliveryLocation: DeliveryLocation;
	setDeliveryLocation: (deliveryLocation: DeliveryLocation) => void;
	hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
};

const defaultState = {
	deliveryLocation: {
		address: "",
		addressName: "",
		lat: 0,
		lng: 0,
		id: null,
	},
	hasHydrated: false,
};

export const useLocationStore = create<LocationStore>()(
	persist(
		(set) => ({
			...defaultState,
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
