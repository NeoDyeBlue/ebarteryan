import create from "zustand";

const useFilterStore = create((set) => ({
  filters: null,
  setFilters: (payload) =>
    set(() => ({
      filters: payload,
    })),
}));

export default useFilterStore;
