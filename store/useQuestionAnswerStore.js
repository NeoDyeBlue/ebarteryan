import create from "zustand";

const useQuestionAnswerStore = create((set) => ({
  questions: [],
  setQuestions: (payload) =>
    set(() => ({
      questions: payload,
    })),
}));

export default useQuestionAnswerStore;
