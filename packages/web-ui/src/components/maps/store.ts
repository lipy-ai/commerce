import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type LocationStore = {
  deliveryLocation: {
    address: string;
    addressName: string;
    lat: number;
    lng: number;
  };
  setDeliveryLocation: (deliveryLocation: {
    address: string;
    lat: number;
    lng: number;
    addressName: string;
  }) => void;
};

const defaultState = {
  deliveryLocation: {
    address: "",
    addressName: "",
    lat: 0,
    lng: 0,
  },
};

export const useLocationStore = create(
  persist<LocationStore>(
    (set) => ({
      ...defaultState,
      setDeliveryLocation: (deliveryLocation) => set({ deliveryLocation }),
    }),
    {
      name: "location-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
