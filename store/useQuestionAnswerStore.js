import create from "zustand";

const useQuestionAnswerStore = create((set) => ({
  itemId: "",
  questions: [],
  totalQuestions: 0,
  setQuestions: (payload) =>
    set(() => ({
      questions: payload,
    })),
  setTotalQuestions: (payload) =>
    set(() => ({
      totalQuestions: payload,
    })),
  setItemId: (payload) =>
    set(() => ({
      itemId: payload,
    })),
}));

export default useQuestionAnswerStore;
