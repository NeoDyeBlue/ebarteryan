import create from "zustand";

const useSocketStore = create((set) => ({
  socket: null,
  setSocket: (payload) =>
    set(() => ({
      socket: payload,
    })),
}));

export default useSocketStore;
