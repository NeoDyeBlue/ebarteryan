import create from "zustand";

const useUserItemStore = create((set) => ({
  item: null,
  setItem: (payload) =>
    set(() => ({
      item: payload,
    })),
}));

export default useUserItemStore;
