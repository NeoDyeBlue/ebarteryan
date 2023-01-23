import create from "zustand";

const useItemSearchStore = create((set) => ({
  searchQuery: "",
  setSearchQuery: (payload) =>
    set(() => ({
      searchQuery: payload,
    })),
}));

export default useItemSearchStore;
