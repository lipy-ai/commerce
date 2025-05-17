import { create } from "zustand"

type FormStore = {
  activeFormIdx: number
  data: Record<string, any>
  actions: {
    setActiveFormIdx: (id: FormStore["activeFormIdx"]) => void
    setFormData: (id: FormStore["data"]) => void
    reset: () => void
  }
}

const defaultState = {
  activeFormIdx: 0,
  data: {},
}
export const useFormStore = create<FormStore>()((set) => ({
  ...defaultState,
  actions: {
    setActiveFormIdx: (id: number) => set({ activeFormIdx: id }),
    setFormData: (d) => set((prev) => ({ data: { ...prev.data, ...d } })),
    reset: () => set(defaultState),
  },
}))
