import create from "zustand";
import { persist } from "zustand/middleware";

// const useMapStore = create((set) => ({
//   map: null,
//   position: {},
//   listingPosition: {},
//   creationPosition: {},
//   radius: 1,
//   listingRadius: 1,
//   listingRegion: "",
//   region: "",
//   creationRegion: "",

//   setPosition: (payload) =>
//     set((state) => ({ position: { ...state.position, ...payload } })),
//   setRadius: (payload) => set(() => ({ radius: payload })),
//   setMap: (payload) => set(() => ({ map: payload })),
//   setRegion: (payload) => set(() => ({ region: payload })),
//   setListingLocation: () =>
//     set((state) => ({
//       listingPosition: Object.keys(state.position).length
//         ? state.position
//         : state.listingPosition,
//       listingRegion: state.region ? state.region : state.listingRegion,
//       listingRadius: state.radius,
//     })),
//   setCreationLocation: () =>
//     set((state) => ({
//       creationPosition: Object.keys(state.position).length
//         ? state.position
//         : state.creationPosition,
//       creationRegion: state.region ? state.region : state.listingRegion,
//     })),
//   clearPositionRegion: () =>
//     set(() => ({
//       position: {},
//       region: "",
//     })),
// }));

// export default useMapStore;

const useMapStore = create(
  persist(
    (set) => ({
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
      setCreationLocation: (payload) => {
        if (payload && payload.region && payload.position) {
          set(() => ({
            creationPosition: payload.position,
            creationRegion: payload.region,
          }));
        } else {
          set((state) => ({
            creationPosition: Object.keys(state.position).length
              ? state.position
              : state.creationPosition,
            creationRegion: state.region ? state.region : state.listingRegion,
          }));
        }
      },
      clearPositionRegion: () =>
        set(() => ({
          position: {},
          region: "",
        })),
    }),
    {
      name: "location-storage", // name of item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
      serialize: (state) => JSON.stringify(state),
      deserialize: (str) => JSON.parse(str),
      partialize: (state) => ({
        listingPosition: state.listingPosition,
        listingRadius: state.listingRadius,
        listingRegion: state.listingRegion,
      }),
    }
  )
);

export default useMapStore;
