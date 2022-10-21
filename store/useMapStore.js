import create from "zustand";

const useMapStore = create((set) => ({
  map: null,
  listingPosition: {},
  position: {},
  radius: 1,
  listingRegion: "",
  region: "",
  setPosition: (payload) =>
    set((state) => ({ position: { ...state.position, ...payload } })),
  setRadius: (payload) => set(() => ({ radius: payload })),
  setMap: (payload) => set(() => ({ map: payload })),
  setRegion: (payload) => set(() => ({ region: payload })),
  setListingLocation: () =>
    set((state) => ({
      listingPosition: state.position,
      listingRegion: state.region,
    })),
}));

export default useMapStore;
