import create from "zustand";
import useSocketStore from "./useSocketStore";
import useItemOffersStore from "./useItemOffersStore";
// import { stall } from "../utils/test-utils";
import { toast } from "react-hot-toast";

// const { socket: socketStore } = useSocketStore.getState();
// console.log(socket);

const useUserOfferStore = create((set, get) => ({
  item: "",
  offer: null,
  isSubmitting: false,
  isSubmitSuccess: false,
  setItem: (payload) =>
    set(() => ({
      item: payload,
    })),
  setOffer: (payload) =>
    set(() => ({
      offer: payload,
    })),
  setIsSubmitting: (payload) =>
    set(() => ({
      isSubmitting: payload,
    })),
  setIsSubmitSuccess: (payload) =>
    set(() => ({
      isSubmitSuccess: payload,
    })),
  resubmit: async () => {
    try {
      console.log(get().item);
      set({ isSubmitting: true });
      const res = await fetch(`/api/items/${get().item}/offers`, {
        method: "POST",
        body: JSON.stringify(get().offer),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        set({ isSubmitting: false });
        set({ isSubmitSuccess: true });
        useSocketStore.getState().socket.emit("offer:create", {
          offer: result.data.offer,
          room: result.data.offer.item,
        });
        useItemOffersStore.setState({ totalOffers: result.data.totalOffers });
        toast.success("Offer Added");
        // set({ offer: result.data });
        set({ socket: null });
      } else {
        set({ isSubmitting: false });
        set({ isSubmitSuccess: false });
        toast.error("Can't add offer");
      }
    } catch (error) {
      console.log(error);
      set({ isSubmitting: false });
      set({ isSubmitSuccess: false });
      toast.error("Can't add offer");
    }
  },
}));

export default useUserOfferStore;
