import create from "zustand";
import { persist } from "zustand/middleware";
import { useState, useEffect } from "react";

/**
 * for fixing the hydration error
 * @see {@link https://github.com/pmndrs/zustand/issues/1145#issuecomment-1247061387}
 */

const emptyState = (set, get) => ({
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
      listingRegion: state.region ? state.region : state.listingRegion,
      listingRadius: state.radius,
    })),
  setCreationLocation: () =>
    set((state) => ({
      creationPosition: Object.keys(state.position).length
        ? state.position
        : state.creationPosition,
      creationRegion: state.region ? state.region : state.listingRegion,
    })),
  clearPositionRegion: () =>
    set(() => ({
      position: {},
      region: "",
    })),
});

const usePersistedStore = create(
  persist(emptyState, {
    name: "location-storage", // name of item in the storage (must be unique)
    getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    serialize: (state) => JSON.stringify(state),
    deserialize: (str) => JSON.parse(str),
    partialize: (state) => ({
      listingPosition: state.listingPosition,
      listingRadius: state.listingRadius,
      listingRegion: state.listingRegion,
    }),
  })
);

const useMapStore = (selector, compare) => {
  /*
    This a fix to ensure zustand never hydrates the store before React hydrates the page.
    Without this, there is a mismatch between SSR/SSG and client side on first draw which produces
    an error.
     */
  const store = usePersistedStore(selector, compare);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : emptyState;
};

export default useMapStore;
