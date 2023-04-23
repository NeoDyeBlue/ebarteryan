import create from "zustand";

const useMessagesStore = create((set) => ({
  isMessagesOpen: false,
  isPageConversationOpen: false,
  isImageViewerOpen: false,
  conversation: null,
  prevConversation: null,
  offerChatData: null,
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
  setIsImageViewerOpen: (payload) =>
    set(() => ({
      isImageViewerOpen: payload,
    })),
  setOfferChatData: (payload) =>
    set(() => ({
      offerChatData: payload,
    })),
  setConversation: (payload) =>
    set(() => ({
      conversation: payload,
    })),
  setPrevConversation: (payload) =>
    set(() => ({
      prevConversation: payload,
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
