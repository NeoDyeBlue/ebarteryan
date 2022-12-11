import create from "zustand";

const useItemOffersStore = create((set) => ({
  offers: [],
  acceptedOffer: null,
  totalOffers: 0,
  setOffers: (payload) =>
    set(() => ({
      offers: payload,
    })),
  setAcceptedOffer: (payload) =>
    set(() => ({
      acceptedOffer: payload,
    })),
  setTotalOffers: (payload) =>
    set(() => ({
      totalOffers: payload,
    })),
}));

export default useItemOffersStore;
