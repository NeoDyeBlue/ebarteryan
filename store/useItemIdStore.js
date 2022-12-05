import create from "zustand";

const useItemIdStore = create((set) => ({
  item: null,
  setItem: (payload) =>
    set(() => ({
      item: payload,
    })),
}));

export default useItemIdStore;
