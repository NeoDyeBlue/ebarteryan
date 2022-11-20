import create from "zustand";
import useSocketStore from "./useSocketStore";
import { toast } from "react-hot-toast";

const { socket } = useSocketStore.getState();

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
      if (result && result.success) {
        set({ isSubmitting: false });
        socket.emit("offer", { offer: result.data, room: result.data.item });
        toast.success("Offer Added");
        set({ offer: result.data });
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
