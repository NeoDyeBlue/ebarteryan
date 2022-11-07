import create from "zustand";

const useUiSizesStore = create((set) => ({
  navbarHeight: 0,
  categoryNavbarHeight: 0,
  setNavbarHeight: (payload) =>
    set(() => ({
      navbarHeight: payload,
    })),
  setCategoryNavbarHeight: (payload) =>
    set(() => ({
      categoryNavbarHeight: payload,
    })),
}));

export default useUiSizesStore;
