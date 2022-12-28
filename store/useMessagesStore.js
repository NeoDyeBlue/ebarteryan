import create from "zustand";

const useMessagesStore = create((set) => ({
  isMessagesOpen: false,
  conversation: null,
  messageList: [],
  chatList: [],
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
  setChatList: (payload) =>
    set(() => ({
      chatList: payload,
    })),
}));

export default useMessagesStore;
