import create from "zustand";

const useMessagesStore = create((set) => ({
  isMessagesOpen: false,
  conversation: null,
  messageList: [],
  setIsMessagesOpen: (payload) =>
    set(() => ({
      isMessagesOpen: payload,
    })),
  setConversation: (payload) =>
    set(() => ({
      conversation: payload,
    })),
    setMessageList: (payload) =>
    set(() => ({
      messageList: payload,
    })),
}));

export default useMessagesStore;
