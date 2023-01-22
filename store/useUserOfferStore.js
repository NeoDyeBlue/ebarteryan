import create from "zustand";
import useSocketStore from "./useSocketStore";
import useItemOffersStore from "./useItemOffersStore";
import { toast } from "react-hot-toast";

const useUserOfferStore = create((set, get) => ({
  item: "",
  offer: null,
  oldOffer: null,
  offerRetryBody: null,
  isSubmitting: false,
  isSubmitSuccess: false,
  isForUpdating: false,
  setItem: (payload) =>
    set(() => ({
      item: payload,
    })),
  setOffer: (payload) =>
    set(() => ({
      offer: payload,
    })),
  setOldOffer: (payload) =>
    set(() => ({
      oldOffer: payload,
    })),
  setOfferRetryBody: (payload) =>
    set(() => ({
      offerRetryBody: payload,
    })),
  setIsSubmitting: (payload) =>
    set(() => ({
      isSubmitting: payload,
    })),
  setIsSubmitSuccess: (payload) =>
    set(() => ({
      isSubmitSuccess: payload,
    })),
  setIsForUpdating: (payload) =>
    set(() => ({
      isForUpdating: payload,
    })),
  resubmit: async () => {
    try {
      set({ isSubmitting: true });
      set({ isSubmitSuccess: false });
      const res = await fetch(
        get().isForUpdating
          ? `/api/offers/${get().oldOffer?._id}`
          : `/api/items/${get().item}/offers`,
        {
          method: get().isForUpdating ? "PATCH" : "POST",
          body: JSON.stringify(get().offerRetryBody),
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await res.json();
      if (result && result.success) {
        set({ isSubmitting: false });
        set({ isSubmitSuccess: true });
        if (get().isForUpdating) {
          set({ oldOffer: null });
        } else {
          useSocketStore.getState().socket.emit("offer:create", {
            offer: result.data,
            room: result.data.item,
          });
        }
        set({ offer: result.data });
        set({ offerRetryBody: null });
        toast.success(get().isForUpdating ? "Offer updated" : "Offer added");
      } else {
        set({ isSubmitting: false });
        set({ isSubmitSuccess: false });
        toast.error(
          get().isForUpdating ? "Can't update offer" : "Can't add offer"
        );
      }
    } catch (error) {
      set({ isSubmitting: false });
      set({ isSubmitSuccess: false });
      toast.error(
        get().isForUpdating ? "Can't update offer" : "Can't add offer"
      );
    }
  },
}));

export default useUserOfferStore;
