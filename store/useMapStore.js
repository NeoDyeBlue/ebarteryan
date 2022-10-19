import create from "zustand";

const useMapStore = create((set) => ({
  position: {},
  radius: 1,
  setPosition: (payload) =>
    set((state) => ({ position: { ...state.position, ...payload } })),
  setRadius: (payload) => set(() => ({ radius: payload })),
}));

export default useMapStore;
