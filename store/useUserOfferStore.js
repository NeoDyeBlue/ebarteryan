import create from "zustand";
import { toast } from "react-hot-toast";

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
    console.log("s");
    try {
      set({ isSubmitting: true });
      const res = await fetch(`/api/offers/${get().item}`, {
        method: "POST",
        body: JSON.stringify(get().offer),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data && data.success) {
        set({ isSubmitting: false });
        toast.success("Offer Added");
        set({ offer: data.data });
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
