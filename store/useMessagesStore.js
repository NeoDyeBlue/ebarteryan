import create from "zustand";

const useMessagesStore = create((set) => ({
  isMessagesOpen: false,
  isPageConversationOpen: false,
  conversation: null,
  messageList: [],
  chatList: [],
  newChats: [],
  setIsMessagesOpen: (payload) =>
    set(() => ({
      isMessagesOpen: payload,
    })),
  setIsPageConversationOpen: (payload) =>
    set(() => ({
      isPageConversationOpen: payload,
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
  reset: () =>
    set(() => ({
      isMessagesOpen: false,
      conversation: null,
      messageList: [],
      chatList: [],
    })),
}));

export default useMessagesStore;
