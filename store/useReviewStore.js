import create from "zustand";

const useReviewStore = create((set) => ({
  reviewee: null,
  item: null,
  setReviewee: (payload) =>
    set(() => ({
      reviewee: payload,
    })),
  setItem: (payload) =>
    set(() => ({
      item: payload,
    })),
}));

export default useReviewStore;
