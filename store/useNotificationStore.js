import create from "zustand";

const useNotificationStore = create((set) => ({
  unreadCount: 0,
  notificationList: [],
  setNotificationList: (payload) =>
    set(() => ({
      notificationList: payload,
    })),
  setUnreadCount: (payload) =>
    set(() => ({
      unreadCount: payload,
    })),
}));

export default useNotificationStore;
