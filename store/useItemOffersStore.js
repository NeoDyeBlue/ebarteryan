import create from "zustand";

const useItemOffersStore = create((set) => ({
  offers: [],
  totalOffers: 0,
  setOffers: (payload) =>
    set(() => ({
      offers: payload,
    })),
  setTotalOffers: (payload) =>
    set(() => ({
      totalOffers: payload,
    })),
}));

export default useItemOffersStore;
