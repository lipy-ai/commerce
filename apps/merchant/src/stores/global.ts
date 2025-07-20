import { createJSONStorage, persist } from "zustand/middleware";

import { create } from "zustand";

type GlobalStore = {
	promptOnDelete: boolean;
};

type Actions = {
	reset: () => void;
	update: (v: Partial<GlobalStore>) => void;
};

const defaultValues: GlobalStore = {
	promptOnDelete: true,
};

type T = GlobalStore & Actions;

export const useGlobalSessionStore = create<T>()(
	persist(
		(set) => ({
			...defaultValues,
			reset: () => set({ ...defaultValues }),
			update: (v) => set((p) => ({ ...p, ...v })),
		}),
		{
			name: "lipy-global-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
