import create from "zustand";

const useMapStore = create((set) => ({
  map: null,
  position: {},
  listingPosition: {},
  creationPosition: {},
  radius: 1,
  listingRadius: 1,
  listingRegion: "",
  region: "",
  creationRegion: "",

  setPosition: (payload) =>
    set((state) => ({ position: { ...state.position, ...payload } })),
  setRadius: (payload) => set(() => ({ radius: payload })),
  setMap: (payload) => set(() => ({ map: payload })),
  setRegion: (payload) => set(() => ({ region: payload })),
  setListingLocation: () =>
    set((state) => ({
      listingPosition: Object.keys(state.position).length
        ? state.position
        : state.listingPosition,
      listingRegion: state.region ? state.region : state.listingRadius,
      listingRadius: state.radius,
    })),
  setCreationLocation: () =>
    set((state) => ({
      creationPosition: state.position,
      creationRegion: state.region,
    })),
  clearPositionRegion: () =>
    set(() => ({
      position: {},
      region: "",
    })),
}));

export default useMapStore;
