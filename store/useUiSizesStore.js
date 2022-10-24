import create from "zustand";

const useUiSizesStore = create((set) => ({
  navbarHeight: 0,
  setNavbarHeight: (payload) =>
    set(() => ({
      navbarHeight: payload,
    })),
}));

export default useUiSizesStore;
