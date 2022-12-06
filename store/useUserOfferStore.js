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
      set({ isSubmitting: true });
      const res = await fetch(`/api/offers/${get().item}`, {
        method: "POST",
        body: JSON.stringify(get().offer),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      console.log(result);
      if (result && result.success) {
        set({ isSubmitting: false });
        set({ isSubmitSuccess: true });
        useSocketStore.getState().socket.emit("offer", {
          offer: result,
          room: result.data.docs[0].item,
        });
        useItemOffersStore.setState({ totalOffers: result.data.totalDocs });
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
