import create from "zustand";

const useReviewStore = create((set) => ({
  reviewee: null,
  item: null,
  isReviewDone: false,
  setReviewee: (payload) =>
    set(() => ({
      reviewee: payload,
    })),
  setItem: (payload) =>
    set(() => ({
      item: payload,
    })),
  setIsReviewDone: (payload) =>
    set(() => ({
      isReviewDone: payload,
    })),
}));

export default useReviewStore;
