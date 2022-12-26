import create from "zustand";

const useMessagesStore = create((set) => ({
  isMessagesOpen: false,
  conversation: null,
  setIsMessagesOpen: (payload) =>
    set(() => ({
      isMessagesOpen: payload,
    })),
  setConversation: (payload) =>
    set(() => ({
      conversation: payload,
    })),
}));

export default useMessagesStore;
