import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LeadStore = {
	mapCenter: {
		lat: number;
		lng: number;
	};
	result: google.maps.places.Place[];
	setMapCenter: (center: { lat: number; lng: number }) => void;
	setResult: (result: google.maps.places.Place[]) => void;
};

export const defaultLeadState = {
	mapCenter: {
		lat: 28.6139,
		lng: 77.209,
	},
	result: [],
};

export const useLeadStore = create<LeadStore>()(
	persist(
		(set) => ({
			...defaultLeadState,
			setMapCenter: (mapCenter) => set({ mapCenter: mapCenter }),
			setResult(result) {
				set({ result: result });
			},
		}),
		{
			name: "lipy-lead-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
