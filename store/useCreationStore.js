import create from "zustand";

const useCreationStore = create((set) => ({
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

export default useCreationStore;
