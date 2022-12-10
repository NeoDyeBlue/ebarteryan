import create from "zustand";

const useMessagesStore = create((set) => ({
  isMessagesOpen: false,
  setIsMessagesOpen: (payload) =>
    set(() => ({
      isMessagesOpen: payload,
    })),
}));

export default useMessagesStore;
