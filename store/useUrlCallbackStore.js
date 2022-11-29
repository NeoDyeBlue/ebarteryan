import create from "zustand";

const useUrlCallbackStore = create((set) => ({
  path: "",
  host: "",
  setPath: (payload) =>
    set(() => ({
      path: payload,
    })),
  setHost: (payload) =>
    set(() => ({
      host: payload,
    })),
}));

export default useUrlCallbackStore;
